const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUser); // Read user data
router.put('/me', protect, updateUser); // Update user data
router.delete('/me', protect, deleteUser); // Delete user

module.exports = router;