const express = require('express');
const controller = require('./dashboard.controller');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAuth);
router.get('/summary', controller.getSummary);

module.exports = router;
