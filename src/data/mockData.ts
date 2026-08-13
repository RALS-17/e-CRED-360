export type CredentialStatus = 'verified' | 'pending' | 'expired' | 'missing' | 'expiring';

/** Active Physician · Visiting Physician · Applicant */
export type ProviderStatus = 'active' | 'visiting' | 'applicant';

export interface Credential {
  id: string;
  type: string;
  number: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: CredentialStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  fileUrl?: string;
  /** Checklist: marked complete / on file */
  checked?: boolean;
}

export interface Privilege {
  department: string;
  privilege: string;
  status: 'granted' | 'pending' | 'denied' | 'expired';
  grantedDate?: string;
  expiryDate?: string;
}

/** Application / onboarding requirement (diploma, TOR, NBI, etc.) */
export interface RequirementItem {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  completedAt?: string;
  required: boolean;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  prcNumber: string;
  philHealthNumber?: string;
  status: ProviderStatus;
  department: string;
  credentials: Credential[];
  privileges: Privilege[];
  /** Application requirements checklist (especially for applicants) */
  requirements: RequirementItem[];
  lastReviewed: string;
  complianceScore: number;
  photoInitials: string;
}

/** Realistic hospital clinical departments */
export const DEPARTMENTS = [
  'Internal Medicine',
  'General Surgery',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Anesthesiology',
  'Emergency Medicine',
  'Radiology',
  'Cardiology',
  'Orthopedics',
  'Family Medicine',
  'Pathology',
  'Psychiatry',
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const SPECIALTIES = [
  'Internal Medicine',
  'General Surgery',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Anesthesiology',
  'Emergency Medicine',
  'Radiology',
  'Cardiology',
  'Orthopedics',
  'Family Medicine',
  'Pathology',
  'Psychiatry',
  'Pulmonology',
  'Nephrology',
  'Neurology',
];

export const STATUS_LABELS: Record<ProviderStatus, string> = {
  active: 'Active Physician',
  visiting: 'Visiting Physician',
  applicant: 'Applicant',
};

/** Standard application requirements for new applicants */
export const DEFAULT_APPLICATION_REQUIREMENTS: Omit<RequirementItem, 'id' | 'completed' | 'completedAt'>[] = [
  { label: 'Medical Diploma', description: 'Doctor of Medicine diploma from recognized school', required: true },
  { label: 'Transcript of Records (TOR)', description: 'Official TOR from medical school', required: true },
  { label: 'PRC Board Certificate', description: 'Physician licensure board certificate', required: true },
  { label: 'Certificate of Specialty / Residency', description: 'Completed residency or specialty training', required: true },
  { label: 'NBI Clearance', description: 'Valid NBI clearance (within 6 months)', required: true },
  { label: 'Curriculum Vitae / Resume', description: 'Updated professional CV', required: true },
  { label: 'Letters of Recommendation', description: 'At least 2 professional references', required: true },
  { label: 'PhilHealth Accreditation form', description: 'PhilHealth professional registration', required: false },
  { label: 'Malpractice Insurance proof', description: 'Current professional liability coverage', required: false },
  { label: 'BLS / ACLS Certificate', description: 'Current life support certification', required: true },
];

export function makeApplicationRequirements(prefix: string, completedLabels: string[] = []): RequirementItem[] {
  return DEFAULT_APPLICATION_REQUIREMENTS.map((r, i) => {
    const done = completedLabels.includes(r.label);
    return {
      id: `${prefix}-req-${i + 1}`,
      label: r.label,
      description: r.description,
      required: r.required,
      completed: done,
      completedAt: done ? '2026-07-01' : undefined,
    };
  });
}

export const CRED_IT_STEPS = [
  { letter: 'C', title: 'Capture', description: 'Capture all credentials from the provider' },
  { letter: 'R', title: 'Review', description: 'Review completeness of the credential file' },
  { letter: 'E', title: 'Electronically verify', description: 'Verify validity via PRC / PhilHealth portals' },
  { letter: 'D', title: 'Determine privileges', description: 'Determine appropriate clinical privileges' },
  { letter: 'I', title: 'Identify issues', description: 'Identify expirations and deficiencies' },
  { letter: 'T', title: 'Track until corrected', description: 'Track deficiencies until fully corrected' },
];

export const mockProviders: Provider[] = [
  {
    id: 'P-001',
    name: "Dr. Mari Grace Anne M. Canta",
    specialty: "Anesthesiology",
    prcNumber: '1000137',
    philHealthNumber: '12-200000111-1',
    status: 'active',
    department: "Anesthesiology",
    lastReviewed: '2026-08-01',
    complianceScore: 96,
    photoInitials: 'MGA',
    requirements: makeApplicationRequirements('P001', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c11', type: "PRC License", number: "1000137", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c12', type: "Specialty Certificate", number: "SP-2016-101", issuer: "Philippine Society of Anesthesiologists", issueDate: '2017-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c13', type: "PhilHealth Accreditation", number: "12-200000111-1", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c14', type: "BLS / ACLS", number: "ACLS-2025-101", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Anesthesiology", privilege: "General anesthesia", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Anesthesiology", privilege: "Regional anesthesia", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-002',
    name: "Dr. Gian Carlo Patrick B. De Belen",
    specialty: "Anesthesiology",
    prcNumber: '1000274',
    philHealthNumber: '12-200000222-2',
    status: 'active',
    department: "Anesthesiology",
    lastReviewed: '2026-08-01',
    complianceScore: 88,
    photoInitials: 'GCP',
    requirements: makeApplicationRequirements('P002', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c21', type: "PRC License", number: "1000274", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c22', type: "Specialty Certificate", number: "SP-2017-102", issuer: "Philippine Society of Anesthesiologists", issueDate: '2018-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c23', type: "PhilHealth Accreditation", number: "12-200000222-2", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c24', type: "BLS / ACLS", number: "ACLS-2025-102", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Anesthesiology", privilege: "General anesthesia", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Anesthesiology", privilege: "Regional anesthesia", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-003',
    name: "Dr. Flaviano Allan P. Llanto III",
    specialty: "Anesthesiology",
    prcNumber: '1000411',
    philHealthNumber: '12-200000333-3',
    status: 'active',
    department: "Anesthesiology",
    lastReviewed: '2026-08-01',
    complianceScore: 72,
    photoInitials: 'FAP',
    requirements: makeApplicationRequirements('P003', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c31', type: "PRC License", number: "1000411", issuer: "Professional Regulation Commission", issueDate: '2019-10-01', expiryDate: '2026-09-30', status: 'expiring', checked: true },
      { id: 'c32', type: "Specialty Certificate", number: "SP-2018-103", issuer: "Philippine Society of Anesthesiologists", issueDate: '2019-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c33', type: "PhilHealth Accreditation", number: "12-200000333-3", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c34', type: "BLS / ACLS", number: "ACLS-2025-103", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Anesthesiology", privilege: "General anesthesia", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Anesthesiology", privilege: "Regional anesthesia", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-004',
    name: "Dr. Marco Paulo D. Velante",
    specialty: "Anesthesiology",
    prcNumber: '1000548',
    philHealthNumber: '12-200000444-4',
    status: 'visiting',
    department: "Anesthesiology",
    lastReviewed: '2026-08-01',
    complianceScore: 91,
    photoInitials: 'MPD',
    requirements: makeApplicationRequirements('P004', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c41', type: "PRC License", number: "1000548", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c42', type: "Specialty Certificate", number: "SP-2019-104", issuer: "Philippine Society of Anesthesiologists", issueDate: '2020-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c43', type: "PhilHealth Accreditation", number: "12-200000444-4", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c44', type: "BLS / ACLS", number: "ACLS-2025-104", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Anesthesiology", privilege: "Consult / assist", status: 'granted', grantedDate: '2025-06-01', expiryDate: '2026-12-31' },
    ],
  },
  {
    id: 'P-005',
    name: "Dr. Hana Marie H. Biagtan",
    specialty: "Internal Medicine",
    prcNumber: '1000685',
    philHealthNumber: '12-200000555-5',
    status: 'active',
    department: "Internal Medicine",
    lastReviewed: '2026-08-01',
    complianceScore: 98,
    photoInitials: 'HMH',
    requirements: makeApplicationRequirements('P005', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c51', type: "PRC License", number: "1000685", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c52', type: "Specialty Certificate", number: "SP-2020-105", issuer: "Philippine College of Physicians", issueDate: '2016-05-10', expiryDate: '2026-11-19', status: 'expiring', checked: true },
      { id: 'c53', type: "PhilHealth Accreditation", number: "12-200000555-5", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c54', type: "BLS / ACLS", number: "ACLS-2025-105", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Internal Medicine", privilege: "Admit patients", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Internal Medicine", privilege: "Manage medical cases", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-006',
    name: "Dr. Elizabeth S. Carreon",
    specialty: "Internal Medicine",
    prcNumber: '1000822',
    philHealthNumber: '12-200000666-6',
    status: 'active',
    department: "Internal Medicine",
    lastReviewed: '2026-08-01',
    complianceScore: 94,
    photoInitials: 'ESC',
    requirements: makeApplicationRequirements('P006', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c61', type: "PRC License", number: "1000822", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c62', type: "Specialty Certificate", number: "SP-2021-106", issuer: "Philippine College of Physicians", issueDate: '2017-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c63', type: "PhilHealth Accreditation", number: "12-200000666-6", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c64', type: "BLS / ACLS", number: "ACLS-2025-106", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Internal Medicine", privilege: "Admit patients", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Internal Medicine", privilege: "Manage medical cases", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-007',
    name: "Dr. Edgardo J. Cuadra",
    specialty: "Internal Medicine",
    prcNumber: '1000959',
    philHealthNumber: '12-200000777-7',
    status: 'active',
    department: "Internal Medicine",
    lastReviewed: '2026-08-01',
    complianceScore: 85,
    photoInitials: 'EJC',
    requirements: makeApplicationRequirements('P007', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c71', type: "PRC License", number: "1000959", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c72', type: "Specialty Certificate", number: "SP-2022-107", issuer: "Philippine College of Physicians", issueDate: '2018-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c73', type: "PhilHealth Accreditation", number: "12-200000777-7", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2026-01-14', status: 'expired', checked: false },
      { id: 'c74', type: "BLS / ACLS", number: "ACLS-2025-107", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Internal Medicine", privilege: "Admit patients", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Internal Medicine", privilege: "Manage medical cases", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-008',
    name: "Dr. Karl Homer V. Nievera",
    specialty: "Internal Medicine",
    prcNumber: '1001096',
    philHealthNumber: '12-200000888-8',
    status: 'active',
    department: "Internal Medicine",
    lastReviewed: '2026-08-01',
    complianceScore: 100,
    photoInitials: 'KHV',
    requirements: makeApplicationRequirements('P008', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c81', type: "PRC License", number: "1001096", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c82', type: "Specialty Certificate", number: "SP-2023-108", issuer: "Philippine College of Physicians", issueDate: '2019-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c83', type: "PhilHealth Accreditation", number: "12-200000888-8", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c84', type: "BLS / ACLS", number: "ACLS-2025-108", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Internal Medicine", privilege: "Admit patients", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Internal Medicine", privilege: "Manage medical cases", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-009',
    name: "Dr. Jaypee V. Perez",
    specialty: "Internal Medicine",
    prcNumber: '1001233',
    status: 'applicant',
    department: "Internal Medicine",
    lastReviewed: '2026-08-01',
    complianceScore: 38,
    photoInitials: 'JVP',
    requirements: makeApplicationRequirements('P009', ["Medical Diploma", "Curriculum Vitae / Resume", "PRC Board Certificate"]),
    credentials: [
      { id: 'c91', type: "PRC License", number: "1001233", issuer: "Professional Regulation Commission", issueDate: '2024-01-15', expiryDate: '2027-06-30', status: 'pending', checked: false },
      { id: 'c92', type: "Specialty Certificate", number: "", issuer: "Philippine College of Physicians", issueDate: '', expiryDate: '', status: 'missing', checked: false },
      { id: 'c93', type: "PhilHealth Accreditation", number: "", issuer: "PhilHealth", issueDate: '', expiryDate: '', status: 'missing', checked: false },
      { id: 'c94', type: "BLS / ACLS", number: "", issuer: "", issueDate: '', expiryDate: '', status: 'missing', checked: false },
    ],
    privileges: [],
  },
  {
    id: 'P-010',
    name: "Dr. Irish Vanessa G. Albia",
    specialty: "Obstetrics & Gynecology",
    prcNumber: '1001370',
    philHealthNumber: '12-200001110-0',
    status: 'active',
    department: "Obstetrics & Gynecology",
    lastReviewed: '2026-08-01',
    complianceScore: 97,
    photoInitials: 'IVG',
    requirements: makeApplicationRequirements('P010', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c101', type: "PRC License", number: "1001370", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c102', type: "Specialty Certificate", number: "SP-2015-110", issuer: "Philippine Obstetrical and Gynecological Society", issueDate: '2016-05-10', expiryDate: '2026-11-19', status: 'expiring', checked: true },
      { id: 'c103', type: "PhilHealth Accreditation", number: "12-200001110-0", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c104', type: "BLS / ACLS", number: "ACLS-2025-110", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Obstetrics & Gynecology", privilege: "Perform cesarean section", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Obstetrics & Gynecology", privilege: "Gynecologic surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-011',
    name: "Dr. Mildred R. Barredo-Llanto",
    specialty: "Obstetrics & Gynecology",
    prcNumber: '1001507',
    philHealthNumber: '12-200001221-1',
    status: 'active',
    department: "Obstetrics & Gynecology",
    lastReviewed: '2026-08-01',
    complianceScore: 90,
    photoInitials: 'MRB',
    requirements: makeApplicationRequirements('P011', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c111', type: "PRC License", number: "1001507", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c112', type: "Specialty Certificate", number: "SP-2016-111", issuer: "Philippine Obstetrical and Gynecological Society", issueDate: '2017-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c113', type: "PhilHealth Accreditation", number: "12-200001221-1", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c114', type: "BLS / ACLS", number: "ACLS-2025-111", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Obstetrics & Gynecology", privilege: "Perform cesarean section", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Obstetrics & Gynecology", privilege: "Gynecologic surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-012',
    name: "Dr. Grace V. Mendoza",
    specialty: "Obstetrics & Gynecology",
    prcNumber: '1001644',
    philHealthNumber: '12-200001332-2',
    status: 'visiting',
    department: "Obstetrics & Gynecology",
    lastReviewed: '2026-08-01',
    complianceScore: 78,
    photoInitials: 'GVM',
    requirements: makeApplicationRequirements('P012', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c121', type: "PRC License", number: "1001644", issuer: "Professional Regulation Commission", issueDate: '2019-10-01', expiryDate: '2026-09-30', status: 'expiring', checked: true },
      { id: 'c122', type: "Specialty Certificate", number: "SP-2017-112", issuer: "Philippine Obstetrical and Gynecological Society", issueDate: '2018-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c123', type: "PhilHealth Accreditation", number: "12-200001332-2", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c124', type: "BLS / ACLS", number: "ACLS-2025-112", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Obstetrics & Gynecology", privilege: "Consult / assist", status: 'granted', grantedDate: '2025-06-01', expiryDate: '2026-12-31' },
    ],
  },
  {
    id: 'P-013',
    name: "Dr. Mary Ann P. Panganiban-Martinez",
    specialty: "Obstetrics & Gynecology",
    prcNumber: '1001781',
    philHealthNumber: '12-200001443-3',
    status: 'active',
    department: "Obstetrics & Gynecology",
    lastReviewed: '2026-08-01',
    complianceScore: 93,
    photoInitials: 'MAP',
    requirements: makeApplicationRequirements('P013', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c131', type: "PRC License", number: "1001781", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c132', type: "Specialty Certificate", number: "SP-2018-113", issuer: "Philippine Obstetrical and Gynecological Society", issueDate: '2019-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c133', type: "PhilHealth Accreditation", number: "12-200001443-3", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c134', type: "BLS / ACLS", number: "ACLS-2025-113", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Obstetrics & Gynecology", privilege: "Perform cesarean section", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Obstetrics & Gynecology", privilege: "Gynecologic surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-014',
    name: "Dr. May Joy M. Petate",
    specialty: "Obstetrics & Gynecology",
    prcNumber: '1001918',
    philHealthNumber: '12-200001554-4',
    status: 'active',
    department: "Obstetrics & Gynecology",
    lastReviewed: '2026-08-01',
    complianceScore: 86,
    photoInitials: 'MJM',
    requirements: makeApplicationRequirements('P014', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c141', type: "PRC License", number: "1001918", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c142', type: "Specialty Certificate", number: "SP-2019-114", issuer: "Philippine Obstetrical and Gynecological Society", issueDate: '2020-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c143', type: "PhilHealth Accreditation", number: "12-200001554-4", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2026-01-14', status: 'expired', checked: false },
      { id: 'c144', type: "BLS / ACLS", number: "ACLS-2025-114", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Obstetrics & Gynecology", privilege: "Perform cesarean section", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "Obstetrics & Gynecology", privilege: "Gynecologic surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-015',
    name: "Dr. Angellie P. Campos",
    specialty: "Pediatrics",
    prcNumber: '1002055',
    philHealthNumber: '12-200001665-5',
    status: 'active',
    department: "Pediatrics",
    lastReviewed: '2026-08-01',
    complianceScore: 95,
    photoInitials: 'APC',
    requirements: makeApplicationRequirements('P015', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c151', type: "PRC License", number: "1002055", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c152', type: "Specialty Certificate", number: "SP-2020-115", issuer: "Philippine Pediatric Society", issueDate: '2016-05-10', expiryDate: '2026-11-19', status: 'expiring', checked: true },
      { id: 'c153', type: "PhilHealth Accreditation", number: "12-200001665-5", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c154', type: "BLS / ACLS", number: "ACLS-2025-115", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Pediatrics", privilege: "Admit pediatric patients", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-016',
    name: "Dr. Maycibel M. Capero",
    specialty: "Pediatrics",
    prcNumber: '1002192',
    philHealthNumber: '12-200001776-6',
    status: 'active',
    department: "Pediatrics",
    lastReviewed: '2026-08-01',
    complianceScore: 89,
    photoInitials: 'MMC',
    requirements: makeApplicationRequirements('P016', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c161', type: "PRC License", number: "1002192", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c162', type: "Specialty Certificate", number: "SP-2021-116", issuer: "Philippine Pediatric Society", issueDate: '2017-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c163', type: "PhilHealth Accreditation", number: "12-200001776-6", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c164', type: "BLS / ACLS", number: "ACLS-2025-116", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Pediatrics", privilege: "Admit pediatric patients", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-017',
    name: "Dr. Roan Michelle C. De Belen",
    specialty: "Pediatrics",
    prcNumber: '1002329',
    philHealthNumber: '12-200001887-7',
    status: 'active',
    department: "Pediatrics",
    lastReviewed: '2026-08-01',
    complianceScore: 82,
    photoInitials: 'RMC',
    requirements: makeApplicationRequirements('P017', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c171', type: "PRC License", number: "1002329", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c172', type: "Specialty Certificate", number: "SP-2022-117", issuer: "Philippine Pediatric Society", issueDate: '2018-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c173', type: "PhilHealth Accreditation", number: "12-200001887-7", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c174', type: "BLS / ACLS", number: "ACLS-2025-117", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Pediatrics", privilege: "Admit pediatric patients", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-018',
    name: "Dr. Ma. Sharon F. Delfin-Dela Cruz",
    specialty: "Pediatrics",
    prcNumber: '1002466',
    philHealthNumber: '12-200001998-8',
    status: 'visiting',
    department: "Pediatrics",
    lastReviewed: '2026-08-01',
    complianceScore: 70,
    photoInitials: 'MSF',
    requirements: makeApplicationRequirements('P018', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c181', type: "PRC License", number: "1002466", issuer: "Professional Regulation Commission", issueDate: '2019-10-01', expiryDate: '2026-09-30', status: 'expiring', checked: true },
      { id: 'c182', type: "Specialty Certificate", number: "SP-2023-118", issuer: "Philippine Pediatric Society", issueDate: '2019-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c183', type: "PhilHealth Accreditation", number: "12-200001998-8", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c184', type: "BLS / ACLS", number: "ACLS-2025-118", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "Pediatrics", privilege: "Consult / assist", status: 'granted', grantedDate: '2025-06-01', expiryDate: '2026-12-31' },
    ],
  },
  {
    id: 'P-019',
    name: "Dr. Resa Lee Ester B. Marquez",
    specialty: "Pediatrics",
    prcNumber: '1002603',
    status: 'applicant',
    department: "Pediatrics",
    lastReviewed: '2026-08-01',
    complianceScore: 30,
    photoInitials: 'RLE',
    requirements: makeApplicationRequirements('P019', ["Medical Diploma", "Curriculum Vitae / Resume", "PRC Board Certificate"]),
    credentials: [
      { id: 'c191', type: "PRC License", number: "1002603", issuer: "Professional Regulation Commission", issueDate: '2024-01-15', expiryDate: '2027-06-30', status: 'pending', checked: false },
      { id: 'c192', type: "Specialty Certificate", number: "", issuer: "Philippine Pediatric Society", issueDate: '', expiryDate: '', status: 'missing', checked: false },
      { id: 'c193', type: "PhilHealth Accreditation", number: "", issuer: "PhilHealth", issueDate: '', expiryDate: '', status: 'missing', checked: false },
      { id: 'c194', type: "BLS / ACLS", number: "", issuer: "", issueDate: '', expiryDate: '', status: 'missing', checked: false },
    ],
    privileges: [],
  },
  {
    id: 'P-020',
    name: "Dr. Romeo C. Abad Jr.",
    specialty: "General Surgery",
    prcNumber: '1002740',
    philHealthNumber: '12-200002220-0',
    status: 'active',
    department: "General Surgery",
    lastReviewed: '2026-08-01',
    complianceScore: 99,
    photoInitials: 'RCA',
    requirements: makeApplicationRequirements('P020', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c201', type: "PRC License", number: "1002740", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c202', type: "Specialty Certificate", number: "SP-2015-120", issuer: "Philippine College of Surgeons", issueDate: '2016-05-10', expiryDate: '2026-11-19', status: 'expiring', checked: true },
      { id: 'c203', type: "PhilHealth Accreditation", number: "12-200002220-0", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c204', type: "BLS / ACLS", number: "ACLS-2025-120", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "General Surgery", privilege: "Perform major surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "General Surgery", privilege: "Trauma surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-021',
    name: "Dr. Robert Joseph B. Almoro",
    specialty: "General Surgery",
    prcNumber: '1002877',
    philHealthNumber: '12-200002331-1',
    status: 'active',
    department: "General Surgery",
    lastReviewed: '2026-08-01',
    complianceScore: 92,
    photoInitials: 'RJB',
    requirements: makeApplicationRequirements('P021', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c211', type: "PRC License", number: "1002877", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c212', type: "Specialty Certificate", number: "SP-2016-121", issuer: "Philippine College of Surgeons", issueDate: '2017-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c213', type: "PhilHealth Accreditation", number: "12-200002331-1", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2026-01-14', status: 'expired', checked: false },
      { id: 'c214', type: "BLS / ACLS", number: "ACLS-2025-121", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "General Surgery", privilege: "Perform major surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "General Surgery", privilege: "Trauma surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-022',
    name: "Dr. Mark Kevin P. Campos",
    specialty: "General Surgery",
    prcNumber: '1003014',
    philHealthNumber: '12-200002442-2',
    status: 'active',
    department: "General Surgery",
    lastReviewed: '2026-08-01',
    complianceScore: 87,
    photoInitials: 'MKP',
    requirements: makeApplicationRequirements('P022', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c221', type: "PRC License", number: "1003014", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c222', type: "Specialty Certificate", number: "SP-2017-122", issuer: "Philippine College of Surgeons", issueDate: '2018-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c223', type: "PhilHealth Accreditation", number: "12-200002442-2", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c224', type: "BLS / ACLS", number: "ACLS-2025-122", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "General Surgery", privilege: "Perform major surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "General Surgery", privilege: "Trauma surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
  {
    id: 'P-023',
    name: "Dr. Mamerto G. Capero Jr.",
    specialty: "General Surgery",
    prcNumber: '1003151',
    philHealthNumber: '12-200002553-3',
    status: 'visiting',
    department: "General Surgery",
    lastReviewed: '2026-08-01',
    complianceScore: 75,
    photoInitials: 'MGC',
    requirements: makeApplicationRequirements('P023', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c231', type: "PRC License", number: "1003151", issuer: "Professional Regulation Commission", issueDate: '2019-10-01', expiryDate: '2026-09-30', status: 'expiring', checked: true },
      { id: 'c232', type: "Specialty Certificate", number: "SP-2018-123", issuer: "Philippine College of Surgeons", issueDate: '2019-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c233', type: "PhilHealth Accreditation", number: "12-200002553-3", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c234', type: "BLS / ACLS", number: "ACLS-2025-123", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "General Surgery", privilege: "Consult / assist", status: 'granted', grantedDate: '2025-06-01', expiryDate: '2026-12-31' },
    ],
  },
  {
    id: 'P-024',
    name: "Dr. Marimir O. Radovan",
    specialty: "General Surgery",
    prcNumber: '1003288',
    philHealthNumber: '12-200002664-4',
    status: 'active',
    department: "General Surgery",
    lastReviewed: '2026-08-01',
    complianceScore: 94,
    photoInitials: 'MOR',
    requirements: makeApplicationRequirements('P024', ["Medical Diploma", "Transcript of Records (TOR)", "PRC Board Certificate", "Certificate of Specialty / Residency", "NBI Clearance", "Curriculum Vitae / Resume", "Letters of Recommendation", "PhilHealth Accreditation form", "Malpractice Insurance proof", "BLS / ACLS Certificate"]),
    credentials: [
      { id: 'c241', type: "PRC License", number: "1003288", issuer: "Professional Regulation Commission", issueDate: '2020-03-15', expiryDate: '2028-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer', checked: true },
      { id: 'c242', type: "Specialty Certificate", number: "SP-2019-124", issuer: "Philippine College of Surgeons", issueDate: '2020-05-10', expiryDate: '2027-08-01', status: 'verified', checked: true },
      { id: 'c243', type: "PhilHealth Accreditation", number: "12-200002664-4", issuer: "PhilHealth", issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified', checked: true },
      { id: 'c244', type: "BLS / ACLS", number: "ACLS-2025-124", issuer: "American Heart Association", issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified', checked: true },
    ],
    privileges: [
      { department: "General Surgery", privilege: "Perform major surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
      { department: "General Surgery", privilege: "Trauma surgery", status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-12-31' },
    ],
  },
];

export const dashboardStats = {
  totalProviders: mockProviders.length,
  fullyCompliant: mockProviders.filter((p) => p.complianceScore >= 90).length,
  expiringSoon: mockProviders.reduce((n, p) => n + p.credentials.filter((c) => c.status === 'expiring').length, 0),
  expiredCredentials: mockProviders.reduce((n, p) => n + p.credentials.filter((c) => c.status === 'expired').length, 0),
  pendingVerification: mockProviders.filter((p) => p.status === 'applicant').length,
  averageCompliance: Math.round(
    mockProviders.reduce((s, p) => s + p.complianceScore, 0) / mockProviders.length
  ),
  zeroExpiredCritical: false,
};
