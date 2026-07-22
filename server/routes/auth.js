const express = require('express');
const router = express.Router();
const { login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword } = require('../controllers/authController')
const { createAdmin, getAdmins, setAdminStatus } = require('../controllers/adminController'); // ← fixed: was authController
const { protect, requireSuperAdmin } = require('../middleware/auth');

// Public
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// Protected — require valid JWT
router.get('/profile',         protect, getProfile);
router.put('/profile',         protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Protected — Super Admin only
router.post('/admins',           protect, requireSuperAdmin, createAdmin);
router.get('/admins',            protect, requireSuperAdmin, getAdmins);
router.patch('/admins/:id/status', protect, requireSuperAdmin, setAdminStatus);

module.exports = router;