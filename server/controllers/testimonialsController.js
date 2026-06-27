const pool = require('../config/db');

const getTestimonials = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addTestimonial = async (req, res) => {
  const { client_name, client_role, organization, quote } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO testimonials (client_name, client_role, organization, quote) VALUES ($1,$2,$3,$4) RETURNING *',
      [client_name, client_role, organization, quote]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { client_name, client_role, organization, quote } = req.body;
  try {
    const result = await pool.query(
      'UPDATE testimonials SET client_name=$1, client_role=$2, organization=$3, quote=$4 WHERE id=$5 RETURNING *',
      [client_name, client_role, organization, quote, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM testimonials WHERE id=$1', [id]);
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial };