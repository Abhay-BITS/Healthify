import React, { useState } from 'react';
import { Truck } from 'lucide-react';

interface Ambulance {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'enroute' | 'busy';
  eta?: string;
  phoneNumber: string; // Hardcoded ambulance phone number
}

interface AmbulanceTrackerProps {
  ambulances: Ambulance[];
  nearestHospital: string; // Hardcoded nearest hospital name
}

const AmbulanceTracker = ({ ambulances, nearestHospital }: AmbulanceTrackerProps) => {
  // Limit to first 3 ambulances
  const limitedAmbulances = ambulances.slice(0, 3);

  // Function to handle ambulance call
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`; // Opens dialer with phone number
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">Nearby Ambulances</h3>
      
      <p className="mb-4 text-sm text-gray-600">Nearest Hospital: {nearestHospital}</p>

      <div className="space-y-3">
        {limitedAmbulances.map((ambulance) => (
          <div
            key={ambulance.id}
            className="flex items-center justify-between p-3 border rounded-md"
          >
            <div className="flex items-center">
              <Truck
                className={`h-5 w-5 ${
                  ambulance.status === 'available'
                    ? 'text-green-500'
                    : ambulance.status === 'enroute'
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}
              />
              <div className="ml-3">
                <p className="text-sm font-medium">Ambulance #{ambulance.id}</p>
                <p className="text-xs text-gray-500">
                  Status: {ambulance.status.charAt(0).toUpperCase() + ambulance.status.slice(1)}
                </p>
              </div>
            </div>
            {ambulance.eta && (
              <span className="text-sm text-gray-600">ETA: {ambulance.eta}</span>
            )}
            <button
              onClick={() => handleCall(ambulance.phoneNumber)}
              className="ml-3 text-sm text-blue-600 hover:underline"
            >
              Call Ambulance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example hardcoded data
const ambulances: Ambulance[] = [
  {
    id: "A001",
    location: { lat: 28.3585879, lng: 75.6068089 },
    status: "available",
    phoneNumber: "9876543210",
    eta: "5 min",
  },
  {
    id: "A002",
    location: { lat: 28.3672801, lng: 75.6016833 },
    status: "enroute",
    phoneNumber: "9876543211",
    eta: "10 min",
  },
  {
    id: "A003",
    location: { lat: 28.3742325, lng: 75.5873476 },
    status: "busy",
    phoneNumber: "9876543212",
    eta: "N/A",
  },
  {
    id: "A004",
    location: { lat: 28.3626393, lng: 75.598692 },
    status: "available",
    phoneNumber: "9876543213",
    eta: "3 min",
  },
  // Add more ambulances if needed
];

const nearestHospital = "BITS Pilani Medical Centre [MedC]";

export default function App() {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <AmbulanceTracker ambulances={ambulances} nearestHospital={nearestHospital} />
    </div>
  );
}