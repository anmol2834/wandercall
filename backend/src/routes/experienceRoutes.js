const express = require('express');
const router = express.Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Experience routes' });
});

module.exports = router;