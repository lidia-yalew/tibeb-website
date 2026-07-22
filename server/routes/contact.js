const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markRead, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const pool = require('../config/db');

router.get('/unread-count', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) FROM contacts WHERE is_read = false'
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', protect, getMessages);
router.post('/', sendMessage);
router.put('/:id', protect, markRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
