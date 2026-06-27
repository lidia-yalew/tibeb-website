const pool = require('../config/db');

const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (name, email, message) VALUES ($1,$2,$3) RETURNING *',
      [name, email, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markRead = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE messages SET is_read=true WHERE id=$1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendMessage, getMessages, markRead };