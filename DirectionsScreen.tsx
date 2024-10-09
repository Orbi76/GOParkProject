// DirectionsScreen.tsx
import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

interface DirectionsScreenProps {
  route: {
    params: {
      destination: {
        latitude: number;
        longitude: number;
      };
      origin: {
        latitude: number;
        longitude: number;
      };
    };
  };
}

const DirectionsScreen: React.FC<DirectionsScreenProps> = ({ route }) => {
  const { destination, origin } = route.params;

  // Dummy route data for demonstration
  const routeCoordinates = [
    origin,
    destination,
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={origin} title="Your Location" />
        <Marker coordinate={destination} title="Parking Spot" />

        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#000" // You can choose your color
          strokeWidth={6}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default DirectionsScreen;
