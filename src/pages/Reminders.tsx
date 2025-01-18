import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Bell, Plus, Trash2 } from 'lucide-react';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0_MLI5AbySSvjdEazru2RNWuUnrwJKds",
  authDomain: "health-care-hackathon.firebaseapp.com",
  projectId: "health-care-hackathon",
  storageBucket: "health-care-hackathon.appspot.com",
  messagingSenderId: "323418597584",
  appId: "1:323418597584:web:2c790aaf9a140417c756d5",
  measurementId: "G-4JBJX8E5F2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Reminder {
  id: string;
  medicine: string;
  time: string;
  frequency: string;
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [medicine, setMedicine] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [newNotification, setNewNotification] = useState(false);

  // Audio for notifications
  const notificationAudio = new Audio('/src/assets/notification-22-270130.mp3');

  // Fetch reminders from Firestore
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'reminders'));
        const fetchedReminders: Reminder[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Reminder[];
        setReminders(fetchedReminders);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  // Periodic check for reminders
  useEffect(() => {
    const checkReminders = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      reminders.forEach((reminder) => {
        if (reminder.time === currentTime) {
          triggerNotification(`It's time to take your medicine: ${reminder.medicine}`);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(checkReminders);
  }, [reminders]);

  // Trigger notification
  const triggerNotification = (message: string) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
      notificationAudio.play();
      setNewNotification(true);
    }
  };

  // Add a new reminder
  const addReminder = async () => {
    if (medicine.trim() && time.trim()) {
      const newReminder = { medicine, time, frequency };
      const tempId = Date.now().toString(); // Temporary ID for optimistic UI
      setReminders([...reminders, { id: tempId, ...newReminder }]);

      try {
        const docRef = await addDoc(collection(db, 'reminders'), newReminder);
        setReminders((prevReminders) =>
          prevReminders.map((reminder) =>
            reminder.id === tempId ? { ...reminder, id: docRef.id } : reminder
          )
        );
      } catch (error) {
        console.error('Error adding reminder:', error);
        setReminders((prevReminders) =>
          prevReminders.filter((reminder) => reminder.id !== tempId)
        );
      }

      setMedicine('');
      setTime('');
      setFrequency('daily');
    } else {
      alert('Please enter valid medicine name and time.');
    }
  };

  // Delete a reminder
  const deleteReminder = async (id: string) => {
    const filteredReminders = reminders.filter((reminder) => reminder.id !== id);
    setReminders(filteredReminders);

    try {
      await deleteDoc(doc(db, 'reminders', id));
    } catch (error) {
      console.error('Error deleting reminder:', error);
      setReminders(filteredReminders);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Medicine Reminders</h2>

      {/* Bell Icon with Notification Indicator */}
      <div className="relative mb-4">
        <Bell className="w-8 h-8 text-indigo-600" />
        {newNotification && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Medicine name"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="border rounded-md p-2"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border rounded-md p-2"
          />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            onClick={addReminder}
            className="bg-indigo-600 text-white rounded-md p-2 flex items-center justify-center hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Reminder
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Active Reminders</h3>
        {loading ? (
          <p className="text-gray-500">Loading reminders...</p>
        ) : reminders.length === 0 ? (
          <p className="text-gray-500">No reminders set</p>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-indigo-600 mr-3" />
                  <div>
                    <p className="font-medium">{reminder.medicine}</p>
                    <p className="text-sm text-gray-500">
                      {reminder.time} - {reminder.frequency}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
