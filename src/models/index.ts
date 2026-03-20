// ─────────────────────────────────────────────────────────────
// Firestore Data Models — Feliz Healthy App
// Aligned with SRS 1.6 and Feature Requirements
// ─────────────────────────────────────────────────────────────

export type BiologicalSex = 'F' | 'M' | 'Other';
export type UserRole = 'user' | 'tutor';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | string;

// ── users/{uid} ──
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  biologicalSex: BiologicalSex;
  dateOfBirth?: string;
  role: UserRole;
  isTutor: boolean;
  // Female-specific
  lastPeriodDate?: string;
  averageCycleLength?: number;       // default 28
  averagePeriodLength?: number;      // default 5
  isPregnant?: boolean;
  pregnancyDueDate?: string;
  usesContraceptives?: boolean;
  contraceptiveType?: string;
  // Male-specific
  partnerUid?: string;               // UID of linked female partner
  wantsPartnerSync?: boolean;
  // Biometrics
  weightKg?: number;
  heightCm?: number;
  bloodType?: BloodType;
  allergies?: string[];
  // Meta
  onboardingCompleted: boolean;
  createdAt: number;
  updatedAt: number;
}

// ── users/{uid}/dependents/{id} ──
export interface Dependent {
  id: string;
  name: string;
  relation: string;                  // e.g. "Hijo/a", "Adulto mayor"
  biologicalSex: BiologicalSex;
  dateOfBirth?: string;
  bloodType?: BloodType;
  allergies?: string[];
}

// ── users/{uid}/medical_files/{id} ──
export type MedicalFileType = 'Laboratorio' | 'Vacuna' | 'Imagen' | 'Receta' | 'Otro';

export interface MedicalFile {
  id: string;
  title: string;
  type: MedicalFileType;
  fileUrl: string;
  storageRef: string;
  date: string;                      // ISO date
  notes?: string;
  dependentId?: string | null;       // null = belongs to the owner
  createdAt: number;
}

// ── users/{uid}/medications/{id} ──
export type FrequencyType = 'daily' | 'every_X_hours' | 'weekly' | 'as_needed';

export interface Medication {
  id: string;
  name: string;
  dose: string;                      // e.g. "500mg"
  frequency: FrequencyType;
  intervalHours?: number;            // used when frequency = every_X_hours
  durationInDays?: number;
  startDate: string;
  endDate?: string;
  notes?: string;
  dependentId?: string | null;
  isActive: boolean;
  createdAt: number;
}

// ── users/{uid}/appointments/{id} ──
export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  location?: string;
  notes?: string;
  indications?: string;
  dependentId?: string | null;
  createdAt: number;
}

// ── users/{uid}/vaccines/{id} ──
export interface Vaccine {
  id: string;
  name: string;
  date: string;
  nextDoseDate?: string;
  lot?: string;
  notes?: string;
  dependentId?: string | null;
  createdAt: number;
}

// ── users/{uid}/cycle_logs/{id} ──
export type FlowLevel = 'none' | 'light' | 'medium' | 'heavy';
export type MoodType = 'happy' | 'sad' | 'anxious' | 'irritable' | 'calm' | 'tired';

export interface CycleLog {
  id: string;
  date: string;                      // YYYY-MM-DD
  flowLevel: FlowLevel;
  painLevel: number;                 // 0-10
  mood: MoodType[];
  symptoms: string[];
  notes?: string;
  temperature?: number;              // Basal body temp for FAM users
  createdAt: number;
}

// ── glossary_cache/{termHash} ──
export interface GlossaryEntry {
  termNormalized: string;
  termDisplay: string;
  explanationAI: string;
  sourceUrl?: string;
  youtubeVideoId?: string;
  updatedAt: number;
}

// ── partner_requests/{requestId} ──
export type PartnerRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface PartnerRequest {
  id: string;
  fromUid: string;
  fromEmail: string;
  toEmail: string;
  toUid?: string;
  status: PartnerRequestStatus;
  createdAt: number;
}
