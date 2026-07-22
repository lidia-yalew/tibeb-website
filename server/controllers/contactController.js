const pool = require('../config/db');

const sendMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (name, email, phone, message) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, email, phone, message]
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
      'UPDATE messages SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendMessage, getMessages, markRead, deleteMessage };
