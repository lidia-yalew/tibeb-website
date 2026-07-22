const pool = require('../config/db');

// ─── ADMIN: Get ALL testimonials (pending + approved + rejected) ───────────────
const getTestimonials = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM testimonials ORDER BY submitted_at DESC, created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ADMIN: Add testimonial directly (goes straight to approved) ──────────────
const addTestimonial = async (req, res) => {
  const { client_name, client_role, organization, quote } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO testimonials 
         (client_name, client_role, organization, quote, status, is_published, submitted_at)
       VALUES ($1, $2, $3, $4, 'approved', true, NOW())
       RETURNING *`,
      [client_name, client_role, organization, quote]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PUBLIC: Client submits testimonial → always pending, never visible ───────
const submitTestimonial = async (req, res) => {
  // Field names match the public form
  const { client_name, client_role, organization, quote } = req.body;

  if (!client_name || !quote) {
    return res.status(400).json({ message: 'Name and testimonial are required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO testimonials 
         (client_name, client_role, organization, quote, status, is_published, submitted_at)
       VALUES ($1, $2, $3, $4, 'pending', false, NOW())
       RETURNING id`,
      [client_name, client_role || '', organization || '', quote]
    );
    res.status(201).json({
      success: true,
      message: 'Thank you! Your testimonial has been submitted and is pending review.',
      id: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ADMIN: Publish toggle ────────────────────────────────────────────────────
// Called with body: { status: 'approved' | 'pending' | 'rejected', is_published: true/false }
const publishToggle = async (req, res) => {
  const { id } = req.params;
  const { status, is_published } = req.body;

  // Validate status value
  const allowed = ['approved', 'pending', 'rejected'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const result = await pool.query(
      `UPDATE testimonials
         SET status       = $1,
             is_published = $2
       WHERE id = $3
       RETURNING *`,
      [status, is_published, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ADMIN: Hard delete (used for Reject = permanent delete) ─────────────────
const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM testimonials WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }
    res.json({ message: 'Testimonial permanently deleted.', id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PUBLIC: Only approved/published testimonials for visitors ────────────────
const getPublishedTestimonials = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, client_name, client_role, organization, quote, submitted_at, created_at
         FROM testimonials
        WHERE is_published = true
          AND status = 'approved'
        ORDER BY submitted_at DESC, created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTestimonials,
  addTestimonial,
  submitTestimonial,
  publishToggle,
  deleteTestimonial,
  getPublishedTestimonials,
};