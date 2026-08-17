const express = require('express');
const store = require('../../db/store');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/programs', (req, res) => {
  res.json({
    programs: store.TRAINING_PROGRAMS,
    completions: store.TRAINING_COMPLETIONS
  });
});

router.post('/complete', (req, res) => {
  const { program_id, user_name, department, location, score } = req.body;
  const newCompletion = {
    id: store.TRAINING_COMPLETIONS.length + 1,
    program_id: Number(program_id) || 1,
    user_name: user_name || req.user.name || 'Staff Member',
    department: department || req.user.department || 'Operations',
    location: location || req.user.location || 'Lagos',
    completion_date: new Date().toISOString().split('T')[0],
    score: score || 95,
    expiry_date: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
  };
  store.TRAINING_COMPLETIONS.unshift(newCompletion);
  res.status(201).json(newCompletion);
});

module.exports = router;
