import { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Button, ListItem, } from '@rneui/themed';
import { API_KEY, } from '@env';
import MapView, { Marker, Polyline, } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Calendar from 'expo-calendar';

export default function MyEventsPage({ route }) {

    const [currentLocation, setCurrentLocation] = useState(null);
    const [marker, setMarker] = useState(null);
    const [eventDestination, setEventDestination] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState();
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    const { userEvents } = route.params;

    useEffect(() => {
      setEvents(userEvents);
      requestUserLocationPermission();
    }, []);

    const requestUserLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          Alert.alert('No permission to get location');
          return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const currentLat = currentLocation.coords.latitude;
      const currentLng = currentLocation.coords.longitude;
      setCurrentLocation({ latitude: currentLat, longitude: currentLng, latitudeDelta: 0.0322, longitudeDelta: 0.0221 });
      setMarker({ latitude: currentLat, longitude: currentLng });
  };

    const renderItem = ({ item }) => (
      <ListItem.Swipeable
        leftContent={() => (
        <Button
          title="Event done"
          onPress={() => deleteItem(item.key)}
          icon={{ name: 'check', color: 'white' }}
          buttonStyle={{ minHeight: '100%', backgroundColor: 'black' }}
        />
        )}
      >
      <ListItem.Content>
      <ListItem.Title>{item.name}</ListItem.Title>
      <ListItem.Subtitle>{item.address}</ListItem.Subtitle>
      <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
      <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
      <Button 
        title="Show route to event" 
        onPress={() => handleShowRouteToEvent(item, item.name)} 
      />
      <Button
        title="Add to Calendar"
        onPress={() => {
          setSelectedEvent(item);
          addToCalendar(item);
        }}
        disabled={!selectedEvent || selectedEvent.key !== item.key}
      />                    
      </ListItem.Content>
      </ListItem.Swipeable>
    );

    const deleteItem = (key) => {
      const filteredEvents = userEvents.filter((event) => event.key !== key);
      setEvents(filteredEvents);
    };

    const handleShowRouteToEvent = async (event, eventName) => {
      const address = event.address.replace(/\s+/g, '+');
      const url = `http://www.mapquestapi.com/directions/v2/route?key=${API_KEY}&from=${currentLocation.latitude},${currentLocation.longitude}&to=${address}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.route.legs.length > 0) {
          const points = data.route.legs[0].maneuvers.map((maneuver) => {
            return {
              latitude: maneuver.startPoint.lat,
              longitude: maneuver.startPoint.lng,
            };
          });
          setRouteCoordinates(points);
          setEventDestination(points[points.length - 1]);
          setSelectedEvent(event);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleMarkerPress = (event) => {
      setEventDestination({
        latitude: event.nativeEvent.coordinate.latitude,
        longitude: event.nativeEvent.coordinate.longitude,
      });
    };

    const addToCalendar = async (event) => {
      try {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
          const eventDetails = {
            title: event.name,
            startDate: new Date(event.date),
            endDate: new Date(event.date),
            location: event.address,
            timeZone: 'Europe/Helsinki',
            AllDay: true,
          };
          const calendarId = await Calendar.getDefaultCalendarAsync();
          await Calendar.createEventAsync(calendarId.id, eventDetails);
          Alert.alert('Event added to your calendar!');
        } else {
          Alert.alert('No permission to access calendar');
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <MapView style={styles.mapStyle} initialRegion={currentLocation}>
              {eventDestination && (
                <>
                  <Marker coordinate={eventDestination} title="Event Destination" />
                  {routeCoordinates.length > 0 && (
                    <Polyline coordinates={routeCoordinates} strokeColor="black" strokeWidth={2} />
                  )}
                </>
        )}
        <Marker
          coordinate={currentLocation}
          title="Your Current Location"
          onPress={handleMarkerPress}
        />
      </MapView>
            </View>
            <View style={{flex: 1}}>
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.key}
                    renderItem={renderItem}
                />
            </View>            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    mapStyle: {
      flex: 1, 
      width: '100%'
    },
});