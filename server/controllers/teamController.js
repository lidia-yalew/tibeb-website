const pool = require('../config/db');

const getTeam = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addMember = async (req, res) => {
  const { name, role, department, bio, photo_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO team (name, role, department, bio, photo_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, role, department, bio, photo_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMember = async (req, res) => {
  const { id } = req.params;
  const { name, role, department, bio, photo_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE team SET name=$1, role=$2, department=$3, bio=$4, photo_url=$5 WHERE id=$6 RETURNING *',
      [name, role, department, bio, photo_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM team WHERE id=$1', [id]);
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTeam, addMember, updateMember, deleteMember };