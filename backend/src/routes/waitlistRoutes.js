const express = require('express');
const { joinWaitlist, checkWaitlistStatus } = require('../controllers/waitlistController');
const auth = require('../middleware/auth');
const router = express.Router();

// Public routes
router.post('/join', joinWaitlist);
router.get('/status', checkWaitlistStatus);

// Protected routes (optional authentication)
router.post('/join-authenticated', auth, joinWaitlist);
router.get('/status-authenticated', auth, checkWaitlistStatus);

module.exports = router;