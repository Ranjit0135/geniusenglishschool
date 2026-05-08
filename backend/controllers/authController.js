const { User, School, sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { extractImageUrl } = require('../utils/uploadUtils');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signAccessToken = (id) => {
    const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access-secret';
    return jwt.sign({ id }, secret, {
        expiresIn: '365d'
    });
};

const sendTokens = (user, statusCode, res, school = null) => {
    const accessToken = signAccessToken(user.id);

    // Remove password from output
    user.password_hash = undefined;

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                school_id: user.school_id,
                avatar_url: user.avatar_url,
                is_verified: user.is_verified
            },
            school: school ? {
                id: school.id,
                name: school.name,
                setup_status: school.setup_status,
                is_approved: school.is_approved
            } : undefined
        }
    });
};

exports.signup = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { institutionName, email, password } = req.body;

        // 0. Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already registered. Please login instead.'
            });
        }

        // 1. Create School
        const school = await School.create({
            name: institutionName,
        }, { transaction: t });

        // 2. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Create Admin User
        const user = await User.create({
            school_id: school.id,
            email,
            name: institutionName,
            password_hash: password,
            role: 'ADMIN',
            verification_otp: otp,
            is_verified: false
        }, { transaction: t });

        // 4. Send Verification Email (or log OTP to terminal)
        const message = `Welcome to Genius School! Your verification code is: ${otp}`;
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #4f46e5; text-transform: uppercase;">Verify Your Account</h2>
                <p>Hello,</p>
                <p>Your 6-digit verification code is:</p>
                <h1 style="font-size: 32px; letter-spacing: 5px; color: #4f46e5; text-align: center;">${otp}</h1>
                <p style="font-size: 12px; color: #64748b;">This code is for your institution activation.</p>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Your Genius School Code: ' + otp,
            message,
            html
        });

        await t.commit();

        res.status(201).json({
            status: 'success',
            message: 'OTP sent to your email (and logged to terminal)',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    school_id: user.school_id,
                    is_verified: user.is_verified
                }
            }
        });
    } catch (err) {
        if (t && !t.finished) await t.rollback();
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: err.message || 'Signup failed'
        });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({
            where: { email, verification_otp: otp }
        });

        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid OTP code'
            });
        }

        user.is_verified = true;
        user.verification_otp = null;
        await user.save();

        const school = await School.findByPk(user.school_id);
        sendTokens(user, 200, res, school);

    } catch (err) {
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: 'Verification failed'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            });
        }

        if (!user.is_verified) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.verification_otp = otp;
            await user.save();

            const message = `Your Genius School verification code is: ${otp}`;
            await sendEmail({
                email: user.email,
                subject: 'Verify Your Genius School Account',
                message
            });

            return res.status(403).json({
                status: 'fail',
                code: 'NOT_VERIFIED',
                message: 'Please verify your email first. A new code has been sent to your inbox.',
                email: user.email
            });
        }

        const school = await School.findByPk(user.school_id);
        sendTokens(user, 200, res, school);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};

exports.googleLogin = async (req, res) => {
    let t;
    try {
        const { tokenId } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name, picture } = ticket.getPayload();

        let user = await User.findOne({ where: { email } });

        if (!user) {
            t = await sequelize.transaction();
            const school = await School.create({
                name: name + "'s Institution",
                subdomain: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4),
            }, { transaction: t });

            const randomPassword = crypto.randomBytes(16).toString('hex');
            user = await User.create({
                school_id: school.id,
                email,
                name,
                avatar_url: picture,
                password_hash: randomPassword,
                role: 'ADMIN',
                is_verified: true
            }, { transaction: t });

            await t.commit();
        } else {
            if (!user.is_verified) {
                user.is_verified = true;
                await user.save();
            }
        }

        const school = await School.findByPk(user.school_id);
        sendTokens(user, 200, res, school);
    } catch (err) {
        if (t && !t.finished) await t.rollback();
        console.error(err);
        res.status(400).json({
            status: 'fail',
            message: 'Google login failed: ' + (err.message || '')
        });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ status: 'fail', message: 'Email is required' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verification_otp = otp;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: 'New Verification Code - Genius School',
            message: `Your new verification code is: ${otp}`
        });

        res.json({ status: 'success', message: 'OTP resent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to resend OTP' });
    }
};

exports.getMe = async (req, res) => {
    // req.user already has School included from protect middleware
    const user = req.user;
    const school = user.School;

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                school_id: user.school_id,
                avatar_url: user.avatar_url,
                is_verified: user.is_verified
            },
            school: school ? {
                id: school.id,
                name: school.name,
                setup_status: school.setup_status,
                is_approved: school.is_approved
            } : undefined
        }
    });
};

exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ status: 'fail', message: 'No refresh token provided' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret');

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
        }

        const accessToken = signAccessToken(user.id);

        res.status(200).json({
            status: 'success',
            accessToken
        });
    } catch (err) {
        console.error(err);
        res.status(401).json({ status: 'fail', message: 'Invalid refresh token' });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

exports.updateCredentials = async (req, res) => {
    try {
        const { currentPassword, newEmail, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        const isChangingCredentials = (newEmail && newEmail !== user.email) || newPassword;

        // 1. Verify current password only if changing sensitive credentials
        if (isChangingCredentials) {
            if (!currentPassword || !(await user.comparePassword(currentPassword))) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Incorrect current password'
                });
            }
        }

        // 2. Prepare update data
        const updateData = {};
        if (newEmail && newEmail !== user.email) {
            // Check if email already exists
            const existingUser = await User.findOne({ where: { email: newEmail } });
            if (existingUser) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Email already in use'
                });
            }
            updateData.email = newEmail;
        }

        if (newPassword) {
            updateData.password_hash = newPassword; // Hooks in User model will hash this
        }

        if (req.body.name) {
            updateData.name = req.body.name;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'No changes provided'
            });
        }

        // 3. Update user
        await user.update(updateData);

        res.status(200).json({
            status: 'success',
            message: 'Credentials updated successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update credentials'
        });
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        const avatar_url = extractImageUrl(req, 'avatar');

        if (!avatar_url && !req.body.remove) {
            return res.status(400).json({
                status: 'fail',
                message: 'No image provided'
            });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        // Handle removal if requested
        user.avatar_url = req.body.remove ? null : avatar_url;
        await user.save();

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar_url: user.avatar_url
                }
            }
        });
    } catch (error) {
        console.error('Update avatar error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating the avatar'
        });
    }
};
