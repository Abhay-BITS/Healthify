import axios from 'axios';

const FHIR_BASE_URL = 'YOUR_FHIR_SERVER_URL';

export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  name: [{
    given: string[];
    family: string;
  }];
  birthDate: string;
  gender: string;
}

export interface FHIRObservation {
  resourceType: 'Observation';
  id: string;
  status: string;
  code: {
    coding: [{
      system: string;
      code: string;
      display: string;
    }];
  };
  valueQuantity?: {
    value: number;
    unit: string;
  };
  effectiveDateTime: string;
}

export const fetchPatientData = async (patientId: string) => {
  try {
    const response = await axios.get(`${FHIR_BASE_URL}/Patient/${patientId}`);
    return response.data as FHIRPatient;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error;
  }
};

export const fetchPatientObservations = async (patientId: string) => {
  try {
    const response = await axios.get(
      `${FHIR_BASE_URL}/Observation?patient=${patientId}`
    );
    return response.data.entry.map((e: any) => e.resource as FHIRObservation);
  } catch (error) {
    console.error('Error fetching patient observations:', error);
    throw error;
  }
};