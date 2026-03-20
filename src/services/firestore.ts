import { db } from './firebase.config';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const FirestoreService = {
  getDocument: async (col: string, id: string) => {
    const docRef = doc(db, col, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },
  createDocument: async (col: string, id: string, data: any) => {
    await setDoc(doc(db, col, id), data);
  },
  addDocument: async (col: string, data: any) => {
    return await addDoc(collection(db, col), data);
  },
  updateDocument: async (col: string, id: string, data: any) => {
    await updateDoc(doc(db, col, id), data);
  },
  queryDocuments: async (col: string, field: string, operator: any, value: any) => {
    const q = query(collection(db, col), where(field, operator, value));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};
