const { SocialLink } = require('../models');

exports.getSocialLinks = async (req, res) => {
    try {
        console.log('--- GET SOCIAL LINKS TRACE ---');
        const { school_id } = req.query;
        const effective_school_id = school_id || (req.user ? req.user.school_id : null);

        console.log('Query school_id:', school_id);
        console.log('User school_id:', req.user ? req.user.school_id : 'No req.user');
        console.log('Effective school_id:', effective_school_id);

        if (!effective_school_id) {
            console.warn('No school ID found in request');
            return res.status(400).json({ message: 'School ID is required' });
        }

        const where = { school_id: effective_school_id };
        const links = await SocialLink.findAll({ where });
        console.log(`Found ${links.length} social links for school ${effective_school_id}`);
        res.json(links);
    } catch (error) {
        console.error('Error fetching social links:', error);
        res.status(500).json({ message: 'Error fetching social links', error: error.message });
    }
};

exports.createSocialLink = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { platform, url, is_active, icon_url: body_icon_url } = req.body;

        let icon_url = body_icon_url || null;
        if (req.file) {
            icon_url = req.file.path.replace(/\\/g, '/');
        }

        const newLink = await SocialLink.create({
            school_id,
            platform,
            url,
            icon_url,
            is_active: is_active === 'false' || is_active === false ? false : true
        });

        res.status(201).json(newLink);
    } catch (error) {
        res.status(500).json({ message: 'Error creating social link', error: error.message });
    }
};

exports.updateSocialLink = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const { platform, url, is_active, icon_url: body_icon_url } = req.body;

        const link = await SocialLink.findOne({ where: { id, school_id } });
        if (!link) return res.status(404).json({ message: 'Social link not found' });

        const updateData = { platform, url };
        if (is_active !== undefined) {
            updateData.is_active = (is_active === 'false' || is_active === false) ? false : true;
        }

        if (body_icon_url !== undefined) {
            updateData.icon_url = body_icon_url;
        }

        if (req.file) {
            updateData.icon_url = req.file.path.replace(/\\/g, '/');
        }

        await link.update(updateData);
        res.json(link);
    } catch (error) {
        res.status(500).json({ message: 'Error updating social link', error: error.message });
    }
};

exports.deleteSocialLink = async (req, res) => {
    try {
        const school_id = req.user.school_id;
        const { id } = req.params;
        const link = await SocialLink.findOne({ where: { id, school_id } });
        if (!link) return res.status(404).json({ message: 'Social link not found' });

        await link.destroy();
        res.json({ message: 'Social link deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting social link', error: error.message });
    }
};
