import { auth } from './firebase.config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';

export const AuthService = {
  login: async (email: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, email, pass);
  },
  register: async (email: string, pass: string) => {
    return await createUserWithEmailAndPassword(auth, email, pass);
  },
  logout: async () => {
    return await signOut(auth);
  },
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  }
};
