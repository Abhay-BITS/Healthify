import React, { useState } from 'react';
import { Phone, MapPin, AlertTriangle } from 'lucide-react';

const emergencyContacts = [
  { name: 'Emergency Services', number: '911' },
  { name: 'Poison Control', number: '1-800-222-1222' },
  { name: 'Mental Health Crisis', number: '988' },
];

export default function Emergency() {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
        <div className="flex">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">
              Emergency Services
            </h3>
            <p className="text-sm text-red-700 mt-2">
              If you're experiencing a medical emergency, immediately dial 911 or your local emergency number.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Emergency Contacts</h3>
          <div className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.number}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-gray-500">{contact.number}</p>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Your Location</h3>
          <p className="text-gray-600 mb-4">
            Share your location to help emergency services find you quickly.
          </p>
          <button
            onClick={getLocation}
            disabled={loading}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center"
          >
            <MapPin className="w-5 h-5 mr-2" />
            {loading ? 'Getting Location...' : 'Share Location'}
          </button>
          {location && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Your current coordinates:</p>
              <p className="font-mono mt-2">
                Latitude: {location.coords.latitude.toFixed(6)}
                <br />
                Longitude: {location.coords.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Emergency Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">What to Do</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Stay calm and assess the situation</li>
              <li>Call emergency services immediately</li>
              <li>Follow dispatcher instructions</li>
              <li>Send someone to guide emergency responders</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">What to Have Ready</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Your exact location</li>
              <li>Nature of the emergency</li>
              <li>Any relevant medical history</li>
              <li>Current medications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}