export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  contact: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  specialties: string[];
}

export interface Appointment {
  id: string;
  userId: string;
  hospitalId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface HealthStats {
  steps: number;
  heartRate: number;
  sleep: number;
  calories: number;
}