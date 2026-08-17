const express = require('express');
const store = require('../../db/store');
const { requireAuth } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/insights', (req, res) => {
  const insights = {
    disclaimer: 'AI-generated insight — requires HR/management review. Designed as an advisory decision-support system only.',
    timestamp: new Date().toISOString(),
    executive_summary: {
      headline: 'Positive resolution velocity with localized shift-scheduling friction in Operations',
      key_finding: 'Grievance velocity is 18% faster than Q2. However, shift scheduling complaints across Victoria Island and Apapa hubs exhibit high semantic similarity (89% cluster match).'
    },
    emerging_clusters: [
      {
        cluster_id: 'CLUSTER-2026-A',
        topic: 'Shift Notice & Weekend Overtime Discrepancies',
        affected_departments: ['Operations & Ground Courier', 'Warehouse & Sort Facility'],
        affected_locations: ['Lagos Headquarters', 'Lagos Apapa Port Logistics Hub'],
        case_ids: ['IR-2026-000184', 'IR-2026-000191'],
        recurrence_frequency: '3 incidents in 45 days',
        ai_recommendation: 'Standardize automated SMS/Portal shift broadcast 48 hours prior to roster changes.'
      },
      {
        cluster_id: 'CLUSTER-2026-B',
        topic: 'Port Corridor Safety & Equipment Renewal',
        affected_departments: ['Fleet Maintenance & Transport'],
        affected_locations: ['Lagos Apapa Port Logistics Hub', 'Port Harcourt Trans-Amadi Hub'],
        case_ids: ['IR-2026-000186'],
        recurrence_frequency: 'Recurring JCC agenda item across 2 quarters',
        ai_recommendation: 'Prioritize PPE bulk delivery before August 28 JCC executive ratification.'
      }
    ],
    sla_risk_radar: [
      {
        case_number: 'IR-2026-000185',
        subject: 'Security Seal Breach on Bonded Gateway Transshipment Pallet',
        days_until_deadline: 3,
        risk_level: 'High',
        bottleneck: 'Awaiting hearing panel attendance confirmation from union observer.',
        recommended_action: 'Send urgent dispatch reminder to Union Steward.'
      },
      {
        case_number: 'IR-2026-000192',
        subject: 'Unexcused Absence During Scheduled Night Clearance',
        days_until_deadline: 1,
        risk_level: 'Critical',
        bottleneck: 'Employee response letter pending past 48-hour query timeline.',
        recommended_action: 'Issue Step-2 procedural reminder to Kano Duty Supervisor.'
      }
    ],
    training_remediation_signals: [
      {
        department: 'Operations & Ground Courier',
        signal: 'Informal conciliation success rate is lower in outstations compared to Lagos HQ.',
        intervention: 'Enroll outstation shift supervisors in "Grievance Handling & Conflict Resolution at First Line".'
      }
    ]
  };

  res.json(insights);
});

module.exports = router;
