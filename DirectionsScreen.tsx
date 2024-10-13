// DirectionsScreen.tsx
import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { View, StyleSheet, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './Navigation';

type DirectionsScreenRouteProp = RouteProp<RootStackParamList, 'Directions'>;


interface DirectionsScreenProps {
    route: DirectionsScreenRouteProp;
}

const DirectionsScreen: React.FC<DirectionsScreenProps> = ({ route }) => {
  const { origin, destination } = route.params;

  if (!destination) {
    Alert.alert('Error', 'No parking spot data found.');
    return null;
  }
  if (!origin) {
    Alert.alert('Error', 'No origin location data found.');
    return null;
  }



  const routeCoordinates = [
    { latitude: origin.latitude, longitude: origin.longitude },
    { latitude: destination.latitude, longitude: destination.longitude },
  ];
  

  console.log('Route Coordinates:', routeCoordinates);
  console.log('Origin:', origin);
  console.log('Destination:', destination);


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
            latitude: (origin.latitude + destination.latitude) / 2,
            longitude: (origin.longitude + destination.longitude) / 2,
            latitudeDelta: Math.abs(origin.latitude - destination.latitude) + 0.01,
            longitudeDelta: Math.abs(origin.longitude - destination.longitude) + 0.01,
        }}
      >
        <Marker coordinate={origin} title="Your Location" />
        <Marker coordinate={destination} title={destination.name} />

        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF0000" // You can choose your color
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