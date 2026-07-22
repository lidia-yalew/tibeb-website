const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const createAdmin = async (req, res) => {
  const { name, email, username, password, role } = req.body;

  try {
    if (!name || !email || !username || !password)
      return res.status(400).json({ message: 'Name, email, username and password are required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const allowedRoles = ['Admin', 'Super Admin'];
    const finalRole = allowedRoles.includes(role) ? role : 'Admin';

    const existing = await pool.query(
      'SELECT id FROM admin_users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (existing.rows.length > 0)
      return res.status(400).json({ message: 'Username or email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO admin_users (name, email, username, password, role, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       RETURNING id, name, email, username, role, is_active, created_at`,
      [name, email, username, hashed, finalRole]
    );

    res.status(201).json({ message: 'Admin created', admin: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, username, role, is_active, created_at
       FROM admin_users ORDER BY id ASC`
    );
    res.json({ admins: result.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const setAdminStatus = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    if (typeof is_active !== 'boolean')
      return res.status(400).json({ message: 'is_active must be true or false' });

    if (Number(id) === req.user.id)
      return res.status(400).json({ message: "You can't deactivate your own account" });

    if (!is_active) {
      const target = await pool.query('SELECT role FROM admin_users WHERE id = $1', [id]);
      if (target.rows[0]?.role === 'Super Admin') {
        const activeSupers = await pool.query(
          "SELECT COUNT(*) FROM admin_users WHERE role = 'Super Admin' AND is_active = true"
        );
        if (Number(activeSupers.rows[0].count) <= 1)
          return res.status(400).json({ message: 'Cannot deactivate the last active Super Admin' });
      }
    }

    const result = await pool.query(
      `UPDATE admin_users SET is_active = $1 WHERE id = $2
       RETURNING id, name, email, username, role, is_active`,
      [is_active, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Admin not found' });

    res.json({ message: `Admin ${is_active ? 'activated' : 'deactivated'}`, admin: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createAdmin, getAdmins, setAdminStatus };