import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import EventListScreen from './screens/EventListScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import AddEventScreen from './screens/AddEventScreen';
import EditEventScreen from './screens/EditEventScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="EventList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A90E2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="EventList" 
        component={EventListScreen} 
        options={{ headerShown: false }} // Hidden because we built a custom gradient header
      />
      <Stack.Screen 
        name="EventDetail" 
        component={EventDetailScreen} 
        options={{ title: 'Event Details' }} 
      />
      <Stack.Screen 
        name="AddEvent" 
        component={AddEventScreen} 
        options={{ title: 'Create New Event' }} 
      />
      <Stack.Screen 
        name="EditEvent" 
        component={EditEventScreen} 
        options={{ title: 'Edit Event' }} 
      />
    </Stack.Navigator>
  );
}
