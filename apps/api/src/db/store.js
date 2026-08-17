/**
 * DHL INDUSTRIAL RELATIONS MANAGEMENT SYSTEM (IRMS)
 * Master In-Memory Synthetic Relational Data Store
 * Provides 50+ realistic enterprise cases, users, JCC meetings, actions, training, and audit logs.
 */

const LOCATIONS = [
  { id: 1, name: 'Lagos Headquarters (Victoria Island)', code: 'LOS-HQ', type: 'Headquarters' },
  { id: 2, name: 'Lagos Airport Cargo Gateway (Murtala Muhammed)', code: 'LOS-GW', type: 'Gateway' },
  { id: 3, name: 'Lagos Apapa Port Logistics Hub', code: 'LOS-APA', type: 'Hub' },
  { id: 4, name: 'Port Harcourt Trans-Amadi Hub', code: 'PHC-HUB', type: 'Hub' },
  { id: 5, name: 'Abuja Central Delivery Depot', code: 'ABV-DEP', type: 'Hub' },
  { id: 6, name: 'Kano Mallam Aminu Airfreight Hub', code: 'KAN-HUB', type: 'Hub' },
  { id: 7, name: 'Ibadan Express Station', code: 'IBA-STA', type: 'Station' }
];

const DEPARTMENTS = [
  { id: 1, name: 'Operations & Ground Courier', code: 'OPS' },
  { id: 2, name: 'Gateway & Aviation Logistics', code: 'GW-LOG' },
  { id: 3, name: 'Fleet Maintenance & Transport', code: 'FLEET' },
  { id: 4, name: 'Warehouse & Sort Facility', code: 'WHSE' },
  { id: 5, name: 'Customer Operations & Express Service', code: 'CS' },
  { id: 6, name: 'Customs Clearance & Brokerage', code: 'CCB' },
  { id: 7, name: 'Finance & Administration', code: 'FIN' },
  { id: 8, name: 'Human Resources & Employee Relations', code: 'HR' }
];

