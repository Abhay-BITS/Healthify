import React, { useState, useEffect } from "react";
 import { db } from '../services/firebase';  // Ensure the correct path // Import Firebase configuration
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import "./Appointments.css";

const Appointments: React.FC = () => {
  // Data types
  interface Doctor {
    id: number;
    name: string;
    specialization: string;
    contactNumber: string;
    availableSlots: string[];
  }

  interface Hospital {
    id: number;
    name: string;
    address: string;
    doctors: Doctor[];
  }

  interface Appointment {
    hospitalName: string;
    doctorName: string;
    specialization: string;
    slot: string;
  }

  // Hardcoded hospital and doctor data
  const hospitals: Hospital[] = [
    {
      id: 1,
      name: "BITS Medical Center [MedC]",
      address: "Vidya Vihar Campus, Pilani",
      doctors: [
        {
          id: 1,
          name: "Dr. Aditya Singh",
          specialization: "Cardiology",
          contactNumber: "+91 9875387952",
          availableSlots: ["10:00 AM", "11:00 AM", "2:00 PM"],
        },
      ],
    },
    {
      id: 2,
      name: "Indra Hospital",
      address: "F-38 Industrial Area, Near Tagore School, Pilani, Rajasthan",
      doctors: [
        {
          id: 2,
          name: "Dr. Anjali Sharma",
          specialization: "Orthopedics",
          contactNumber: "+91 7692849769",
          availableSlots: ["9:00 AM", "1:00 PM", "4:00 PM"],
        },
      ],
    },
  ];

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load appointments from Firestore
  useEffect(() => {
    const fetchAppointments = async () => {
      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, orderBy("slot", "asc"));
      const querySnapshot = await getDocs(q);
      const fetchedAppointments = querySnapshot.docs.map((doc) => doc.data());
      setAppointments(fetchedAppointments as Appointment[]);
    };
    fetchAppointments();
  }, []);

  // Save appointment to Firestore
  const saveAppointment = async (appointment: Appointment) => {
    const appointmentsRef = collection(db, "appointments");
    await addDoc(appointmentsRef, appointment);
    setAppointments((prev) => [...prev, appointment]);
  };

  const handleConfirmAppointment = () => {
    if (selectedHospital && selectedDoctor && selectedSlot) {
      const newAppointment: Appointment = {
        hospitalName: selectedHospital.name,
        doctorName: selectedDoctor.name,
        specialization: selectedDoctor.specialization,
        slot: selectedSlot,
      };
      saveAppointment(newAppointment);
      alert("Appointment Confirmed!");
    } else {
      alert("Please select all fields to confirm the appointment.");
    }
  };

  return (
    <div className="appointments-container">
      <h1 className="appointments-title">Book an Appointment</h1>

      {/* Hospitals */}
      <h2 className="section-title">Hospitals</h2>
      <div className="card-list">
        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className={`card ${
              selectedHospital?.id === hospital.id ? "card-selected" : ""
            }`}
            onClick={() => setSelectedHospital(hospital)}
          >
            <h3>{hospital.name}</h3>
            <p>{hospital.address}</p>
          </div>
        ))}
      </div>

      {/* Doctors */}
      {selectedHospital && (
        <>
          <h2 className="section-title">Doctors at {selectedHospital.name}</h2>
          <div className="card-list">
            {selectedHospital.doctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`card ${
                  selectedDoctor?.id === doctor.id ? "card-selected" : ""
                }`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <h4>{doctor.name}</h4>
                <p>Specialization: {doctor.specialization}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Slots */}
      {selectedDoctor && (
        <>
          <h2 className="section-title">Available Slots</h2>
          <div className="slot-list">
            {selectedDoctor.availableSlots.map((slot) => (
              <button
                key={slot}
                className={`slot-button ${
                  selectedSlot === slot ? "slot-selected" : ""
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Confirm Appointment */}
      {selectedSlot && (
        <button
          className="confirm-button"
          onClick={handleConfirmAppointment}
        >
          Confirm Appointment
        </button>
      )}

      {/* Your Appointments */}
      <h2 className="section-title">Your Appointments</h2>
      <div className="appointments-list">
        {appointments.map((appointment, index) => (
          <div key={index} className="card">
            <h3>{appointment.hospitalName}</h3>
            <p>Doctor: {appointment.doctorName}</p>
            <p>Specialization: {appointment.specialization}</p>
            <p>Time: {appointment.slot}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
