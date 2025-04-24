const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminOverview } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/overview', protect, admin, getAdminOverview);

module.exports = router;
