//hospitalmap.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Hospital } from '../../services/hospitals';

interface HospitalMapProps {
  hospitals: Hospital[];
  center: { lat: number; lng: number };
  selectedHospital: Hospital | null;
  onHospitalSelect: (hospital: Hospital | null) => void;
}

export default function HospitalMap({
  hospitals,
  center,
  selectedHospital,
  onHospitalSelect,
}: HospitalMapProps) {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={[hospital.location.lat, hospital.location.lng]}
          eventHandlers={{
            click: () => onHospitalSelect(hospital),
          }}
        >
          <Popup>
            <h3>{hospital.name}</h3>
            <p>{hospital.address}</p>
            {hospital.rating && <p>Rating: {hospital.rating} ⭐</p>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}