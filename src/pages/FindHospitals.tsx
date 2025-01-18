
// This page component fetches the user's location and displays nearby hospitals on a map.
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Globe } from 'lucide-react';
import HospitalMap from '../components/Hospitals/HospitalMap';
import AmbulanceTracker from '../components/Hospitals/AmbulanceTracker';
import { searchNearbyHospitals, type Hospital } from '../services/hospitals';

// Mock ambulance data
const mockAmbulances = [
  {
    id: 'A001',
    location: { lat: 0, lng: 0 },
    status: 'available',
  },
  {
    id: 'A002',
    location: { lat: 0, lng: 0 },
    status: 'enroute',
    eta: '5 mins',
  },
  {
    id: 'A003',
    location: { lat: 0, lng: 0 },
    status: 'busy',
  },
];

export default function FindHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Fetch mock hospital data
        const nearbyHospitals = searchNearbyHospitals(latitude, longitude);
        setHospitals(nearbyHospitals);

        // Update ambulance locations based on user location
        mockAmbulances[0].location = { lat: latitude + 0.005, lng: longitude + 0.005 };
        mockAmbulances[1].location = { lat: latitude - 0.005, lng: longitude - 0.005 };
        mockAmbulances[2].location = { lat: latitude + 0.007, lng: longitude - 0.007 };

        setLoading(false);
      },
      () => {
        setError('Unable to access location');
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p>Loading nearby hospitals...</p>
        </div>
      </div>
    );
  }

  if (error || !userLocation) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error || 'Location access is required'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Find Nearby Hospitals</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HospitalMap
            hospitals={hospitals}
            center={userLocation}
            selectedHospital={selectedHospital}
            onHospitalSelect={setSelectedHospital}
          />
          <div className="mt-6">
            <AmbulanceTracker ambulances={mockAmbulances} />
          </div>
        </div>

        <div className="space-y-4">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className={`bg-white p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                selectedHospital?.id === hospital.id
                  ? 'ring-2 ring-indigo-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedHospital(hospital)}
            >
              <h3 className="font-medium">{hospital.name}</h3>
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {hospital.address}
                </p>
                {hospital.phone && (
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {hospital.phone}
                  </p>
                )}
                {hospital.website && (
                  <a
                    href={hospital.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}