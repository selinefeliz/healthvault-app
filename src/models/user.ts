export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  gender: 'F' | 'M' | 'Other';
  dateOfBirth?: string; // ISO String
  createdAt: number;
  partnerUid?: string; // Sync male user with female cycle
}
