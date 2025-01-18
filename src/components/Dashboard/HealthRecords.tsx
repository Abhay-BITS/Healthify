import React from 'react';
import { FileText, Activity, TestTube } from 'lucide-react';
import type { HealthRecord } from '../../types/database';

interface HealthRecordsProps {
  records: HealthRecord[];
}

export default function HealthRecords({ records }: HealthRecordsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <FileText className="h-6 w-6 text-blue-600" />;
      case 'prescription':
        return <Activity className="h-6 w-6 text-green-600" />;
      case 'lab':
        return <TestTube className="h-6 w-6 text-purple-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div key={record.id} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getIcon(record.type)}
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {record.type.charAt(0).toUpperCase() + record.type.slice(1)} Record
                </h3>
                <p className="text-sm text-gray-500">{record.date}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">{record.provider}</span>
          </div>

          <div className="mt-4 space-y-4">
            {record.details.diagnosis && (
              <div>
                <h4 className="text-sm font-medium text-gray-900">Diagnosis</h4>
                <p className="mt-1 text-sm text-gray-600">{record.details.diagnosis}</p>
              </div>
            )}

            {record.details.medications && record.details.medications.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900">Medications</h4>
                <div className="mt-2 space-y-2">
                  {record.details.medications.map((med, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency}
                      {med.duration && ` for ${med.duration}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {record.details.labResults && record.details.labResults.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900">Lab Results</h4>
                <div className="mt-2 space-y-2">
                  {record.details.labResults.map((lab, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <span className="font-medium">{lab.test}</span>: {lab.result} {lab.unit}
                      <span className="text-gray-400 ml-2">(Normal: {lab.normalRange})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {record.details.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                <p className="mt-1 text-sm text-gray-600">{record.details.notes}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}