const express = require('express');
const { registerProvider, sendEmailVerification, verifyEmailCode } = require('../controllers/providerController');

const router = express.Router();

// POST /api/providers/register
router.post('/register', registerProvider);

// POST /api/providers/send-verification
router.post('/send-verification', sendEmailVerification);

// POST /api/providers/verify-code
router.post('/verify-code', verifyEmailCode);

module.exports = router;