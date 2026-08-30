import bcrypt from 'bcryptjs';

export type Role = 'USER' | 'DONOR' | 'ADMIN';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  area?: string;
  address?: string;
  state?: string;
  country?: string;
  passwordHash: string;
  role: Role;
  emailVerified: boolean;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastLoginAt?: string;
}

export interface DonorRecord {
  id: string;
  userId: string;
  name: string;
  bloodGroup: string;
  city: string;
  state: string;
  country: string;
  area: string;
  availability: 'AVAILABLE' | 'RECENTLY_ACTIVE' | 'UNAVAILABLE';
  verificationStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  donationCount: number;
  lastDonationDate: string;
  lastActive: string;
  privacy: { showArea: boolean };
}

export interface RequestRecord {
  id: string;
  requestId: string;
  requesterId: string;
  bloodGroup: string;
  unitsRequired: number;
  city: string;
  state: string;
  country: string;
  area: string;
  hospitalName: string;
  hospitalAddress: string;
  urgency: 'NORMAL' | 'URGENT' | 'CRITICAL';
  requiredDate: string;
  status: 'OPEN' | 'MATCHED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  channels?: Array<{ channel: string; status: string; recipient?: string; error?: string }>;
}

export interface HelpResponseRecord {
  id: string;
  requestId: string;
  donorId: string;
  requesterId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export interface ActivityRecord {
  id: string;
  action: string;
  method: string;
  path: string;
  statusCode: number;
  actorId?: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface CertificateRecord {
  donorId: string;
  donorName: string;
  donationCount: number;
  issuedAt: string;
  certificateId: string;
}

export const appState = {
  users: [] as UserRecord[],
  donors: [] as DonorRecord[],
  requests: [] as RequestRecord[],
  notifications: [] as NotificationRecord[],
  helpResponses: [] as HelpResponseRecord[],
  activities: [] as ActivityRecord[],
};

export async function seedAppState() {
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const donorPassword = await bcrypt.hash('Donor@123', 10);

  appState.users = [
    {
      id: 'user-admin',
      name: 'RAKTA Admin',
      email: 'admin@rakta.local',
      phone: '9999999999',
      passwordHash: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-donor-1',
      name: 'Aarav Singh',
      email: 'aarav@rakta.local',
      phone: '9876543210',
      passwordHash: donorPassword,
      role: 'DONOR',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-requester-1',
      name: 'Riya Kapoor',
      email: 'riya@rakta.local',
      phone: '9123456780',
      passwordHash: await bcrypt.hash('Requester@123', 10),
      role: 'USER',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    },
  ];

  appState.donors = [
    {
      id: 'donor-1',
      userId: 'user-donor-1',
      name: 'Aarav Singh',
      bloodGroup: 'O+',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      country: 'India',
      area: 'Hazratganj',
      availability: 'AVAILABLE',
      verificationStatus: 'VERIFIED',
      donationCount: 12,
      lastDonationDate: '2025-06-10',
      lastActive: '2 mins ago',
      privacy: { showArea: true },
    },
    {
      id: 'donor-2',
      userId: 'user-donor-2',
      name: 'Nisha Verma',
      bloodGroup: 'B+',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      country: 'India',
      area: 'Aliganj',
      availability: 'RECENTLY_ACTIVE',
      verificationStatus: 'VERIFIED',
      donationCount: 9,
      lastDonationDate: '2025-07-02',
      lastActive: '18 mins ago',
      privacy: { showArea: true },
    },
    {
      id: 'donor-3',
      userId: 'user-donor-3',
      name: 'Rahul Mehra',
      bloodGroup: 'A+',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      area: 'Saket',
      availability: 'AVAILABLE',
      verificationStatus: 'UNVERIFIED',
      donationCount: 7,
      lastDonationDate: '2025-08-01',
      lastActive: '1 hour ago',
      privacy: { showArea: true },
    },
  ];

  appState.requests = [
    {
      id: 'req-1',
      requestId: 'REQ-2026-7B2F1',
      requesterId: 'user-requester-1',
      bloodGroup: 'O+',
      unitsRequired: 2,
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      country: 'India',
      area: 'Hazratganj',
      hospitalName: 'King George Medical University',
      hospitalAddress: 'Shah Mina Road, Lucknow',
      urgency: 'CRITICAL',
      requiredDate: '2026-08-31',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    },
  ];

  appState.notifications = [
    {
      id: 'notif-1',
      userId: 'user-donor-1',
      type: 'NEW_REQUEST',
      title: 'New nearby blood request',
      message: 'Someone nearby needs O+ blood in Lucknow.',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];
}
