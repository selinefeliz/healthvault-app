import { db } from './firebase.config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../models/user';

const USERS_COL = 'users';

export const UserService = {
  /** Fetches the user profile from Firestore. Returns null if not yet created. */
  getProfile: async (uid: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, USERS_COL, uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  },

  /** Creates a new user profile document after registration. */
  createProfile: async (profile: UserProfile): Promise<void> => {
    await setDoc(doc(db, USERS_COL, profile.uid), profile);
  },

  /** Partially updates an existing user profile. */
  updateProfile: async (uid: string, data: Partial<UserProfile>): Promise<void> => {
    await updateDoc(doc(db, USERS_COL, uid), { ...data, updatedAt: Date.now() });
  },
};
