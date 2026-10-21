import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import ResultsScreen from '../screens/ResultsScreen';
import DetailScreen from '../screens/DetailScreen';
import BookingScreen from '../screens/BookingScreen';
import SuccessScreen from '../screens/SuccessScreen';
import InspectionScreen from '../screens/InspectionScreen';
import LocationScreen from '../screens/LocationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {}
      <Stack.Screen name="Login" component={LoginScreen} />

      {}
      <Stack.Screen name="MainTabs" component={TabNavigator} />

      {}
      <Stack.Screen name="Results" component={ResultsScreen} />

      {}
      <Stack.Screen name="Detail" component={DetailScreen} />

      {}
      <Stack.Screen name="Booking" component={BookingScreen} />

      {}
      <Stack.Screen name="Success" component={SuccessScreen} />

      {}
      <Stack.Screen name="Inspection" component={InspectionScreen} />

      {}
      <Stack.Screen name="Location" component={LocationScreen} />
    </Stack.Navigator>
  );
}
