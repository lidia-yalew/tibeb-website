const express = require('express');
const router = express.Router();
const { getPortfolio, addProject, updateProject, deleteProject } = require('../controllers/portfolioController');
const protect = require('../middleware/auth');

router.get('/', getPortfolio);
router.post('/', protect, addProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;