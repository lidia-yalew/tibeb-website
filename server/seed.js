const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const seed = async () => {
  try {
    const password = await bcrypt.hash('tibeb2024', 10);
    await pool.query(
      'INSERT INTO admin_users (username, password) VALUES ($1, $2)',
      ['admin', password]
    );
    console.log('Admin user created successfully!');
    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seed();