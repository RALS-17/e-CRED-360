export type CredentialStatus = 'verified' | 'pending' | 'expired' | 'missing' | 'expiring';
export type ProviderStatus = 'active' | 'pending' | 'suspended' | 'incomplete';

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
}

export interface Privilege {
  department: string;
  privilege: string;
  status: 'granted' | 'pending' | 'denied' | 'expired';
  grantedDate?: string;
  expiryDate?: string;
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
  lastReviewed: string;
  complianceScore: number;
  photoInitials: string;
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
    name: 'Dr. Maria Santos Reyes',
    specialty: 'Internal Medicine',
    prcNumber: '0123456',
    philHealthNumber: '12-345678901-2',
    status: 'active',
    department: 'Medicine',
    lastReviewed: '2026-07-15',
    complianceScore: 98,
    photoInitials: 'MSR',
    credentials: [
      { id: 'c1', type: 'PRC License', number: '0123456', issuer: 'Professional Regulation Commission', issueDate: '2020-03-15', expiryDate: '2027-03-14', status: 'verified', verifiedAt: '2026-01-10', verifiedBy: 'System + Officer' },
      { id: 'c2', type: 'Specialty Certificate', number: 'IM-2019-884', issuer: 'Philippine College of Physicians', issueDate: '2019-11-20', expiryDate: '2026-11-19', status: 'expiring', verifiedAt: '2026-01-10' },
      { id: 'c3', type: 'PhilHealth Accreditation', number: '12-345678901-2', issuer: 'PhilHealth', issueDate: '2021-06-01', expiryDate: '2027-05-31', status: 'verified' },
      { id: 'c4', type: 'BLS / ACLS', number: 'ACLS-2025-991', issuer: 'American Heart Association', issueDate: '2025-02-10', expiryDate: '2027-02-09', status: 'verified' },
      { id: 'c5', type: 'Malpractice Insurance', number: 'MI-88421', issuer: 'PhilInsurance', issueDate: '2026-01-01', expiryDate: '2026-12-31', status: 'verified' },
    ],
    privileges: [
      { department: 'Medicine', privilege: 'Admit patients', status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-01-14' },
      { department: 'Medicine', privilege: 'Perform endoscopy', status: 'granted', grantedDate: '2024-01-15', expiryDate: '2027-01-14' },
      { department: 'ICU', privilege: 'Manage critical care', status: 'granted', grantedDate: '2025-03-01', expiryDate: '2027-02-28' },
    ],
  },
  {
    id: 'P-002',
    name: 'Dr. Juan Carlos Dela Cruz',
    specialty: 'General Surgery',
    prcNumber: '0789012',
    philHealthNumber: '12-987654321-0',
    status: 'active',
    department: 'Surgery',
    lastReviewed: '2026-06-20',
    complianceScore: 85,
    photoInitials: 'JDC',
    credentials: [
      { id: 'c6', type: 'PRC License', number: '0789012', issuer: 'Professional Regulation Commission', issueDate: '2018-08-22', expiryDate: '2026-08-21', status: 'expiring', verifiedAt: '2026-02-01' },
      { id: 'c7', type: 'Specialty Certificate', number: 'GS-2017-332', issuer: 'Philippine College of Surgeons', issueDate: '2017-05-10', expiryDate: '2025-05-09', status: 'expired' },
      { id: 'c8', type: 'PhilHealth Accreditation', number: '12-987654321-0', issuer: 'PhilHealth', issueDate: '2020-01-15', expiryDate: '2026-01-14', status: 'expired' },
      { id: 'c9', type: 'BLS / ACLS', number: 'ACLS-2024-112', issuer: 'American Heart Association', issueDate: '2024-09-01', expiryDate: '2026-08-31', status: 'verified' },
    ],
    privileges: [
      { department: 'Surgery', privilege: 'Perform major surgery', status: 'granted', grantedDate: '2023-06-01', expiryDate: '2026-05-31' },
      { department: 'Surgery', privilege: 'Laparoscopic procedures', status: 'pending' },
    ],
  },
  {
    id: 'P-003',
    name: 'Dr. Ana Isabel Mendoza',
    specialty: 'Pediatrics',
    prcNumber: '0456789',
    status: 'pending',
    department: 'Pediatrics',
    lastReviewed: '2026-08-01',
    complianceScore: 62,
    photoInitials: 'AIM',
    credentials: [
      { id: 'c10', type: 'PRC License', number: '0456789', issuer: 'Professional Regulation Commission', issueDate: '2022-04-12', expiryDate: '2025-04-11', status: 'expired' },
      { id: 'c11', type: 'Specialty Certificate', number: 'PED-2021-551', issuer: 'Philippine Pediatric Society', issueDate: '2021-09-30', expiryDate: '2026-09-29', status: 'verified' },
      { id: 'c12', type: 'PhilHealth Accreditation', number: '', issuer: 'PhilHealth', issueDate: '', expiryDate: '', status: 'missing' },
      { id: 'c13', type: 'BLS / PALS', number: 'PALS-2025-440', issuer: 'American Heart Association', issueDate: '2025-01-20', expiryDate: '2027-01-19', status: 'verified' },
    ],
    privileges: [
      { department: 'Pediatrics', privilege: 'Admit pediatric patients', status: 'pending' },
    ],
  },
  {
    id: 'P-004',
    name: 'Dr. Roberto Miguel Tan',
    specialty: 'Obstetrics & Gynecology',
    prcNumber: '0332211',
    philHealthNumber: '12-112233445-6',
    status: 'active',
    department: 'OB-GYN',
    lastReviewed: '2026-07-28',
    complianceScore: 100,
    photoInitials: 'RMT',
    credentials: [
      { id: 'c14', type: 'PRC License', number: '0332211', issuer: 'Professional Regulation Commission', issueDate: '2016-12-01', expiryDate: '2028-11-30', status: 'verified', verifiedAt: '2026-03-05' },
      { id: 'c15', type: 'Specialty Certificate', number: 'OB-2015-109', issuer: 'Philippine Obstetrical and Gynecological Society', issueDate: '2015-07-18', expiryDate: '2027-07-17', status: 'verified' },
      { id: 'c16', type: 'PhilHealth Accreditation', number: '12-112233445-6', issuer: 'PhilHealth', issueDate: '2019-03-01', expiryDate: '2027-02-28', status: 'verified' },
      { id: 'c17', type: 'BLS / ACLS', number: 'ACLS-2025-778', issuer: 'American Heart Association', issueDate: '2025-06-15', expiryDate: '2027-06-14', status: 'verified' },
      { id: 'c18', type: 'Malpractice Insurance', number: 'MI-99102', issuer: 'PhilInsurance', issueDate: '2026-01-01', expiryDate: '2026-12-31', status: 'verified' },
    ],
    privileges: [
      { department: 'OB-GYN', privilege: 'Perform cesarean section', status: 'granted', grantedDate: '2022-01-10', expiryDate: '2028-01-09' },
      { department: 'OB-GYN', privilege: 'High-risk pregnancy management', status: 'granted', grantedDate: '2022-01-10', expiryDate: '2028-01-09' },
      { department: 'OR', privilege: 'Operate in main OR', status: 'granted', grantedDate: '2022-01-10', expiryDate: '2028-01-09' },
    ],
  },
  {
    id: 'P-005',
    name: 'Dr. Elena Grace Villanueva',
    specialty: 'Anesthesiology',
    prcNumber: '0567890',
    status: 'incomplete',
    department: 'Anesthesia',
    lastReviewed: '2026-08-05',
    complianceScore: 45,
    photoInitials: 'EGV',
    credentials: [
      { id: 'c19', type: 'PRC License', number: '0567890', issuer: 'Professional Regulation Commission', issueDate: '2019-05-20', expiryDate: '2026-05-19', status: 'expired' },
      { id: 'c20', type: 'Specialty Certificate', number: 'ANES-2018-220', issuer: 'Philippine Society of Anesthesiologists', issueDate: '2018-10-05', expiryDate: '2026-10-04', status: 'expiring' },
      { id: 'c21', type: 'PhilHealth Accreditation', number: '', issuer: 'PhilHealth', issueDate: '', expiryDate: '', status: 'missing' },
      { id: 'c22', type: 'BLS / ACLS', number: '', issuer: '', issueDate: '', expiryDate: '', status: 'missing' },
    ],
    privileges: [],
  },
];

export const dashboardStats = {
  totalProviders: 5,
  fullyCompliant: 2,
  expiringSoon: 3,
  expiredCredentials: 4,
  pendingVerification: 2,
  averageCompliance: 78,
  zeroExpiredCritical: false,
};
