export interface MenstrualCycle {
  id: string;
  userUid: string;
  periodStartDate: string; // ISO 8601
  periodEndDate: string; 
  cycleLength: number; // in days typically 28
  periodLength: number; // typically 5 
  notes?: string;
  symptoms: string[];
}

export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';
