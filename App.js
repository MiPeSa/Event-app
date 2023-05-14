import React from 'react';
import { StyleSheet, View, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import CreateNewEventPage from './CreateNewEventPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomePage from './HomePage';
import MyEventsPage from './MyEventsPage';


export default function App() {
  
  const Stack = createNativeStackNavigator();
  
  return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="HomePage">
          <Stack.Screen name="Home Page" component={HomePage} />
          <Stack.Screen name="Your Events" component={MyEventsPage} />
            <Stack.Screen name="Add new event" component={CreateNewEventPage} />
          </Stack.Navigator>
        </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
