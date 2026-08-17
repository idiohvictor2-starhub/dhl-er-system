const express = require('express');
const store = require('../../db/store');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json(store.REDUNDANCY_CASES);
});

router.post('/', (req, res) => {
  const { employee_id, employee_name, department, location, case_type, union_consulted, redeployment_assessed } = req.body;
  const newCase = {
    id: store.REDUNDANCY_CASES.length + 1,
    employee_id: employee_id || 'DHL-EMP-9999',
    employee_name: employee_name || 'Staff Member',
    department: department || 'Operations',
    location: location || 'Lagos',
    case_type: case_type || 'redundancy',
    consultation_status: 'in_progress',
    union_consulted: !!union_consulted,
    redeployment_assessed: !!redeployment_assessed,
    severance_calculated: false,
    final_approval_status: 'draft',
    effective_date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
  };
  store.REDUNDANCY_CASES.unshift(newCase);
  res.status(201).json(newCase);
});

router.patch('/:id', (req, res) => {
  const item = store.REDUNDANCY_CASES.find(r => String(r.id) === String(req.params.id));
  if (item) {
    Object.assign(item, req.body);
  }
  res.json(item);
});

module.exports = router;
