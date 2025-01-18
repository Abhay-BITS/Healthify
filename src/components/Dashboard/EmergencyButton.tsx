import React, { useState } from 'react';
import { AlertCircle, Phone } from 'lucide-react';

interface EmergencyButtonProps {
  onEmergency: () => void;
}

export default function EmergencyButton({ onEmergency }: EmergencyButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmergency = () => {
    setShowConfirm(false);
    onEmergency();
  };

  return (
    <div className="fixed bottom-8 right-8">
      {showConfirm && (
        <div className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-lg shadow-lg p-4">
          <div className="text-red-600 font-medium mb-2">Confirm Emergency</div>
          <p className="text-sm text-gray-600 mb-4">
            This will alert emergency services and your emergency contacts.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleEmergency}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowConfirm(true)}
        className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
      >
        <AlertCircle className="h-6 w-6" />
        <span className="font-medium">Emergency</span>
      </button>
    </div>
  );
}