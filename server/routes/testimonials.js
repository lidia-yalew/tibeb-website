const express = require('express');
const router = express.Router();
const { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialsController');
const protect = require('../middleware/auth');

router.get('/', getTestimonials);
router.post('/', protect, addTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;