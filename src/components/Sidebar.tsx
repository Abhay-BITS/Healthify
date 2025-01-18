import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Map,
  Calendar,
  Bell,
  MessageSquare,
  Stethoscope,
  AlertCircle,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Find Hospitals', icon: Map, path: '/hospitals' },
  { name: 'Appointments', icon: Calendar, path: '/appointments' },
  { name: 'Reminders', icon: Bell, path: '/reminders' },
  { name: 'Community', icon: MessageSquare, path: '/community' },
  { name: 'Symptom Checker', icon: Stethoscope, path: '/symptoms' },
  { name: 'Emergency', icon: AlertCircle, path: '/emergency' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity md:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 flex flex-col bg-white w-64 transform transition-transform md:translate-x-0 md:relative ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 px-4 flex items-center">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}