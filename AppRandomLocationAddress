import React, { useState } from 'react';
import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView, { Marker, MapPressEvent, UrlTile } from 'react-native-maps';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from 'react-native';

function App(): React.JSX.Element {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [address, setAddress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle user tapping on the map
  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    reverseGeocode(coordinate.latitude, coordinate.longitude);
  };

  // Reverse geocode coordinates to an address using OpenStreetMap's Nominatim API
  const reverseGeocode = async (latitude: number, longitude: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
        setErrorMessage(null); // Clear any previous error
      } else {
        setAddress('Unable to retrieve address');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage('Error fetching address');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
                latitude: 47.5068428, // Example coordinates
                longitude: 19.0469664,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}
            onPress={handleMapPress}
            >
            <UrlTile
                urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                subdomains={['a', 'b', 'c']}
            />
            {selectedLocation && (
            <Marker
                coordinate={selectedLocation}
                title="Selected Location"
                description={`Lat: ${selectedLocation.latitude}, Lng: ${selectedLocation.longitude}`}
            />
            )}
        </MapView>

      </View>
      {/* Display selected coordinates */}
      {selectedLocation && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Selected Coordinates: 
            {' '}
            {selectedLocation.latitude}, {selectedLocation.longitude}
          </Text>
        </View>
      )}
      {/* Display fetched address */}
      {address && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>Address: {address}</Text>
        </View>
      )}
      {/* Display error message if any */}
      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  infoText: {
    fontSize: 16,
  },
  addressContainer: {
    padding: 10,
    backgroundColor: 'lightgray',
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: 'red',
  },
  errorText: {
    fontSize: 16,
    color: 'white',
  },
});

export default App;
