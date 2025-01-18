import React from 'react';
import { PatientProfile } from '../../types/database';

interface PatientProfileViewProps {
  profile: PatientProfile;
}

export default function PatientProfileView({ profile }: PatientProfileViewProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Profile</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Age</p>
          <p className="mt-1 text-sm text-gray-900">{profile.age}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Gender</p>
          <p className="mt-1 text-sm text-gray-900">{profile.gender}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Medical Conditions</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {profile.conditions.map((condition, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {condition}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}