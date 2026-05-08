const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // For production, use a real service like SendGrid or Gmail
    // For development, use Mailtrap
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Genius School <hello@geniusschool.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // 3) Actually send the email
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log('\n--- DEVELOPMENT EMAIL LOG ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('--- END LOG ---\n');
    }
};

module.exports = sendEmail;
