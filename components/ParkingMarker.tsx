// components/ParkingMarker.tsx
import React from 'react';
import { Marker } from 'react-native-maps';

interface ParkingMarkerProps {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const ParkingMarker: React.FC<ParkingMarkerProps> = ({ id, name, latitude, longitude }) => (
  <Marker
    key={id.toString()}
    coordinate={{ latitude, longitude }}
    title={name}
    description="Parking spot"
  />
);

export default ParkingMarker;
