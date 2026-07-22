const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  addTestimonial,
  submitTestimonial,
  publishToggle,
  deleteTestimonial,
  getPublishedTestimonials,
} = require('../controllers/testimonialsController');
const { protect } = require('../middleware/auth');

// ── PUBLIC routes (no login needed) ──────────────────────────────────────────

// Visitors: see only published testimonials on public pages
router.get('/published', getPublishedTestimonials);

// Clients: submit a new testimonial from the public website → saved as pending
router.post('/submit', submitTestimonial);

// Admin: get ALL testimonials (pending + approved) to manage in dashboard
router.get('/', protect, getTestimonials);

router.post('/', addTestimonial);

router.put('/:id/publish', protect, publishToggle);

// Admin: permanently delete a testimonial (used when rejecting)
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;