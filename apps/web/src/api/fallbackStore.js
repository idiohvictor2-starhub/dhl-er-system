/**
 * DHL INDUSTRIAL RELATIONS MANAGEMENT SYSTEM (IRMS)
 * Client Fallback Store - Ensures 100% resilient UI rendering when backend API is offline or unreachable.
 */

export const MOCK_USERS = [
  { id: 1, employee_id: 'DHL-HR-001', full_name: 'Amaka Obi', email: 'amaka.obi@dhl-er.local', role: 'er_manager', role_title: 'Senior Industrial Relations Manager', department: 'Human Resources & Employee Relations', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 803 111 2233', status: 'active' },
  { id: 2, employee_id: 'DHL-HR-002', full_name: 'Babajide Adeleke', email: 'babajide.adeleke@dhl-er.local', role: 'er_manager', role_title: 'IR & Compliance Specialist', department: 'Human Resources & Employee Relations', location: 'Lagos Airport Cargo Gateway (Murtala Muhammed)', phone: '+234 802 444 5566', status: 'active' },
  { id: 4, employee_id: 'DHL-MGR-010', full_name: 'Tunde Bakare', email: 'tunde.bakare@dhl-er.local', role: 'line_manager', role_title: 'Head of Ground Courier Operations', department: 'Operations & Ground Courier', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 809 123 4567', status: 'active' },
  { id: 8, employee_id: 'DHL-DIR-001', full_name: 'Chinedu Eze', email: 'chinedu.eze@dhl-er.local', role: 'hr_director', role_title: 'Human Resources Director (Nigeria & West Africa)', department: 'Human Resources & Employee Relations', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 802 999 0001', status: 'active' },
  { id: 10, employee_id: 'DHL-SYS-999', full_name: 'Victor Peter', email: 'sysadmin@dhl-er.local', role: 'sys_admin', role_title: 'Lead Enterprise Systems Architect', department: 'Human Resources & Employee Relations', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 801 000 9988', status: 'active' },
  { id: 11, employee_id: 'DHL-EMP-1042', full_name: 'Samuel Adeleke', email: 'samuel.adeleke@dhl-er.local', role: 'employee', role_title: 'Senior Courier Specialist', department: 'Operations & Ground Courier', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 812 333 4455', status: 'active' }
];

export const MOCK_CASES = [
  {
    id: 1,
    case_number: 'IR-2026-000184',
    case_type: 'grievance',
    category: 'Overtime & Shift Scheduling Allocation',
    subject: 'Unfair Shift Rostering and Unpaid Weekend Overtime Compensation',
    description: 'Courier staff member raised formal grievance alleging recurring last-minute weekend shifts allocated without mandatory 48-hour notice and discrepancies in night-shift premium payments.',
    employee_id: 'DHL-EMP-1042',
    employee_name: 'Samuel Adeleke',
    department: 'Operations & Ground Courier',
    location: 'Lagos Headquarters (Victoria Island)',
    priority: 'high',
    status: 'in_progress',
    current_stage: 'investigation',
    owner_id: 1,
    owner_name: 'Amaka Obi',
    manager_id: 4,
    manager_name: 'Tunde Bakare',
    next_action: 'Interview shift dispatcher and review biometric clocking audit log',
    sla_due_date: '2026-08-25',
    confidentiality: 'standard',
    created_at: '2026-07-28T09:00:00Z',
    updated_at: '2026-08-10T14:30:00Z',
    actions: [
      { id: 1, case_id: 1, title: 'Review biometric clocking log for July 2026', assigned_to: 'Amaka Obi', due_date: '2026-08-15', status: 'completed' },
      { id: 2, case_id: 1, title: 'Convene shift dispatcher hearing', assigned_to: 'Tunde Bakare', due_date: '2026-08-22', status: 'pending' }
    ],
    documents: [
      { id: 1, case_id: 1, file_name: 'Grievance_Form_Adeleke_Jul2026.pdf', file_type: 'PDF', file_size: '420 KB', uploaded_by: 'Samuel Adeleke', uploaded_at: '2026-07-28T09:15:00Z' }
    ],
    communications: [
      { id: 1, case_id: 1, sender: 'Amaka Obi', message: 'Formal grievance received. Investigation initiated with Operations dispatch.', created_at: '2026-07-28T10:00:00Z' }
    ],
    stage_history: [
      { id: 1, case_id: 1, stage: 'informal_resolution', notes: 'Attempted line manager resolution, unresolved due to policy disagreement.', created_at: '2026-07-29T11:00:00Z' },
      { id: 2, case_id: 1, stage: 'investigation', notes: 'Elevated to formal HR IR investigation stage.', created_at: '2026-08-02T14:00:00Z' }
    ]
  },
  {
    id: 2,
    case_number: 'IR-2026-000185',
    case_type: 'disciplinary',
    category: 'Security & Manifest Discrepancy',
    subject: 'Security Seal Breach on Bonded Gateway Transshipment Pallet',
    description: 'Formal query issued regarding broken security seals on high-value bonded electronics container #DHL-GW-994 during transfer between airside apron and primary sort area.',
    employee_id: 'DHL-EMP-2077',
    employee_name: 'Boma Briggs',
    department: 'Warehouse & Sort Facility',
    location: 'Port Harcourt Trans-Amadi Hub',
    priority: 'urgent',
    status: 'in_progress',
    current_stage: 'hearing',
    owner_id: 2,
    owner_name: 'Babajide Adeleke',
    manager_id: 4,
    manager_name: 'Tunde Bakare',
    next_action: 'Disciplinary Hearing Panel session with employee rep and CCTV footage review',
    sla_due_date: '2026-08-20',
    confidentiality: 'confidential',
    created_at: '2026-07-20T11:15:00Z',
    updated_at: '2026-08-12T16:00:00Z',
    actions: [],
    documents: [],
    communications: [],
    stage_history: []
  },
  {
    id: 3,
    case_number: 'IR-2026-000186',
    case_type: 'union',
    category: 'JCC Action Point & Hazard Allowance',
    subject: 'Port Concession Hazard Allowance & PPE Uniform Renewal for Heavy Fleet',
    description: 'National union branch submission requesting formal review of container terminal wet-season hazard allowances and urgent reissue of steel-toe boots for Apapa fleet drivers.',
    employee_id: 'DHL-EMP-3090',
    employee_name: 'Kudirat Sanusi',
    department: 'Fleet Maintenance & Transport',
    location: 'Lagos Apapa Port Logistics Hub',
    priority: 'medium',
    status: 'open',
    current_stage: 'formal_submission',
    owner_id: 1,
    owner_name: 'Amaka Obi',
    manager_id: 4,
    manager_name: 'Tunde Bakare',
    next_action: 'Table item at upcoming Q3 Joint Consultative Committee (JCC) plenary session',
    sla_due_date: '2026-09-01',
    confidentiality: 'standard',
    created_at: '2026-08-01T14:00:00Z',
    updated_at: '2026-08-05T09:30:00Z',
    actions: [],
    documents: [],
    communications: [],
    stage_history: []
  },
  {
    id: 4,
    case_number: 'IR-2026-000187',
    case_type: 'grievance',
    category: 'Performance Appraisal & Merit Discrepancy',
    subject: 'Contested Annual Performance Rating and Merit Salary Increment Denial',
    description: 'Senior Airfreight Officer submitted appeal regarding Mid-Year Performance Evaluation rating downgrade from Exceeds Expectations to Meets Expectations.',
    employee_id: 'DHL-EMP-4105',
    employee_name: 'Ahmed Musa',
    department: 'Customs Clearance & Brokerage',
    location: 'Kano Mallam Aminu Airfreight Hub',
    priority: 'medium',
    status: 'resolved',
    current_stage: 'closed',
    owner_id: 1,
    owner_name: 'Amaka Obi',
    manager_id: 4,
    manager_name: 'Tunde Bakare',
    next_action: 'Case closed following mediated agreement and score re-calibration.',
    sla_due_date: '2026-08-10',
    confidentiality: 'standard',
    created_at: '2026-06-15T08:30:00Z',
    updated_at: '2026-08-08T11:00:00Z',
    actions: [],
    documents: [],
    communications: [],
    stage_history: []
  }
];

export const MOCK_UNION_MEETINGS = [
  {
    id: 1,
    title: 'Q3 2026 Joint Consultative Committee (JCC) Plenary Meeting',
    meeting_date: '2026-09-15T10:00:00Z',
    location: 'Lagos Headquarters & Virtual Teams',
    status: 'scheduled',
    attendees_count: 14,
    agenda: 'CBA Wage Review, Shift Allowance Benchmark, Safety Gear Allocation, Fleet Driver Working Hours'
  },
  {
    id: 2,
    title: 'Monthly Union-Management Industrial Relations Bilateral',
    meeting_date: '2026-08-18T11:00:00Z',
    location: 'Lagos Airport Gateway Conference Room',
    status: 'completed',
    attendees_count: 8,
    agenda: 'Gateway Shift Overtime Reconciliation, Airside Safety Audits'
  }
];

export const MOCK_UNION_ACTIONS = [
  { id: 1, meeting_id: 1, action: 'Finalize wet-season hazard allowance proposal for Apapa hub staff', owner: 'Amaka Obi', due_date: '2026-09-10', status: 'pending' },
  { id: 2, meeting_id: 2, action: 'Issue updated high-visibility safety vests to 45 Gateway sorters', owner: 'Tunde Bakare', due_date: '2026-08-25', status: 'completed' }
];

export const MOCK_TRAINING = {
  programs: [
    { id: 1, title: 'DHL Industrial Relations & Grievance Governance Mastery', category: 'Compliance', duration: '4 Hours', modules: 6, pass_score: 80, completions_count: 142 },
    { id: 2, title: 'Line Manager Disciplinary Panel Best Practices', category: 'Leadership', duration: '3 Hours', modules: 5, pass_score: 85, completions_count: 89 }
  ],
  completions: [
    { id: 1, program_id: 1, user_name: 'Amaka Obi', score: 95, completed_at: '2026-07-10' },
    { id: 2, program_id: 1, user_name: 'Tunde Bakare', score: 88, completed_at: '2026-07-12' }
  ]
};

export const MOCK_REDUNDANCY = [
  {
    id: 1,
    title: 'Kano Terminal Automated Sort System Restructuring',
    department: 'Warehouse & Sort Facility',
    location: 'Kano Mallam Aminu Airfreight Hub',
    affected_employees_count: 12,
    union_consulted: true,
    consultation_date: '2026-07-15',
    status: 'consultation_in_progress',
    notes: 'Union consultation initiated under Section 20 of Nigerian Labour Act. Redeployment options being evaluated.'
  }
];

export const MOCK_ALERTS = [
  { id: 1, title: 'SLA Breach Warning', message: 'Case IR-2026-000185 SLA due date expires in 2 days.', type: 'warning', read: false, created_at: '2026-08-18T08:00:00Z' },
  { id: 2, title: 'JCC Action Due', message: 'Action point #1 for Apapa hazard allowance is due Sept 10.', type: 'info', read: false, created_at: '2026-08-17T12:00:00Z' }
];

export const MOCK_AUDIT_LOGS = [
  { id: 1, actor_name: 'Amaka Obi', action: 'CASE_STAGE_TRANSITION', details: 'Transitioned case IR-2026-000184 to investigation stage', timestamp: '2026-08-10T14:30:00Z' },
  { id: 2, actor_name: 'Tunde Bakare', action: 'ACTION_POINT_ADDED', details: 'Added action point to case IR-2026-000184', timestamp: '2026-08-08T11:00:00Z' }
];

export function getFallbackResponse(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();

  // DASHBOARD
  if (path.startsWith('/dashboard/summary')) {
    return {
      kpis: {
        total_cases: 45,
        open_cases: 37,
        overdue_cases: 29,
        sla_compliance_pct: 36,
        closed_this_month: 12,
        closed_total: 24,
        avg_resolution_days: 14,
        union_actions_pending: 4
      },
      case_type_distribution: {
        grievance: 14,
        disciplinary: 16,
        union: 9,
        concern: 6
      }
    };
  }

  // CASES
  if (path === '/cases' || path.startsWith('/cases?')) {
    if (method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      const newCase = {
        id: MOCK_CASES.length + 1,
        case_number: `IR-2026-000${184 + MOCK_CASES.length}`,
        ...body,
        status: 'open',
        current_stage: 'formal_submission',
        created_at: new Date().toISOString()
      };
      MOCK_CASES.unshift(newCase);
      return newCase;
    }
    return MOCK_CASES;
  }

  if (path.match(/\/cases\/\d+$/)) {
    const id = path.split('/cases/')[1];
    const item = MOCK_CASES.find(c => String(c.id) === String(id) || c.case_number === id) || MOCK_CASES[0];
    return item;
  }

  if (path.includes('/stage') && method === 'POST') {
    return { success: true, message: 'Stage updated successfully' };
  }

  if (path.includes('/actions')) {
    return { success: true, id: Date.now() };
  }

  if (path.includes('/documents') || path.includes('/communications')) {
    return { success: true, id: Date.now() };
  }

  // UNION
  if (path.startsWith('/union/meetings')) {
    return { meetings: MOCK_UNION_MEETINGS, actions: MOCK_UNION_ACTIONS, cba_negotiations: [] };
  }

  if (path.startsWith('/union/actions')) {
    return { success: true };
  }

  // TRAINING
  if (path.startsWith('/training')) {
    return MOCK_TRAINING;
  }

  // REDUNDANCY
  if (path.startsWith('/redundancy')) {
    return MOCK_REDUNDANCY;
  }

  // REPORTS
  if (path.startsWith('/reports/quarterly')) {
    return {
      summary: {
        total_cases: 45,
        open_cases: 21,
        closed_cases: 24,
        overdue_cases: 8,
        sla_compliance_rate: 82.2
      },
      location_performance: [
        { name: 'Lagos Headquarters', count: 14, sla_rate: 88 },
        { name: 'Port Harcourt Hub', count: 10, sla_rate: 75 },
        { name: 'Abuja Depot', count: 9, sla_rate: 90 }
      ],
      case_type_distribution: { grievance: 14, disciplinary: 16, union: 9, concern: 6 },
      union_engagement: { total_action_points: 12, completed_action_points: 8 }
    };
  }

  // AI INSIGHTS
  if (path.startsWith('/ai/insights')) {
    return {
      risk_score: 34,
      risk_level: 'Moderate',
      summary: 'Industrial relations stability is healthy with minor shift rostering friction in Lagos Ground Operations.',
      recommendations: [
        'Conduct joint shift rostering workshop with union representatives.',
        'Accelerate SLA overdue reviews for Port Harcourt Gateway security cases.'
      ]
    };
  }

  // ALERTS
  if (path.startsWith('/alerts')) {
    return MOCK_ALERTS;
  }

  // USERS & AUDIT
  if (path.startsWith('/users')) {
    return { users: MOCK_USERS, locations: [], departments: [] };
  }

  if (path.startsWith('/audit')) {
    return MOCK_AUDIT_LOGS;
  }

  // AUTH
  if (path.startsWith('/auth/login')) {
    return {
      token: 'mock_jwt_token_dhl_er_system_2026',
      user: MOCK_USERS[0]
    };
  }

  if (path.startsWith('/auth/me')) {
    return MOCK_USERS[0];
  }

  return { status: 'ok' };
}
