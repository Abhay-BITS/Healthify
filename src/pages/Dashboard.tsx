import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import PatientProfileView from '../components/Dashboard/PatientProfile'; // Fixed import
import { PatientProfileForm } from '../components/Dashboard/PatientProfileForm';
import HealthRecords from '../components/Dashboard/HealthRecords';
import EmergencyButton from '../components/Dashboard/EmergencyButton';
import { HealthRecord, PatientProfile } from '../types/database';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [airQuality, setAirQuality] = useState<{
    location: string;
    aqi: number;
    category: string;
    tips: string[];
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;

      try {
        const profileDoc = await getDoc(doc(db, 'patientProfiles', currentUser.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as PatientProfile);
        } else {
          setShowProfileForm(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchHealthData = async () => {
      try {
        const response = await fetch('https://api.mocki.io/v2/51597893');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setHealthRecords(data.records);
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAirQuality = async () => {
      // Get the user's current location using geolocation API
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const apiKey = 'fc78c8ce962e4b66843cfb238ce7b500';

          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
            );
            if (!response.ok) throw new Error('Failed to fetch air quality data');
            const data = await response.json();

            const aqi = data.list[0].main.aqi; // Air Quality Index
            let category = '';
            let tips = [];

            switch (aqi) {
              case 1:
                category = 'Good';
                tips = ['Enjoy outdoor activities!', 'Try deep breathing exercises for relaxation.'];
                break;
              case 2:
                category = 'Fair';
                tips = ['Consider reducing outdoor activities if you have sensitivities.', 'Use an air purifier indoors.'];
                break;
              case 3:
                category = 'Moderate';
                tips = ['Limit prolonged outdoor exertion.', 'Monitor symptoms if sensitive.'];
                break;
              case 4:
                category = 'Poor';
                tips = ['Avoid outdoor activities.', 'Wear a mask if going outside.', 'Use an air purifier indoors.'];
                break;
              case 5:
                category = 'Very Poor';
                tips = ['Stay indoors.', 'Avoid physical activity.', 'Keep windows and doors closed.'];
                break;
              default:
                category = 'Unknown';
                tips = ['Air quality data is unavailable.'];
            }

            setAirQuality({
              location: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`, // Displaying coordinates
              aqi,
              category,
              tips,
            });
          } catch (error) {
            console.error('Error fetching air quality data:', error);
          }
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    };

    if (currentUser) {
      fetchProfile();
      fetchHealthData();
      fetchAirQuality();
    }
  }, [currentUser]);

  const handleProfileComplete = () => {
    setShowProfileForm(false);
    window.location.reload(); // Refresh to show the new profile
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <div className="max-w-7xl mx-auto py-6">
        <PatientProfileForm currentUser={currentUser} onComplete={handleProfileComplete} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Health Dashboard
          </h2>
        </div>
      </div>

      {profile && <PatientProfileView profile={profile} />}

      <div className="space-y-6">
        {airQuality && (
          <div className="p-4 bg-blue-100 rounded-lg shadow">
            <h3 className="text-lg font-bold">Air Quality Update</h3>
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Location: {airQuality.location}</p>
            <p>AQI: {airQuality.aqi} ({airQuality.category})</p>
            <ul>
              {airQuality.tips.map((tip, index) => (
                <li key={index}>- {tip}</li>
              ))}
            </ul>
          </div>
        )}

        <HealthRecords records={healthRecords} />
        <EmergencyButton onEmergency={() => console.log('Emergency triggered')} />
      </div>
    </div>
  );
}