const USERS = [
  // IR / HR Admins
  { id: 1, employee_id: 'DHL-HR-001', full_name: 'Amaka Obi', email: 'amaka.obi@dhl-er.local', role: 'er_manager', role_title: 'Senior Industrial Relations Manager', department: 'Human Resources & Employee Relations', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 803 111 2233', status: 'active' },
  { id: 2, employee_id: 'DHL-HR-002', full_name: 'Babajide Adeleke', email: 'babajide.adeleke@dhl-er.local', role: 'er_manager', role_title: 'IR & Compliance Specialist', department: 'Human Resources & Employee Relations', location: 'Lagos Airport Cargo Gateway (Murtala Muhammed)', phone: '+234 802 444 5566', status: 'active' },
  { id: 3, employee_id: 'DHL-HR-003', full_name: 'Ngozi Okonkwo', email: 'ngozi.okonkwo@dhl-er.local', role: 'er_manager', role_title: 'Regional HR Lead (East & North)', department: 'Human Resources & Employee Relations', location: 'Port Harcourt Trans-Amadi Hub', phone: '+234 805 777 8899', status: 'active' },

  // Line Managers
  { id: 4, employee_id: 'DHL-MGR-010', full_name: 'Tunde Bakare', email: 'tunde.bakare@dhl-er.local', role: 'line_manager', role_title: 'Head of Ground Courier Operations', department: 'Operations & Ground Courier', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 809 123 4567', status: 'active' },
  { id: 5, employee_id: 'DHL-MGR-011', full_name: 'Grace Effiong', email: 'grace.effiong@dhl-er.local', role: 'line_manager', role_title: 'Warehouse Operations Manager', department: 'Warehouse & Sort Facility', location: 'Port Harcourt Trans-Amadi Hub', phone: '+234 807 234 5678', status: 'active' },
  { id: 6, employee_id: 'DHL-MGR-012', full_name: 'Ibrahim Danladi', email: 'ibrahim.danladi@dhl-er.local', role: 'line_manager', role_title: 'Fleet & Dispatch Superintendent', department: 'Fleet Maintenance & Transport', location: 'Abuja Central Delivery Depot', phone: '+234 806 345 6789', status: 'active' },
  { id: 7, employee_id: 'DHL-MGR-013', full_name: 'Emeka Anyaoku', email: 'emeka.anyaoku@dhl-er.local', role: 'line_manager', role_title: 'Gateway Customs & Freight Lead', department: 'Customs Clearance & Brokerage', location: 'Lagos Airport Cargo Gateway (Murtala Muhammed)', phone: '+234 810 456 7890', status: 'active' },

  // Executive Management
  { id: 8, employee_id: 'DHL-DIR-001', full_name: 'Chinedu Eze', email: 'chinedu.eze@dhl-er.local', role: 'hr_director', role_title: 'Human Resources Director (Nigeria & West Africa)', department: 'Human Resources & Employee Relations', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 802 999 0001', status: 'active' },
  { id: 9, employee_id: 'DHL-EXEC-002', full_name: 'Kofo Williams', email: 'kofo.williams@dhl-er.local', role: 'hr_director', role_title: 'Managing Director / VP Logistics Operations', department: 'Operations & Ground Courier', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 803 888 1122', status: 'active' },

  // System Admin
  { id: 10, employee_id: 'DHL-SYS-999', full_name: 'Victor Peter', email: 'sysadmin@dhl-er.local', role: 'sys_admin', role_title: 'Lead Enterprise Systems Architect', department: 'Human Resources & Employee Relations', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 801 000 9988', status: 'active' },

  // Staff / Employees
  { id: 11, employee_id: 'DHL-EMP-1042', full_name: 'Samuel Adeleke', email: 'samuel.adeleke@dhl-er.local', role: 'employee', role_title: 'Senior Courier Specialist', department: 'Operations & Ground Courier', location: 'Lagos Headquarters (Victoria Island)', phone: '+234 812 333 4455', status: 'active' },
  { id: 12, employee_id: 'DHL-EMP-2077', full_name: 'Boma Briggs', email: 'boma.briggs@dhl-er.local', role: 'employee', role_title: 'Warehouse Sort Specialist', department: 'Warehouse & Sort Facility', location: 'Port Harcourt Trans-Amadi Hub', phone: '+234 813 444 5566', status: 'active' },
  { id: 13, employee_id: 'DHL-EMP-3090', full_name: 'Kudirat Sanusi', email: 'kudirat.sanusi@dhl-er.local', role: 'employee', role_title: 'Ground Fleet Driver & Union Steward', department: 'Fleet Maintenance & Transport', location: 'Lagos Apapa Port Logistics Hub', phone: '+234 814 555 6677', status: 'active' },
  { id: 14, employee_id: 'DHL-EMP-4105', full_name: 'Ahmed Musa', email: 'ahmed.musa@dhl-er.local', role: 'employee', role_title: 'Airfreight Clearance Officer', department: 'Customs Clearance & Brokerage', location: 'Kano Mallam Aminu Airfreight Hub', phone: '+234 815 666 7788', status: 'active' },
  { id: 15, employee_id: 'DHL-EMP-5210', full_name: 'Folake Adeyemi', email: 'folake.adeyemi@dhl-er.local', role: 'employee', role_title: 'Customer Service Representative', department: 'Customer Operations & Express Service', location: 'Abuja Central Delivery Depot', phone: '+234 816 777 8899', status: 'active' }
];

let CASES = [
  {
    id: 1,
    case_number: 'IR-2026-000184',
    case_type: 'grievance',
    category: 'Overtime & Shift Scheduling Allocation',
    subject: 'Unfair Shift Rostering and Unpaid Weekend Overtime Compensation',
    description: 'Courier staff member raised formal grievance alleging recurring last-minute weekend shifts allocated without mandatory 48-hour notice and discrepancies in night-shift premium payments for July 2026 cycles.',
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
    action_owner_id: 1,
    sla_due_date: '2026-08-25',
    resolution_date: null,
    outcome: null,
    appeal_status: null,
    confidentiality: 'standard',
    created_at: '2026-07-28T09:00:00Z',
    updated_at: '2026-08-10T14:30:00Z'
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
    owner_id: 3,
    owner_name: 'Ngozi Okonkwo',
    manager_id: 5,
    manager_name: 'Grace Effiong',
    next_action: 'Disciplinary Hearing Panel session with employee rep and CCTV footage review',
    action_owner_id: 3,
    sla_due_date: '2026-08-20',
    resolution_date: null,
    outcome: null,
    appeal_status: null,
    confidentiality: 'confidential',
    created_at: '2026-07-20T11:15:00Z',
    updated_at: '2026-08-12T16:00:00Z'
  },
  {
    id: 3,
    case_number: 'IR-2026-000186',
    case_type: 'union',
    category: 'JCC Action Point & Hazard Allowance',
    subject: 'Port Concession Hazard Allowance & PPE Uniform Renewal for Heavy Fleet',
    description: 'National union branch submission requesting formal review of container terminal wet-season hazard allowances and urgent reissue of steel-toe boots for Apapa fleet drivers.',
    employee_id: 'DHL-EMP-3090',
    employee_name: 'Kudirat Sanusi (Union Steward)',
    department: 'Fleet Maintenance & Transport',
    location: 'Lagos Apapa Port Logistics Hub',
    priority: 'high',
    status: 'in_progress',
    current_stage: 'decision',
    owner_id: 1,
    owner_name: 'Amaka Obi',
    manager_id: 6,
    manager_name: 'Ibrahim Danladi',
    next_action: 'Present cost analysis and PPE procurement schedule at next JCC Executive Session',
    action_owner_id: 1,
    sla_due_date: '2026-08-30',
    resolution_date: null,
    outcome: null,
    appeal_status: null,
    confidentiality: 'standard',
    created_at: '2026-07-15T10:00:00Z',
    updated_at: '2026-08-14T11:00:00Z'
  },
  {
    id: 4,
    case_number: 'IR-2026-000187',
    case_type: 'grievance',
    category: 'Workplace Bullying & Communication',
    subject: 'Allegation of Inappropriate Verbal Conduct during Sort Peak Hours',
    description: 'Formal grievance filed by sorting supervisor citing verbal abuse and public reprimands during midnight sort shift on July 2nd.',
    employee_id: 'DHL-EMP-4105',
    employee_name: 'Ahmed Musa',
    department: 'Warehouse & Sort Facility',
    location: 'Kano Mallam Aminu Airfreight Hub',
    priority: 'medium',
    status: 'closed',
    current_stage: 'closed',
    owner_id: 3,
    owner_name: 'Ngozi Okonkwo',
    manager_id: 6,
    manager_name: 'Ibrahim Danladi',
    next_action: null,
    action_owner_id: null,
    sla_due_date: '2026-08-05',
    resolution_date: '2026-08-04T15:00:00Z',
    outcome: 'Resolved through structured conciliation. Line supervisor issued written advisory and enrolled in Leadership Communication coaching.',
    appeal_status: 'none',
    confidentiality: 'confidential',
    created_at: '2026-07-03T08:30:00Z',
    updated_at: '2026-08-04T15:00:00Z'
  },
  {
    id: 5,
    case_number: 'IR-2026-000188',
    case_type: 'disciplinary',
    category: 'Vehicle Safety & Telematics Infraction',
    subject: 'Repeated Speed Telematics Alert on Lagos-Ibadan Express Corridor',
    description: 'Fleet telematics recorded 4 consecutive severe speeding breaches (>105 km/h) in heavy rain condition on 5-ton delivery vehicle #LOS-288.',
    employee_id: 'DHL-EMP-5210',
    employee_name: 'Folake Adeyemi',
    department: 'Fleet Maintenance & Transport',
    location: 'Ibadan Express Station',
    priority: 'medium',
    status: 'closed',
    current_stage: 'closed',
    owner_id: 2,
    owner_name: 'Babajide Adeleke',
    manager_id: 6,
    manager_name: 'Ibrahim Danladi',
    next_action: null,
    action_owner_id: null,
    sla_due_date: '2026-07-25',
    resolution_date: '2026-07-22T12:00:00Z',
    outcome: 'Final written warning issued and mandatory 1-day Defensive Driving Recertification completed.',
    appeal_status: 'none',
    confidentiality: 'standard',
    created_at: '2026-07-08T09:00:00Z',
    updated_at: '2026-07-22T12:00:00Z'
  },
  {
    id: 6,
    case_number: 'IR-2026-000189',
    case_type: 'concern',
    category: 'Health & Ergonomics',
    subject: 'Inadequate Ventilation in Heavy Parcel Packaging Station',
    description: 'Staff group concern regarding cooling fans and ergonomic packing benches during afternoon humidity spikes in Terminal 2.',
    employee_id: 'DHL-EMP-1042',
    employee_name: 'Samuel Adeleke',
    department: 'Warehouse & Sort Facility',
    location: 'Lagos Airport Cargo Gateway (Murtala Muhammed)',
    priority: 'medium',
    status: 'in_progress',
    current_stage: 'investigation',
    owner_id: 2,
    owner_name: 'Babajide Adeleke',
    manager_id: 7,
    manager_name: 'Emeka Anyaoku',
    next_action: 'Facilities team inspection and quote for industrial exhaust fans',
    action_owner_id: 2,
    sla_due_date: '2026-08-28',
    resolution_date: null,
    outcome: null,
    appeal_status: null,
    confidentiality: 'standard',
    created_at: '2026-08-01T14:00:00Z',
    updated_at: '2026-08-10T10:00:00Z'
  },
  {
    id: 7,
    case_number: 'IR-2026-000190',
    case_type: 'query',
    category: 'Pension & Voluntary Contribution',
    subject: 'Clarification on Additional Voluntary Contribution (AVC) Tax Relief',
    description: 'HR policy inquiry requesting clarification on recent payroll circular regarding pension AVC deductions and monthly pay slip tax exemption computations.',
    employee_id: 'DHL-EMP-5210',
    employee_name: 'Folake Adeyemi',
    department: 'Customer Operations & Express Service',
    location: 'Abuja Central Delivery Depot',
    priority: 'low',
    status: 'closed',
    current_stage: 'closed',
    owner_id: 1,
    owner_name: 'Amaka Obi',
    manager_id: 6,
    manager_name: 'Ibrahim Danladi',
    next_action: null,
    action_owner_id: null,
    sla_due_date: '2026-08-12',
    resolution_date: '2026-08-11T16:30:00Z',
    outcome: 'Detailed policy advisory and Pension Fund Administrator calculation guide provided to employee.',
    appeal_status: 'none',
    confidentiality: 'standard',
    created_at: '2026-08-08T11:00:00Z',
    updated_at: '2026-08-11T16:30:00Z'
  },
  {
    id: 8,
    case_number: 'IR-2026-000191',
    case_type: 'grievance',
    category: 'Performance Appraisal Dispute',
    subject: 'Contested Annual Performance Rating Following Route Optimization Reassignment',
    description: 'Senior delivery courier contests mid-year KPI score deduction following automated dispatch system route pilot in Lekki/Epe expressway.',
    employee_id: 'DHL-EMP-1042',
    employee_name: 'Samuel Adeleke',
    department: 'Operations & Ground Courier',
    location: 'Lagos Headquarters (Victoria Island)',
    priority: 'medium',
    status: 'in_progress',
    current_stage: 'formal_submission',
    owner_id: 1,
    owner_name: 'Amaka Obi',
    manager_id: 4,
    manager_name: 'Tunde Bakare',
    next_action: 'Joint review of dispatch route baseline metrics with Operations Engineering',
    action_owner_id: 4,
    sla_due_date: '2026-08-27',
    resolution_date: null,
    outcome: null,
    appeal_status: null,
    confidentiality: 'standard',
    created_at: '2026-08-09T13:00:00Z',
    updated_at: '2026-08-15T09:00:00Z'
  },
  {
    id: 9,
    case_number: 'IR-2026-000192',
    case_type: 'disciplinary',
    category: 'Attendance & Unauthorized Absence',
    subject: 'Unexcused Absence During Scheduled Bonded Airfreight Night Clearance',
    description: 'Airfreight officer failed to report for designated 22:00 cargo flight arrival without prior notification to Duty Manager.',
    employee_id: 'DHL-EMP-4105',
    employee_name: 'Ahmed Musa',
    department: 'Customs Clearance & Brokerage',
    location: 'Kano Mallam Aminu Airfreight Hub',
    priority: 'high',
    status: 'in_progress',
    current_stage: 'employee_response',
    owner_id: 3,
    owner_name: 'Ngozi Okonkwo',
    manager_id: 7,
    manager_name: 'Emeka Anyaoku',
    next_action: 'Await formal employee explanation letter (Due: 18 Aug)',
    action_owner_id: 3,
    sla_due_date: '2026-08-18',
    resolution_date: null,
    outcome: null,
    appeal_status: null,
    confidentiality: 'standard',
    created_at: '2026-08-12T07:00:00Z',
    updated_at: '2026-08-14T11:00:00Z'
  },
  {
    id: 10,
    case_number: 'IR-2026-000193',
    case_type: 'union',
    category: 'CBA Review & Transport Subsidy',
    subject: 'Transport Allowance Escalation Following Fuel Price Adjustments',
    description: 'Union Joint Consultative Committee proposal for interim transport relief subvention for field operations staff across outstations.',
    employee_id: 'DHL-EMP-3090',
    employee_name: 'Kudirat Sanusi',
    department: 'Operations & Ground Courier',
    location: 'Lagos Headquarters (Victoria Island)',
    priority: 'urgent',
    status: 'in_progress',
    current_stage: 'hearing',
    owner_id: 1,
    owner_name: 'Amaka Obi',
    manager_id: 4,
    manager_name: 'Tunde Bakare',
    next_action: 'Management committee review with Finance Director',
    action_owner_id: 1,
    sla_due_date: '2026-08-22',
    resolution_date: null,
    outcome: null,
    appeal_status: null,
    confidentiality: 'standard',
    created_at: '2026-08-05T10:00:00Z',
    updated_at: '2026-08-16T15:00:00Z'
  }
];

let STAGE_HISTORY = [
  { id: 1, case_id: 1, stage: 'informal_resolution', entered_at: '2026-07-28T09:00:00Z', exited_at: '2026-08-02T11:00:00Z', actor_name: 'Samuel Adeleke', notes: 'Informal discussions with Shift Lead did not resolve weekend overtime rate discrepancy.' },
  { id: 2, case_id: 1, stage: 'formal_submission', entered_at: '2026-08-02T11:00:00Z', exited_at: '2026-08-06T14:00:00Z', actor_name: 'Amaka Obi', notes: 'Formal grievance accepted under Step 2 of DHL National Employee Relations Policy.' },
  { id: 3, case_id: 1, stage: 'investigation', entered_at: '2026-08-06T14:00:00Z', exited_at: null, actor_name: 'Amaka Obi', notes: 'Payroll timesheets and biometric gate logs requested for July 1-31 cycle.' },

  { id: 4, case_id: 2, stage: 'formal_submission', entered_at: '2026-07-20T11:15:00Z', exited_at: '2026-07-25T09:00:00Z', actor_name: 'Ngozi Okonkwo', notes: 'Security audit report #SEC-PHC-881 attached. Formal query served.' },
  { id: 5, case_id: 2, stage: 'investigation', entered_at: '2026-07-25T09:00:00Z', exited_at: '2026-08-05T16:00:00Z', actor_name: 'Ngozi Okonkwo', notes: 'Statements taken from ramp handling crew and warehouse security supervisor.' },
  { id: 6, case_id: 2, stage: 'hearing', entered_at: '2026-08-05T16:00:00Z', exited_at: null, actor_name: 'Grace Effiong', notes: 'Hearing scheduled with employee and union representative.' },

  { id: 7, case_id: 3, stage: 'formal_submission', entered_at: '2026-07-15T10:00:00Z', exited_at: '2026-07-22T10:00:00Z', actor_name: 'Amaka Obi', notes: 'Union charter submission acknowledged by ER Manager.' },
  { id: 8, case_id: 3, stage: 'investigation', entered_at: '2026-07-22T10:00:00Z', exited_at: '2026-08-08T12:00:00Z', actor_name: 'Amaka Obi', notes: 'Site inspection conducted at Apapa logistics terminal with safety coordinator.' },
  { id: 9, case_id: 3, stage: 'decision', entered_at: '2026-08-08T12:00:00Z', exited_at: null, actor_name: 'Chinedu Eze', notes: 'Awaiting HR Director and Procurement sign-off on upgraded PPE distribution schedule.' }
];

let ACTIONS = [
  { id: 1, case_id: 1, action_title: 'Audit Biometric Clocking Records', description: 'Extract July biometric log from Victoria Island sort gate #2', owner_name: 'Amaka Obi', owner_id: 1, due_date: '2026-08-19', status: 'in_progress', priority: 'high' },
  { id: 2, case_id: 1, action_title: 'Interview Shift Line Manager', description: 'Take formal statement regarding roster change communication protocol', owner_name: 'Tunde Bakare', owner_id: 4, due_date: '2026-08-22', status: 'pending', priority: 'medium' },
  { id: 3, case_id: 2, action_title: 'Submit Security CCTV Timestamp Footage', description: 'Preserve apron CCTV footage file for pallet transfer window', owner_name: 'Ngozi Okonkwo', owner_id: 3, due_date: '2026-08-18', status: 'completed', priority: 'urgent' },
  { id: 4, case_id: 2, action_title: 'Conduct Hearing Session with Union Observer', description: 'Convene tripartite hearing in Port Harcourt Boardroom B', owner_name: 'Grace Effiong', owner_id: 5, due_date: '2026-08-20', status: 'pending', priority: 'urgent' },
  { id: 5, case_id: 3, action_title: 'Prepare PPE Procurement Costing Sheet', description: 'Compile cost estimates for 140 pairs of heavy-duty safety footwear', owner_name: 'Babajide Adeleke', owner_id: 2, due_date: '2026-08-25', status: 'in_progress', priority: 'high' },
  { id: 6, case_id: 6, action_title: 'Inspect Terminal 2 Ventilation Units', description: 'On-site technical evaluation with facility contractor', owner_name: 'Emeka Anyaoku', owner_id: 7, due_date: '2026-08-21', status: 'pending', priority: 'medium' }
];

let DOCUMENTS = [
  { id: 1, case_id: 1, document_name: 'Employee_Statement_Samuel_Adeleke.pdf', file_url: '/documents/case_1_statement.pdf', document_type: 'statement', file_size_kb: 245, uploaded_by_name: 'Samuel Adeleke', uploaded_at: '2026-08-02T11:00:00Z' },
  { id: 2, case_id: 1, document_name: 'July_Shift_Roster_Ops_VI.xlsx', file_url: '/documents/july_roster.xlsx', document_type: 'evidence', file_size_kb: 512, uploaded_by_name: 'Tunde Bakare', uploaded_at: '2026-08-07T09:30:00Z' },
  { id: 3, case_id: 2, document_name: 'Security_Incident_Audit_SEC-PHC-881.pdf', file_url: '/documents/sec_audit.pdf', document_type: 'report', file_size_kb: 1040, uploaded_by_name: 'Ngozi Okonkwo', uploaded_at: '2026-07-22T14:15:00Z' },
  { id: 4, case_id: 3, document_name: 'Union_JCC_Resolution_Apapa_Hazard.pdf', file_url: '/documents/jcc_hazard_memo.pdf', document_type: 'minutes', file_size_kb: 380, uploaded_by_name: 'Kudirat Sanusi', uploaded_at: '2026-07-16T10:00:00Z' }
];

let COMMUNICATIONS = [
  { id: 1, case_id: 1, sender_name: 'Samuel Adeleke', sender_role: 'employee', message: 'I have attached my shift roster notifications and pay slip breakdown showing the missing 18 hours of weekend premium.', is_internal: false, created_at: '2026-08-02T11:15:00Z' },
  { id: 2, case_id: 1, sender_name: 'Amaka Obi', sender_role: 'er_manager', message: 'Thank you Samuel. Case IR-2026-000184 has moved into formal investigation. We have requested timesheet reconciliation from Operations.', is_internal: false, created_at: '2026-08-06T14:10:00Z' },
  { id: 3, case_id: 1, sender_name: 'Tunde Bakare', sender_role: 'line_manager', message: 'Internal Note: The Saturday surge was an emergency customs release. We will review whether notification was sent to personal phones or portal.', is_internal: true, created_at: '2026-08-08T10:00:00Z' },
  { id: 4, case_id: 2, sender_name: 'Ngozi Okonkwo', sender_role: 'er_manager', message: 'Hearing notice delivered to Boma Briggs and Port Harcourt Union Representative Comrade Williams for Thursday 20 Aug 10:00 AM.', is_internal: false, created_at: '2026-08-12T16:15:00Z' }
];

let UNION_MEETINGS = [
  {
    id: 1,
    title: 'Q3 2026 National Joint Consultative Committee (JCC) Executive Session',
    meeting_date: '2026-08-28T10:00:00Z',
    meeting_type: 'quarterly_jcc',
    location: 'Lagos Headquarters Boardroom & Virtual Hubs',
    agenda: '1. National transport allowance review; 2. Modernization of sorting hub safety gear; 3. Disciplinary procedure turnaround times; 4. Annual peak season temporary staffing quotas.',
    minutes: 'Draft agenda ratified. Financial models prepared for presentation to National Transport Union executives.',
    status: 'scheduled',
    created_by_name: 'Amaka Obi',
    created_at: '2026-08-01T09:00:00Z'
  },
  {
    id: 2,
    title: 'Apapa Port Hub Drivers Consultative Forum',
    meeting_date: '2026-07-24T11:00:00Z',
    meeting_type: 'safety_committee',
    location: 'Lagos Apapa Port Logistics Hub',
    agenda: '1. Port terminal congestion safety guidelines; 2. Review of night container escort protocols; 3. Wet-season emergency vehicle recovery.',
    minutes: 'Agreed on 3 specific action points for equipment maintenance and personal protective gear renewal.',
    status: 'completed',
    created_by_name: 'Babajide Adeleke',
    created_at: '2026-07-10T14:00:00Z'
  },
  {
    id: 3,
    title: 'Bi-Annual CBA Salary & Welfare Review Consultation',
    meeting_date: '2026-09-15T09:30:00Z',
    meeting_type: 'cba_negotiation',
    location: 'Lagos Headquarters (Victoria Island)',
    agenda: '1. Review of benchmark cost of living index; 2. Shift allowance harmonisation across outstation hubs; 3. Health insurance coverage tier expansion.',
    minutes: 'Preliminary position papers exchanged between DHL Management and Union Representatives.',
    status: 'scheduled',
    created_by_name: 'Chinedu Eze',
    created_at: '2026-08-05T12:00:00Z'
  }
];

let UNION_ACTIONS = [
  { id: 1, meeting_id: 1, action_title: 'Finalize Transport Relief Impact Model', owner_name: 'Chinedu Eze', due_date: '2026-08-24', status: 'in_progress', priority: 'high' },
  { id: 2, meeting_id: 2, action_title: 'Issue 140 Steel-Toe Safety Boots to Apapa Drivers', owner_name: 'Ibrahim Danladi', due_date: '2026-08-30', status: 'in_progress', priority: 'urgent' },
  { id: 3, meeting_id: 2, action_title: 'Install Rainproof Shelter at Dispatch Bay 4', owner_name: 'Babajide Adeleke', due_date: '2026-08-15', status: 'completed', priority: 'medium' }
];

let CBA_NEGOTIATIONS = [
  {
    id: 1,
    title: '2026-2028 National Collective Bargaining Agreement (CBA) Review',
    proposal_summary: 'Comprehensive review of shift premiums, transport subsidy indexation, and annual medical insurance wellness allowance for unionized staff.',
    stage: 'negotiation',
    effective_date: '2026-10-01',
    union_rep_lead: 'Comrade Festus Adebayo (General Secretary)',
    management_lead_name: 'Chinedu Eze (HR Director)',
    notes: 'Stage 2 negotiation round completed. Both sides agreed in principle on 14% shift premium adjustment pending final executive sign-off.'
  }
];

let REDUNDANCY_CASES = [
  {
    id: 1,
    employee_id: 'DHL-EMP-9011',
    employee_name: 'Patrick Odoh',
    department: 'Customs Clearance & Brokerage',
    location: 'Port Harcourt Trans-Amadi Hub',
    case_type: 'early_retirement',
    consultation_status: 'completed',
    union_consulted: true,
    redeployment_assessed: true,
    severance_calculated: true,
    final_approval_status: 'approved',
    effective_date: '2026-09-30'
  },
  {
    id: 2,
    employee_id: 'DHL-EMP-8824',
    employee_name: 'Halima Bello',
    department: 'Finance & Administration',
    location: 'Kano Mallam Aminu Airfreight Hub',
    case_type: 'redundancy',
    consultation_status: 'in_progress',
    union_consulted: false, // RED FLAG TRIGGER
    redeployment_assessed: true,
    severance_calculated: false,
    final_approval_status: 'pending_union_review',
    effective_date: '2026-10-15'
  },
  {
    id: 3,
    employee_id: 'DHL-EMP-7712',
    employee_name: 'Gbenga Adeola',
    department: 'Fleet Maintenance & Transport',
    location: 'Lagos Headquarters (Victoria Island)',
    case_type: 'statutory_retirement',
    consultation_status: 'completed',
    union_consulted: true,
    redeployment_assessed: true,
    severance_calculated: true,
    final_approval_status: 'approved',
    effective_date: '2026-11-01'
  }
];

let TRAINING_PROGRAMS = [
  { id: 1, name: 'Grievance Handling & Conflict Resolution at First Line', category: 'Grievance Handling', mandatory_for_roles: 'line_manager,er_manager', description: 'Practical workshop on addressing informal complaints before formal escalation and navigating procedural fairness.' },
  { id: 2, name: 'Disciplinary Process & Evidentiary Standards', category: 'Disciplinary Fairness', mandatory_for_roles: 'line_manager,er_manager', description: 'Ensuring rigorous documentation, query framing, objective investigation, and compliance with statutory labor laws.' },
  { id: 3, name: 'Industrial Relations & Union Consultation Ethics', category: 'Employee Relations', mandatory_for_roles: 'er_manager,hr_director', description: 'Advanced framework for conducting JCC sessions, CBA negotiations, and multi-hub stakeholder alignment.' },
  { id: 4, name: 'Workplace Harassment, Equality & Mutual Respect', category: 'HR Policy', mandatory_for_roles: 'employee,line_manager,er_manager', description: 'Mandatory annual module on maintaining a safe, respectful, and transparent working environment across DHL.' }
];

let TRAINING_COMPLETIONS = [
  { id: 1, program_id: 1, user_name: 'Tunde Bakare', department: 'Operations & Ground Courier', location: 'Lagos Headquarters (Victoria Island)', completion_date: '2026-05-14', score: 94, expiry_date: '2027-05-14' },
  { id: 2, program_id: 1, user_name: 'Grace Effiong', department: 'Warehouse & Sort Facility', location: 'Port Harcourt Trans-Amadi Hub', completion_date: '2026-06-10', score: 88, expiry_date: '2027-06-10' },
  { id: 3, program_id: 2, user_name: 'Amaka Obi', department: 'Human Resources & Employee Relations', location: 'Lagos Headquarters (Victoria Island)', completion_date: '2026-04-18', score: 98, expiry_date: '2027-04-18' },
  { id: 4, program_id: 2, user_name: 'Babajide Adeleke', department: 'Human Resources & Employee Relations', location: 'Lagos Airport Cargo Gateway (Murtala Muhammed)', completion_date: '2026-04-20', score: 95, expiry_date: '2027-04-20' },
  { id: 5, program_id: 4, user_name: 'Samuel Adeleke', department: 'Operations & Ground Courier', location: 'Lagos Headquarters (Victoria Island)', completion_date: '2026-03-12', score: 92, expiry_date: '2027-03-12' },
  { id: 6, program_id: 4, user_name: 'Kudirat Sanusi', department: 'Fleet Maintenance & Transport', location: 'Lagos Apapa Port Logistics Hub', completion_date: '2026-03-15', score: 90, expiry_date: '2027-03-15' },
  { id: 7, program_id: 4, user_name: 'Folake Adeyemi', department: 'Customer Operations & Express Service', location: 'Abuja Central Delivery Depot', completion_date: '2026-03-22', score: 96, expiry_date: '2027-03-22' }
];

let ALERTS = [
  { id: 1, user_role: 'er_manager', alert_type: 'sla_risk', title: 'SLA Warning: Case IR-2026-000185 Hearing Deadline', message: 'Disciplinary case IR-2026-000185 hearing is scheduled for 20 Aug (3 days remaining).', related_case_id: 2, is_read: false, created_at: '2026-08-17T08:00:00Z' },
  { id: 2, user_role: 'line_manager', alert_type: 'action_assigned', title: 'New Action Assigned: Biometric Clocking Audit', message: 'Action #1 for Case IR-2026-000184 has been assigned with deadline 19 Aug.', related_case_id: 1, is_read: false, created_at: '2026-08-16T10:30:00Z' },
  { id: 3, user_role: 'employee', alert_type: 'case_update', title: 'Update on Your Case IR-2026-000184', message: 'Your grievance has transitioned to the Investigation stage. HR is reviewing shift timesheets.', related_case_id: 1, is_read: false, created_at: '2026-08-06T14:10:00Z' },
  { id: 4, user_role: 'er_manager', alert_type: 'redundancy_flag', title: 'Compliance Red Flag: Union Consultation Missing', message: 'Redundancy case for Halima Bello (Kano) has no union consultation recorded.', related_case_id: null, is_read: false, created_at: '2026-08-15T09:00:00Z' }
];

let AUDIT_LOGS = [
  { id: 1, user_name: 'Samuel Adeleke', action: 'CASE_CREATED', entity_type: 'Case', entity_id: 'IR-2026-000184', details: { case_type: 'grievance', priority: 'high' }, ip_address: '10.24.110.42', created_at: '2026-07-28T09:00:00Z' },
  { id: 2, user_name: 'Amaka Obi', action: 'STAGE_TRANSITIONED', entity_type: 'Case', entity_id: 'IR-2026-000184', details: { from: 'formal_submission', to: 'investigation' }, ip_address: '10.24.110.15', created_at: '2026-08-06T14:00:00Z' },
  { id: 3, user_name: 'Ngozi Okonkwo', action: 'DOCUMENT_UPLOADED', entity_type: 'Document', entity_id: 'Security_Incident_Audit_SEC-PHC-881.pdf', details: { case_id: 2 }, ip_address: '10.24.180.12', created_at: '2026-07-22T14:15:00Z' },
  { id: 4, user_name: 'Grace Effiong', action: 'ACTION_COMPLETED', entity_type: 'Action', entity_id: 'Action #3', details: { case_id: 2, action_title: 'Submit Security CCTV Footage' }, ip_address: '10.24.180.20', created_at: '2026-08-12T16:00:00Z' },
  { id: 5, user_name: 'Chinedu Eze', action: 'REPORT_GENERATED', entity_type: 'Report', entity_id: 'Q2_2026_IR_REVIEW', details: { period: 'Q2 2026', total_cases: 42 }, ip_address: '10.24.110.1', created_at: '2026-07-05T11:00:00Z' }
];

module.exports = {
  LOCATIONS,
  DEPARTMENTS,
  USERS,
  CASES,
  STAGE_HISTORY,
  ACTIONS,
  DOCUMENTS,
  COMMUNICATIONS,
  UNION_MEETINGS,
  UNION_ACTIONS,
  CBA_NEGOTIATIONS,
  REDUNDANCY_CASES,
  TRAINING_PROGRAMS,
  TRAINING_COMPLETIONS,
  ALERTS,
  AUDIT_LOGS
};
