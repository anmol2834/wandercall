const express = require('express');
const { joinWaitlist, checkWaitlistStatus } = require('../controllers/waitlistController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/join', joinWaitlist);
router.get('/status', checkWaitlistStatus);

// Protected routes (optional authentication)
router.post('/join-authenticated', protect, joinWaitlist);
router.get('/status-authenticated', protect, checkWaitlistStatus);

module.exports = router;