import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';
import MyEvents from '../screens/MyEvents';
import Participations from '../screens/Participations';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MyEvents" component={MyEvents} />
        <Stack.Screen name="Participations" component={Participations} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
