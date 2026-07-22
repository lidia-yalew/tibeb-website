const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check the account is still active on every request
    const result = await pool.query('SELECT is_active FROM admin_users WHERE id = $1', [decoded.id]);
    const admin = result.rows[0];

    if (!admin || !admin.is_active) {
      return res.status(401).json({ message: 'Your account has been deactivated' });
    }

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
// Must be used AFTER `protect` — checks the caller is an active Super Admin
const requireSuperAdmin = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT role, is_active FROM admin_users WHERE id = $1',
      [req.user.id]
    );
    const admin = result.rows[0];

    if (!admin || !admin.is_active)
      return res.status(401).json({ message: 'Account not found or deactivated' });

    if (admin.role !== 'Super Admin')
      return res.status(403).json({ message: 'Super Admin access required' });

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { protect, requireSuperAdmin };