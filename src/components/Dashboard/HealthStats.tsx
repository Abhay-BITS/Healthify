import React from 'react';
import { Activity, Heart, Moon, Flame } from 'lucide-react';
import type { HealthStats as HealthStatsType } from '../../types';

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

interface HealthStatsProps {
  stats: HealthStatsType;
}

export default function HealthStats({ stats }: HealthStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Steps"
        value={stats.steps}
        unit="steps"
        icon={<Activity className="h-6 w-6 text-indigo-600" />}
      />
      <StatCard
        title="Heart Rate"
        value={stats.heartRate}
        unit="bpm"
        icon={<Heart className="h-6 w-6 text-indigo-600" />}
      />
      <StatCard
        title="Sleep"
        value={stats.sleep}
        unit="hours"
        icon={<Moon className="h-6 w-6 text-indigo-600" />}
      />
      <StatCard
        title="Calories"
        value={stats.calories}
        unit="kcal"
        icon={<Flame className="h-6 w-6 text-indigo-600" />}
      />
    </div>
  );
}