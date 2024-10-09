import React, { useState } from 'react';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { View, StyleSheet, Text, Modal, Button, Linking, Alert } from 'react-native';
import fetchParkingSpots from './utils/fetchParkingSpots'; // Import your parking fetch function

function App(): React.JSX.Element {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [parkingSpots, setParkingSpots] = useState<
    { id: string; name: string; latitude: number; longitude: number }[]
  >([]);

  const [selectedParkingSpot, setSelectedParkingSpot] = useState<
    { id: string; name: string; latitude: number; longitude: number } | null
  >(null);

  const [modalVisible, setModalVisible] = useState(false);

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
    fetchParkingSpots(coordinate.latitude, coordinate.longitude).then((spots) => {
      setParkingSpots(spots);
    });
  };

  const handleParkingMarkerPress = (spot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    setSelectedParkingSpot(spot);
    setModalVisible(true);
  };

  const navigateToSpot = () => {
    if (selectedParkingSpot) {
      const { latitude, longitude, name } = selectedParkingSpot;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

      Linking.openURL(url).catch((err) =>
        Alert.alert('Error', 'Failed to open navigation: ' + err.message)
      );
    }
  };



  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 47.5068428, // Example coordinates
          longitude: 19.0469664,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
          />
        )}

        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude,
            }}
            title={spot.name}
            description="Parking spot"
            onPress={() => handleParkingMarkerPress(spot)} // Handle marker press
          />
        ))}
      </MapView>

      {/* Modal for showing parking spot details */}
      {selectedParkingSpot && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Parking Spot Details</Text>
            <Text style={styles.modalText}>Name: {selectedParkingSpot.name}</Text>
            <Text style={styles.modalText}>
              Coordinates: {selectedParkingSpot.latitude}, {selectedParkingSpot.longitude}
            </Text>

            {/* Navigate Button */}
            <Button title="Navigate to this spot" onPress={navigateToSpot} />  
                      
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
