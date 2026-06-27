const express = require('express');
const router = express.Router();
const { getTeam, addMember, updateMember, deleteMember } = require('../controllers/teamController');
const protect = require('../middleware/auth');

router.get('/', getTeam);
router.post('/', protect, addMember);
router.put('/:id', protect, updateMember);
router.delete('/:id', protect, deleteMember);

module.exports = router;