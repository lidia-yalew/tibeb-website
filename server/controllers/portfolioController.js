const pool = require('../config/db');

const getPortfolio = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addProject = async (req, res) => {
  const { title, client, description, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO portfolio (title, client, description, date) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, client, description, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, client, description, date } = req.body;
  try {
    const result = await pool.query(
      'UPDATE portfolio SET title=$1, client=$2, description=$3, date=$4 WHERE id=$5 RETURNING *',
      [title, client, description, date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM portfolio WHERE id=$1', [id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPortfolio, addProject, updateProject, deleteProject };