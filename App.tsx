import React, { useState } from 'react';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { View, StyleSheet, Text, Modal, Button, Alert } from 'react-native';
import fetchParkingSpots from './utils/fetchParkingSpots'; // Import your parking fetch function
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './Navigation';
import MapboxGL from '@react-native-mapbox-gl/maps';
import MapboxConfig from './mapboxConfig';

MapboxGL.setAccessToken(MapboxConfig.accessToken);



type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


function App(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();

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
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [temporaryLocation, setTemporaryLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false); // Added loading state


  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    // Show confirmation modal with the tapped coordinates
    if (!selectedLocation){
      setTemporaryLocation(coordinate); // Set the temporary location for confirmation
      setConfirmModalVisible(true); // Show the confirmation modal
    }
  };

  // Confirm the selected location as the starting point
  const confirmSelectedLocation = () => {
    if (temporaryLocation) {
      setSelectedLocation(temporaryLocation); // Set the confirmed location as the starting point
      setLoading(true);
      fetchParkingSpots(temporaryLocation.latitude, temporaryLocation.longitude)
        .then((spots) => setParkingSpots(spots))
        .catch((error) => Alert.alert('Error', 'Failed to fetch parking spots: ' + error.message))
        .finally(() => setLoading(false));
    }
    setConfirmModalVisible(false); // Hide the confirmation modal
  };

  const handleParkingMarkerPress = (spot: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    console.log('Selected Parking Spot:', spot)
    setSelectedParkingSpot(spot);
    setModalVisible(true);
  };


  const navigateToSpot = () => {
    if (selectedParkingSpot && selectedLocation) {
      navigation.navigate('Directions', { 
        origin: { 
          latitude: selectedLocation.latitude, 
          longitude: selectedLocation.longitude 
        },
        destination: { 
          id: selectedParkingSpot.id, 
          name: selectedParkingSpot.name, 
          latitude: selectedParkingSpot.latitude, 
          longitude: selectedParkingSpot.longitude 
        },
      });
      setModalVisible(false); // Close the modal once navigation starts
    }else {
      Alert.alert('Error', 'Could not get the origin or destination data.');
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

      {/* Confirmation Modal for Selected Location */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Use this location as your starting point?</Text>
          <Text style={styles.modalText}>
            Coordinates: {temporaryLocation?.latitude}, {temporaryLocation?.longitude}
          </Text>
          <Button title="Confirm" onPress={confirmSelectedLocation} />
          <Button title="Cancel" onPress={() => setConfirmModalVisible(false)} />
        </View>
      </Modal>
      

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
