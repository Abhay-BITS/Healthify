import React, { useEffect, useState } from 'react';
import { Activity, Heart, Moon, Flame } from 'lucide-react';
import { getGoogleFitData, initGoogleFit } from '../../services/googleFit';
import { useAuth } from '../../contexts/AuthContext';

interface HealthData {
  steps: number;
  heartRate: number;
  calories: number;
  sleep: number;
}

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, unit, icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="p-2 bg-indigo-100 rounded-lg">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {value.toLocaleString()} {unit}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function GoogleFitStats() {
  const [healthData, setHealthData] = useState<HealthData>({
    steps: 0,
    heartRate: 0,
    calories: 0,
    sleep: 0
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchGoogleFitData = async () => {
      try {
        await initGoogleFit();
        const auth2 = gapi.auth2.getAuthInstance();
        const user = auth2.currentUser.get();
        const accessToken = user.getAuthResponse().access_token;
        const data = await getGoogleFitData(accessToken);
        setHealthData(data);
      } catch (error) {
        console.error('Error fetching Google Fit data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchGoogleFitData();
    }
  }, [currentUser]);

  if (loading) {
    return <div>Loading health data...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Steps"
        value={healthData.steps}
        unit="steps"
        icon={<Activity className="h-6 w-6 text-indigo-600" />}
      />
      <StatCard
        title="Heart Rate"
        value={healthData.heartRate}
        unit="bpm"
        icon={<Heart className="h-6 w-6 text-indigo-600" />}
      />
      <StatCard
        title="Sleep"
        value={healthData.sleep}
        unit="hours"
        icon={<Moon className="h-6 w-6 text-indigo-600" />}
      />
      <StatCard
        title="Calories"
        value={healthData.calories}
        unit="kcal"
        icon={<Flame className="h-6 w-6 text-indigo-600" />}
      />
    </div>
  );
}