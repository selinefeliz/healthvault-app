import { db } from './firebase.config';
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, Timestamp
} from 'firebase/firestore';
import {
  MedicalFile, Medication, Appointment, Vaccine, CycleLog,
  GlossaryEntry, PartnerRequest, Dependent
} from '../models/index';

// ─────────────────────────────────────────────────────────────
// Subcollection helper
// ─────────────────────────────────────────────────────────────
const sub = (uid: string, col: string) => collection(db, 'users', uid, col);

// ─────────────────────────────────────────────────────────────
// Medical Files Service
// ─────────────────────────────────────────────────────────────
export const MedicalFilesService = {
  list: async (uid: string, dependentId?: string | null): Promise<MedicalFile[]> => {
    const q = query(
      sub(uid, 'medical_files'),
      where('dependentId', '==', dependentId ?? null),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MedicalFile));
  },
  add: async (uid: string, data: Omit<MedicalFile, 'id' | 'createdAt'>): Promise<string> => {
    const ref = await addDoc(sub(uid, 'medical_files'), { ...data, createdAt: Date.now() });
    return ref.id;
  },
  delete: async (uid: string, fileId: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', uid, 'medical_files', fileId));
  },
};

// ─────────────────────────────────────────────────────────────
// Medications Service
// ─────────────────────────────────────────────────────────────
export const MedicationsService = {
  list: async (uid: string): Promise<Medication[]> => {
    const snap = await getDocs(query(sub(uid, 'medications'), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Medication));
  },
  add: async (uid: string, data: Omit<Medication, 'id' | 'createdAt'>): Promise<string> => {
    const ref = await addDoc(sub(uid, 'medications'), { ...data, createdAt: Date.now() });
    return ref.id;
  },
  update: async (uid: string, medId: string, data: Partial<Medication>): Promise<void> => {
    await updateDoc(doc(db, 'users', uid, 'medications', medId), data);
  },
  delete: async (uid: string, medId: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', uid, 'medications', medId));
  },
};

// ─────────────────────────────────────────────────────────────
// Appointments Service
// ─────────────────────────────────────────────────────────────
export const AppointmentsService = {
  list: async (uid: string): Promise<Appointment[]> => {
    const snap = await getDocs(query(sub(uid, 'appointments'), orderBy('date', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
  },
  add: async (uid: string, data: Omit<Appointment, 'id' | 'createdAt'>): Promise<string> => {
    const ref = await addDoc(sub(uid, 'appointments'), { ...data, createdAt: Date.now() });
    return ref.id;
  },
  delete: async (uid: string, aptId: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', uid, 'appointments', aptId));
  },
};

// ─────────────────────────────────────────────────────────────
// Vaccines Service
// ─────────────────────────────────────────────────────────────
export const VaccinesService = {
  list: async (uid: string): Promise<Vaccine[]> => {
    const snap = await getDocs(query(sub(uid, 'vaccines'), orderBy('date', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Vaccine));
  },
  add: async (uid: string, data: Omit<Vaccine, 'id' | 'createdAt'>): Promise<string> => {
    const ref = await addDoc(sub(uid, 'vaccines'), { ...data, createdAt: Date.now() });
    return ref.id;
  },
  delete: async (uid: string, vaccineId: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', uid, 'vaccines', vaccineId));
  },
};

// ─────────────────────────────────────────────────────────────
// Cycle Logs Service
// ─────────────────────────────────────────────────────────────
export const CycleLogsService = {
  list: async (uid: string, limit = 90): Promise<CycleLog[]> => {
    const snap = await getDocs(query(sub(uid, 'cycle_logs'), orderBy('date', 'desc')));
    return snap.docs.slice(0, limit).map(d => ({ id: d.id, ...d.data() } as CycleLog));
  },
  upsertDay: async (uid: string, data: Omit<CycleLog, 'id' | 'createdAt'>): Promise<void> => {
    // Uses date as document ID for idempotent daily logs
    await updateDoc(doc(db, 'users', uid, 'cycle_logs', data.date), data)
      .catch(() => addDoc(sub(uid, 'cycle_logs'), { ...data, id: data.date, createdAt: Date.now() }));
  },
};

// ─────────────────────────────────────────────────────────────
// Dependents Service
// ─────────────────────────────────────────────────────────────
export const DependentsService = {
  list: async (uid: string): Promise<Dependent[]> => {
    const snap = await getDocs(sub(uid, 'dependents'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Dependent));
  },
  add: async (uid: string, data: Omit<Dependent, 'id'>): Promise<string> => {
    const ref = await addDoc(sub(uid, 'dependents'), data);
    return ref.id;
  },
  delete: async (uid: string, depId: string): Promise<void> => {
    await deleteDoc(doc(db, 'users', uid, 'dependents', depId));
  },
};

// ─────────────────────────────────────────────────────────────
// Partner Sync Service
// ─────────────────────────────────────────────────────────────
export const PartnerSyncService = {
  sendRequest: async (fromUid: string, fromEmail: string, toEmail: string): Promise<string> => {
    const ref = await addDoc(collection(db, 'partner_requests'), {
      fromUid, fromEmail, toEmail, toUid: null,
      status: 'pending', createdAt: Date.now(),
    } as Omit<PartnerRequest, 'id'>);
    return ref.id;
  },
  getPendingRequests: async (uid: string, email: string): Promise<PartnerRequest[]> => {
    const snap = await getDocs(
      query(collection(db, 'partner_requests'), where('toEmail', '==', email), where('status', '==', 'pending'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as PartnerRequest));
  },
  acceptRequest: async (requestId: string, toUid: string, fromUid: string, myUid: string): Promise<void> => {
    // Accept the request
    await updateDoc(doc(db, 'partner_requests', requestId), { status: 'accepted', toUid });
    // Link both users bidirectionally
    await updateDoc(doc(db, 'users', myUid), { partnerUid: fromUid, updatedAt: Date.now() });
    await updateDoc(doc(db, 'users', fromUid), { partnerUid: myUid, updatedAt: Date.now() });
  },
  rejectRequest: async (requestId: string): Promise<void> => {
    await updateDoc(doc(db, 'partner_requests', requestId), { status: 'rejected' });
  },
};
