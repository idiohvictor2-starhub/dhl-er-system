const express = require('express');
const dashboardRepo = require('./dashboard.repository');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/summary', async (req, res, next) => {
  try {
    const summary = await dashboardRepo.getSummary(req.user);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
