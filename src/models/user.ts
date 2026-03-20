export type BiologicalSex = 'F' | 'M' | 'Other';
export type UserRole = 'user' | 'tutor';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  biologicalSex: BiologicalSex;
  dateOfBirth?: string; // ISO String YYYY-MM-DD
  role: UserRole;
  isTutor: boolean;
  // Female-specific
  lastPeriodDate?: string;
  averageCycleLength?: number;
  averagePeriodLength?: number;
  isPregnant?: boolean;
  usesContraceptives?: boolean;
  contraceptiveType?: string;
  // Male-specific
  partnerUid?: string;
  // Biometrics
  weightKg?: number;
  heightCm?: number;
  bloodType?: string;
  allergies?: string[];
  // Meta
  onboardingCompleted: boolean;
  createdAt: number;
  updatedAt: number;
}
