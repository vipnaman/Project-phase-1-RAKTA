export type UserRole = 'USER' | 'DONOR' | 'ADMIN';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type AvailabilityStatus = 'AVAILABLE' | 'CONTACTED' | 'UNAVAILABLE';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type Urgency = 'NORMAL' | 'URGENT' | 'CRITICAL';
export type RequestStatus = 'OPEN' | 'MATCHED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
export type HelpStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'MAYBE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  profileImage?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDonorProfile {
  userId: string;
  bloodGroup: BloodGroup;
  state: string;
  country: string;
  city: string;
  area?: string;
  availability: AvailabilityStatus;
  lastDonationDate?: Date;
  donationCount: number;
  verificationStatus: VerificationStatus;
  privacySettings: {
    showArea: boolean;
    allowEmergencyRequests: boolean;
    allowNormalRequests: boolean;
    allowNotifications: boolean;
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBloodRequest {
  requesterId: string;
  requestId: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  state: string;
  country: string;
  city: string;
  area?: string;
  hospitalName?: string;
  hospitalAddress?: string;
  urgency: Urgency;
  requiredDate?: Date;
  requiredTime?: string;
  description?: string;
  status: RequestStatus;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHelpRequest {
  bloodRequestId: string;
  donorId: string;
  requesterId: string;
  status: HelpStatus;
  message?: string;
  respondedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotification {
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedRequestId?: string;
  createdAt?: Date;
}

export interface ICity {
  name: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}
