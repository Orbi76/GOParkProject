// Navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from './App'; // Your main map screen
import DirectionsScreen from './DirectionsScreen'; // Screen to show directions

export type RootStackParamList = {
    Home: undefined;
    Directions: { 
        origin: { latitude: number; longitude: number }; 
        destination: { id: string; name: string; latitude: number; longitude: number }; 
    };   

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={App} />
        <Stack.Screen name="Directions" component={DirectionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};