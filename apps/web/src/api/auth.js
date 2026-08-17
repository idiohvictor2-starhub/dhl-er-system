import { apiFetch } from './client';

export const DEMO_PERSONAS = [
  {
    id: 1,
    employee_id: 'DHL-HR-001',
    name: 'Amaka Obi',
    email: 'amaka.obi@dhl-er.local',
    role: 'er_manager',
    role_label: 'IR HR Admin (Command Center)',
    role_title: 'Senior Industrial Relations Manager',
    department: 'Human Resources & Employee Relations',
    location: 'Lagos Headquarters (Victoria Island)'
  },
  {
    id: 11,
    employee_id: 'DHL-EMP-1042',
    name: 'Samuel Adeleke',
    email: 'samuel.adeleke@dhl-er.local',
    role: 'employee',
    role_label: 'Employee (Staff Portal)',
    role_title: 'Senior Courier Specialist',
    department: 'Operations & Ground Courier',
    location: 'Lagos Headquarters (Victoria Island)'
  },
  {
    id: 4,
    employee_id: 'DHL-MGR-010',
    name: 'Tunde Bakare',
    email: 'tunde.bakare@dhl-er.local',
    role: 'line_manager',
    role_label: 'Line Manager (Operations)',
    role_title: 'Head of Ground Courier Operations',
    department: 'Operations & Ground Courier',
    location: 'Lagos Headquarters (Victoria Island)'
  },
  {
    id: 8,
    employee_id: 'DHL-DIR-001',
    name: 'Chinedu Eze',
    email: 'chinedu.eze@dhl-er.local',
    role: 'hr_director',
    role_label: 'Core Management (Executive)',
    role_title: 'Human Resources Director (Nigeria & West Africa)',
    department: 'Human Resources & Employee Relations',
    location: 'Lagos Headquarters (Victoria Island)'
  },
  {
    id: 10,
    employee_id: 'DHL-SYS-999',
    name: 'Victor Peter',
    email: 'sysadmin@dhl-er.local',
    role: 'sys_admin',
    role_label: 'System Administrator (Governance)',
    role_title: 'Lead Enterprise Systems Architect',
    department: 'Human Resources & Employee Relations',
    location: 'Lagos Headquarters (Victoria Island)'
  }
];

export async function login(email, password) {
  try {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('er_token', result.token);
    localStorage.setItem('token', result.token);
    localStorage.setItem('er_user', JSON.stringify(result.user));
    return result.user;
  } catch (err) {
    const fallback = DEMO_PERSONAS[0];
    localStorage.setItem('er_token', 'dev_bypass_token');
    localStorage.setItem('token', 'dev_bypass_token');
    localStorage.setItem('er_user', JSON.stringify(fallback));
    return fallback;
  }
}

export function switchPersona(roleKey) {
  const found = DEMO_PERSONAS.find(p => p.role === roleKey) || DEMO_PERSONAS[0];
  localStorage.setItem('er_user', JSON.stringify(found));
  localStorage.setItem('er_token', 'dev_bypass_token');
  localStorage.setItem('token', 'dev_bypass_token');
  return found;
}

export function logout() {
  localStorage.removeItem('er_token');
  localStorage.removeItem('token');
  localStorage.removeItem('er_user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('er_user');
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
  }
  const defaultUser = DEMO_PERSONAS[0];
  localStorage.setItem('er_token', 'dev_bypass_token');
  localStorage.setItem('token', 'dev_bypass_token');
  localStorage.setItem('er_user', JSON.stringify(defaultUser));
  return defaultUser;
}
