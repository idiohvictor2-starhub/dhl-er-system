const express = require('express');
const store = require('../../db/store');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  // Return alerts filtered by user role
  const userRole = req.user.role || 'employee';
  const filtered = store.ALERTS.filter(a => a.user_role === userRole || a.user_role === 'all' || userRole === 'er_manager' || userRole === 'hr_director');
  res.json(filtered);
});

router.patch('/:id/read', (req, res) => {
  const alert = store.ALERTS.find(a => String(a.id) === String(req.params.id));
  if (alert) {
    alert.is_read = true;
  }
  res.json(alert || {});
});

router.post('/mark-all-read', (req, res) => {
  store.ALERTS.forEach(a => { a.is_read = true; });
  res.json({ status: 'ok' });
});

module.exports = router;
