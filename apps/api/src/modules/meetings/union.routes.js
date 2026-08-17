const express = require('express');
const store = require('../../db/store');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// List JCC meetings
router.get('/meetings', (req, res) => {
  res.json({
    meetings: store.UNION_MEETINGS,
    actions: store.UNION_ACTIONS,
    cba_negotiations: store.CBA_NEGOTIATIONS
  });
});

// Create new JCC meeting
router.post('/meetings', (req, res) => {
  const { title, meeting_date, meeting_type, location, agenda } = req.body;
  const newMeeting = {
    id: store.UNION_MEETINGS.length + 1,
    title: title || 'Joint Consultative Session',
    meeting_date: meeting_date || new Date().toISOString(),
    meeting_type: meeting_type || 'quarterly_jcc',
    location: location || 'Lagos Headquarters',
    agenda: agenda || '',
    minutes: '',
    status: 'scheduled',
    created_by_name: req.user.name || 'IR Lead',
    created_at: new Date().toISOString()
  };
  store.UNION_MEETINGS.unshift(newMeeting);

  store.AUDIT_LOGS.unshift({
    id: store.AUDIT_LOGS.length + 1,
    user_name: req.user.name || 'IR Admin',
    action: 'MEETING_SCHEDULED',
    entity_type: 'UnionMeeting',
    entity_id: String(newMeeting.id),
    details: { title: newMeeting.title },
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString()
  });

  res.status(201).json(newMeeting);
});

// Add JCC Action item
router.post('/actions', (req, res) => {
  const { meeting_id, action_title, owner_name, due_date, priority } = req.body;
  const newAction = {
    id: store.UNION_ACTIONS.length + 1,
    meeting_id: Number(meeting_id) || 1,
    action_title,
    owner_name: owner_name || req.user.name || 'Assigned Lead',
    due_date: due_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'pending',
    priority: priority || 'medium'
  };
  store.UNION_ACTIONS.push(newAction);
  res.status(201).json(newAction);
});

// Toggle JCC Action status
router.patch('/actions/:id', (req, res) => {
  const action = store.UNION_ACTIONS.find(a => String(a.id) === String(req.params.id));
  if (action) {
    action.status = req.body.status || 'completed';
  }
  res.json(action);
});

module.exports = router;
