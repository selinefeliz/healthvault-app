import { create } from 'zustand';
import { UserProfile } from '../models/user';

interface UserState {
  profile: UserProfile | null;
  isProfileLoaded: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setProfileLoaded: (v: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isProfileLoaded: false,
  setProfile: (profile) => set({ profile }),
  setProfileLoaded: (v) => set({ isProfileLoaded: v }),
}));
