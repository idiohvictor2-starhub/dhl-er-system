const express = require('express');
const store = require('../../db/store');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json(store.AUDIT_LOGS);
});

module.exports = router;
