// types/database.ts
export interface HealthRecord {
  id: string;
  patientId: string;
  date: string;
  type: 'medical' | 'lab';
  provider: string;
  details: any;
}

export interface PatientProfile {
  uid: string;
  name: string;
  age: number;
  gender: string;
  conditions: string[];
  createdAt: string;
  updatedAt: string;
}
