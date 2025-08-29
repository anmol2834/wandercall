const express = require('express');
const { getUserRewards, redeemReward, earnXP, getXPHistory } = require('../controllers/rewardsController');
const router = express.Router();

// Get user rewards
router.get('/user/:userId', getUserRewards);

// Redeem reward
router.post('/redeem', redeemReward);

// Earn XP
router.post('/earn-xp', earnXP);

// Get XP history
router.get('/history/:userId', getXPHistory);

module.exports = router;