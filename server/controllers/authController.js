const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const crypto = require('crypto');
const { sendResetEmail } = require('../Utile/Email');

// ── Forgot password (POST /api/auth/forgot-password) ──
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    const admin = result.rows[0];

    // Always respond the same way, whether or not the email exists
    const genericMessage = { message: 'If an account with that email exists, a reset link has been sent.' };

    if (!admin) return res.json(genericMessage);

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    await pool.query(
      'UPDATE admin_users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [hashedToken, expires, admin.id]
    );

    const resetLink = `${process.env.CLIENT_URL}/admin/reset-password?token=${rawToken}`;
    await sendResetEmail(admin.email, resetLink);

    res.json(genericMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Reset password (POST /api/auth/reset-password) ────
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    if (!token || !newPassword)
      return res.status(400).json({ message: 'Token and new password are required' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const result = await pool.query(
      'SELECT * FROM admin_users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [hashedToken]
    );
    const admin = result.rows[0];

    if (!admin)
      return res.status(400).json({ message: 'This link has expired or is invalid. Please request a new one.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE admin_users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [hashedPassword, admin.id]
    );

    res.json({ message: 'Your password has been reset successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM admin_users WHERE username = $1',
      [username]
    );
    const admin = result.rows[0];

    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    if (!admin.is_active) {
      return res.status(401).json({ message: 'This account has been deactivated' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ── Get profile (GET /api/auth/profile) ───────────────
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
    'SELECT id, name, email, username, role FROM admin_users WHERE id = $1',
    [req.user.id]   // ← whoever's JWT token is making the request
  );
    const admin = result.rows[0];
    if (!admin) return res.status(404).json({ message: 'User not found' });
    res.json({ user: admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Update profile (PUT /api/auth/profile) ────────────
const updateProfile = async (req, res) => {
  const { name, email, username } = req.body;
  try {
    // Check if username is taken by someone else
    if (username) {
      const taken = await pool.query(
        'SELECT id FROM admin_users WHERE username = $1 AND id != $2',
        [username, req.user.id]
      );
      if (taken.rows.length > 0)
        return res.status(400).json({ message: 'Username already taken' });
    }

    const result = await pool.query(
      `UPDATE admin_users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           username = COALESCE($3, username)
       WHERE id = $4
       RETURNING id, name, email, username, role`,
      [name, email, username, req.user.id]
    );

    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Change password (PUT /api/auth/change-password) ───
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both passwords are required' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const result = await pool.query(
      'SELECT * FROM admin_users WHERE id = $1',
      [req.user.id]
    );
    const admin = result.rows[0];
    if (!admin) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE admin_users SET password = $1 WHERE id = $2',
      [hashed, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword };