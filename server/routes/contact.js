const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markRead } = require('../controllers/contactController');
const protect = require('../middleware/auth');

router.get('/', protect, getMessages);
router.post('/', sendMessage);
router.put('/:id', protect, markRead);

module.exports = router;