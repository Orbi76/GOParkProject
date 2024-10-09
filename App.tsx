// App.tsx
import React, { useState } from 'react';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import fetchParkingSpots from './utils/fetchParkingSpots'; // Import your parking fetch function
import ParkingMarker from './components/ParkingMarker';

function App(): React.JSX.Element {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const [parkingSpots, setParkingSpots] = useState<
    { id: string; name: string; latitude: number; longitude: number }[]
  >([]);

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);

    fetchParkingSpots(coordinate.latitude, coordinate.longitude).then((spots) => {
      setParkingSpots(spots);
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 47.5068428, // Coordinates in Budapest
          longitude: 19.0469664,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
          />
        )}

        {parkingSpots.map(spot => (
          <ParkingMarker
            key={spot.id}
            id={spot.id}
            name={spot.name}
            latitude={spot.latitude}
            longitude={spot.longitude}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
