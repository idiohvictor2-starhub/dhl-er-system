const express = require('express');
const store = require('../../db/store');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json({
    users: store.USERS,
    locations: store.LOCATIONS,
    departments: store.DEPARTMENTS
  });
});

module.exports = router;
