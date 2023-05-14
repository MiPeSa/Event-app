import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList, Alert } from 'react-native';
import { Button, ListItem, Icon } from '@rneui/themed';
import { API_KEY, FB_KEY } from '@env';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: FB_KEY,
  authDomain: "events-72243.firebaseapp.com",
  databaseURL: "https://events-72243-default-rtdb.firebaseio.com",
  projectId: "events-72243",
  storageBucket: "events-72243.appspot.com",
  messagingSenderId: "560018615703",
  appId: "1:560018615703:web:41d8b41a3f1e50d794e8d2"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function HomePage({ navigation }) {

  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [eventMap, setEventMap] = useState('');

  useEffect(() => {
    const apiUrl = "https://www.mapquestapi.com/staticmap/v5/map?";
    const key = API_KEY;
    const size = '600,400@2x';
    const addresses = events.map((event) => event.address).join('||');
    const url = `${apiUrl}locations=${addresses}&size=${size}&key=${key}`;
  
    fetch(url)
      .then(response => response.url)
      .then(responseURL => {
        setEventMap(responseURL);
      })
      .catch(error => {
        console.error(error);
      });
  }, [events]);

  useEffect(() => {
    const itemsRef = ref(database, 'events/');
    onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    const items = data ? Object.keys(data).map(key => ({key, ...data[key]})) : [];
    setEvents(items);
    })
  }, []);

  const renderItem = ({item}) => (
    <View>
      <ListItem.Swipeable 
          leftContent={() => (
            <Button 
              title="Delete"
              onPress={() => deleteItem(item.key)}
              icon={{ name: 'delete', color: 'white' }}
              buttonStyle={{minHeight: '100%', backgroundColor: 'red' }}
            />
          )}
          rightContent={() => (
            <Button 
              title="Add to your events"
              onPress={() => addItem(item.key)}
              icon={{ name: 'add', color: 'white' }}
              buttonStyle={{minHeight: '100%', backgroundColor: 'black' }}
            />
          )}
        >
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
          <ListItem.Subtitle>{item.address}</ListItem.Subtitle>
          <ListItem.Subtitle>{item.date}</ListItem.Subtitle>          
          <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        </ListItem.Content>      
        </ListItem.Swipeable>
    </View>
  ); 

  const deleteItem = (key) => {
    remove(ref(database, '/events/' + key))  
  };

  const addItem = (key) => {
    const item = events.find((event) => event.key === key);
    if (item && !userEvents.some((event) => event.key === key)) {
      setUserEvents((prevEvents) => [...prevEvents, item]);
      Alert.alert('Event has been added to your list!');
    }
    else {
      Alert.alert('Ooops... This event is already in your list.');
    }
  };

  const handleNavigation = () => {
    navigation.navigate('Your Events', { userEvents: userEvents });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="hidden" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Button
            title="Add new Event"
            onPress={() => navigation.navigate('Add new event')}
            buttonStyle={{ backgroundColor: 'darkgrey' }}
            icon={<Icon name="event" color="white" />}
          />
          <Button
            title="Go to your events"
            onPress={() => handleNavigation()}
            buttonStyle={{ backgroundColor: 'darkgrey' }}
            icon={<Icon name="arrow-right" color="white" />}
          />
      </View>
        <View style={{ width: '100%', height: 200 }}>
          <Image
            style={{ width: '100%', height: '100%' }}
            source={{ uri: eventMap }}
          />
        </View>    
          <FlatList 
            keyExtractor={item => item.key} 
            renderItem={renderItem} 
            data={events} 
        /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonStyle: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 10,
  }
});
