-- DHL INDUSTRIAL RELATIONS MANAGEMENT SYSTEM (IRMS)
-- Master Relational Database Schema for PostgreSQL

-- 1. Locations
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Hub', 'Gateway', 'Headquarters', 'Station'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Departments
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Roles & Permissions
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- 'employee', 'line_manager', 'er_manager', 'hr_director', 'sys_admin'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. Users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'employee', 'line_manager', 'er_manager', 'hr_director', 'sys_admin'
    department_id INT REFERENCES departments(id),
    location_id INT REFERENCES locations(id),
    manager_id INT REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Cases Master Table
CREATE TABLE IF NOT EXISTS cases (
    id SERIAL PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL, -- 'IR-2026-000184'
    case_type VARCHAR(50) NOT NULL, -- 'grievance', 'disciplinary', 'union', 'concern', 'query'
    category VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    employee_user_id INT REFERENCES users(id),
    department_id INT REFERENCES departments(id),
    location_id INT REFERENCES locations(id),
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(30) DEFAULT 'open', -- 'submitted', 'assigned', 'in_progress', 'investigation', 'hearing', 'decision', 'appeal', 'resolved', 'closed', 'overdue'
    current_stage VARCHAR(50) NOT NULL, -- 'informal_resolution', 'formal_submission', 'investigation', 'hearing', 'decision', 'appeal', 'closed'
    owner_id INT REFERENCES users(id), -- Assigned HR Admin
    manager_id INT REFERENCES users(id), -- Assigned Line Manager
    next_action TEXT,
    action_owner_id INT REFERENCES users(id),
    sla_due_date DATE,
    resolution_date TIMESTAMP WITH TIME ZONE,
    outcome TEXT,
    appeal_status VARCHAR(50),
    confidentiality VARCHAR(30) DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Case Stage History (Audit Trail of Stage Transitions)
CREATE TABLE IF NOT EXISTS case_stage_history (
    id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(id) ON DELETE CASCADE,
    stage VARCHAR(50) NOT NULL,
    actor_id INT REFERENCES users(id),
    notes TEXT,
    entered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    exited_at TIMESTAMP WITH TIME ZONE
);

-- 7. Case Action Items
CREATE TABLE IF NOT EXISTS case_actions (
    id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(id) ON DELETE CASCADE,
    action_title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INT REFERENCES users(id),
    due_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'overdue'
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Case Documents & Evidence
CREATE TABLE IF NOT EXISTS case_documents (
    id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'statement', 'evidence', 'minutes', 'report', 'letter'
    file_size_kb INT,
    uploaded_by INT REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Case Communications & Notes Thread
CREATE TABLE IF NOT EXISTS case_communications (
    id SERIAL PRIMARY KEY,
    case_id INT REFERENCES cases(id) ON DELETE CASCADE,
    sender_id INT REFERENCES users(id),
    recipient_role VARCHAR(50),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Union / JCC Meetings
CREATE TABLE IF NOT EXISTS union_meetings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
    meeting_type VARCHAR(50) NOT NULL, -- 'quarterly_jcc', 'cba_negotiation', 'safety_committee', 'emergency_consultation'
    location_id INT REFERENCES locations(id),
    agenda TEXT NOT NULL,
    minutes TEXT,
    status VARCHAR(30) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'action_points_pending', 'adjourned'
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Union Meeting Action Points
CREATE TABLE IF NOT EXISTS union_meeting_actions (
    id SERIAL PRIMARY KEY,
    meeting_id INT REFERENCES union_meetings(id) ON DELETE CASCADE,
    action_title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INT REFERENCES users(id),
    due_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'overdue'
    priority VARCHAR(20) DEFAULT 'medium',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. CBA & Salary Negotiation Pipelines
CREATE TABLE IF NOT EXISTS cba_negotiations (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    proposal_summary TEXT NOT NULL,
    stage VARCHAR(50) NOT NULL, -- 'proposal', 'negotiation', 'pending_ratification', 'approved', 'implemented'
    effective_date DATE,
    union_rep_lead VARCHAR(150),
    management_lead_id INT REFERENCES users(id),
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Redundancy & Retirement Cases
CREATE TABLE IF NOT EXISTS redundancy_cases (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    employee_name VARCHAR(150) NOT NULL,
    department_id INT REFERENCES departments(id),
    location_id INT REFERENCES locations(id),
    case_type VARCHAR(50) NOT NULL, -- 'redundancy', 'early_retirement', 'statutory_retirement'
    consultation_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
    union_consulted BOOLEAN DEFAULT false, -- Red flag if false
    redeployment_assessed BOOLEAN DEFAULT false, -- Warning if false
    severance_calculated BOOLEAN DEFAULT false,
    final_approval_status VARCHAR(50) DEFAULT 'draft',
    effective_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Training Programs & Completions
CREATE TABLE IF NOT EXISTS training_programs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Grievance Handling', 'Disciplinary Fairness', 'Investigation Standards', 'Conflict Resolution', 'HR Policy'
    description TEXT,
    mandatory_for_roles VARCHAR(100), -- 'line_manager,er_manager'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_completions (
    id SERIAL PRIMARY KEY,
    program_id INT REFERENCES training_programs(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL,
    score INT,
    certificate_url VARCHAR(500),
    expiry_date DATE
);

-- 15. Alerts & Notifications
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'sla_risk', 'action_assigned', 'hearing_scheduled', 'case_update', 'training_due'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_case_id INT REFERENCES cases(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. System Audit Logs (Immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    user_name VARCHAR(150),
    action VARCHAR(100) NOT NULL, -- 'CASE_CREATED', 'STAGE_TRANSITIONED', 'ACTION_COMPLETED', 'DOC_UPLOADED', 'REPORT_GENERATED'
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Materialized Dashboard View for Instant Aggregate Analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_snapshot AS
SELECT
    status,
    case_type,
    location_id,
    department_id,
    COUNT(*) AS count,
    AVG(CASE WHEN resolution_date IS NOT NULL THEN EXTRACT(EPOCH FROM (resolution_date - created_at))/86400 ELSE NULL END) AS avg_resolution_days
FROM cases
GROUP BY status, case_type, location_id, department_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_snapshot ON dashboard_snapshot (status, case_type, location_id, department_id);

-- Indexes for SLA query performance
CREATE INDEX IF NOT EXISTS idx_cases_status_deadline ON cases (status, sla_due_date);
CREATE INDEX IF NOT EXISTS idx_cases_employee ON cases (employee_id);
CREATE INDEX IF NOT EXISTS idx_cases_location_dept ON cases (location_id, department_id);
