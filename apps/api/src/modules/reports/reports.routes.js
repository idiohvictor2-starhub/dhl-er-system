const express = require('express');
const store = require('../../db/store');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/quarterly', (req, res) => {
  const totalCases = store.CASES.length;
  const openCases = store.CASES.filter(c => c.status !== 'closed');
  const closedCases = store.CASES.filter(c => c.status === 'closed');
  const overdueCases = store.CASES.filter(c => c.status !== 'closed' && c.sla_due_date && new Date(c.sla_due_date) < new Date());

  const quarterlyReport = {
    period: 'Q3 2026 (July - September)',
    organization: 'DHL Express Nigeria & Regional Outstations',
    generated_at: new Date().toISOString(),
    executive_summary: 'Overall Industrial Relations climate remains stable with 91.2% SLA adherence on case resolutions. Grievance volumes in Operations saw a 12% reduction following the introduction of first-line line manager conciliation training. Primary operational focus for Q3 centers on concluding the 2026-2028 National CBA negotiations and resolving Apapa Port PPE allocations.',
    metrics: {
      total_cases_tracked: totalCases,
      active_open_cases: openCases.length,
      cases_resolved_this_period: closedCases.length,
      overdue_cases_against_sla: overdueCases.length,
      average_resolution_days: 8.4,
      sla_compliance_rate: '91.2%',
      training_compliance_rate: '87.5%'
    },
    case_breakdown_by_category: [
      { category: 'Shift Rostering & Overtime', count: 3, percentage: '30%' },
      { category: 'Security & Manifest Infractions', count: 2, percentage: '20%' },
      { category: 'Union Hazard Allowances & PPE', count: 2, percentage: '20%' },
      { category: 'Workplace Conduct & Bullying', count: 1, percentage: '10%' },
      { category: 'Vehicle Safety & Telematics', count: 1, percentage: '10%' },
      { category: 'HR Policy & Pensions', count: 1, percentage: '10%' }
    ],
    location_performance: store.LOCATIONS.map(loc => {
      const count = store.CASES.filter(c => c.location.includes(loc.name) || c.location.includes(loc.code)).length;
      return {
        location: loc.name,
        code: loc.code,
        volume: count,
        risk_level: count > 3 ? 'Elevated' : 'Moderate',
        sla_adherence: '93%'
      };
    }),
    union_and_jcc_status: {
      total_meetings_held: 2,
      scheduled_sessions: 1,
      total_action_points: store.UNION_ACTIONS.length,
      completed_action_points: store.UNION_ACTIONS.filter(a => a.status === 'completed').length,
      cba_negotiation_stage: 'Stage 2: Shift Premium & Allowance Harmonisation'
    },
    risk_assessment_and_recommendations: [
      { area: 'Apapa Port Hub Heavy Fleet', risk: 'Delays in PPE uniform distribution may trigger localized work stoppages.', recommendation: 'Expedite procurement sign-off by 24 August 2026.' },
      { area: 'Night Cargo Clearance Attendance', risk: 'Unnotified absences at outstation gateways impact flight turnaround.', recommendation: 'Enforce 4-hour pre-shift standby dispatch notification.' },
      { area: 'Mid-Year Route Optimization Disputes', risk: 'Discontent regarding revised courier delivery boundaries in Lagos Lekki sector.', recommendation: 'Convene joint route verification with Courier Union Stewards.' }
    ]
  };

  store.AUDIT_LOGS.unshift({
    id: store.AUDIT_LOGS.length + 1,
    user_name: req.user.name || 'Management',
    action: 'REPORT_GENERATED',
    entity_type: 'Report',
    entity_id: 'QUARTERLY_IR_Q3_2026',
    details: { period: 'Q3 2026' },
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString()
  });

  res.json(quarterlyReport);
});

module.exports = router;
