const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (toEmail, resetLink) => {
  await transporter.sendMail({
    from: `"Tibeb Admin" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1A237E;">Reset Your Password</h2>
        <p>You requested a password reset for your Tibeb Admin account.</p>
        <p>Click the button below to set a new password. This link expires in 30 minutes.</p>
        <a href="${resetLink}"
           style="display: inline-block; background: #1A237E; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #888; font-size: 12px;">
          If you didn't request this, you can safely ignore this email — your password won't change.
        </p>
      </div>
    `,
  });
};

module.exports = { sendResetEmail };