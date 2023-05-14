import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity  } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, push } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { FB_KEY } from '@env';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

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

export default function CreateNewEventPage() {

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState('');
  
    const navigation = useNavigation();

    const saveEvent = () => {
      const formattedDate = new Date(date);
      const formattedDateString = formattedDate.toISOString().slice(0, 10); 
      console.log('saveEvent', { name, date: formattedDateString, address, description })
      push(
        ref(database, 'events/'),
        { 'name': name, 'address': address, 'description': description, 'date': formattedDateString }
      ).then(() => {
        navigation.navigate('Home Page');
      });
    }

    const showDateTimePicker = () => {
      setShowDatePicker(true);
    }

    const hideDateTimePicker = () => {
      setShowDatePicker(false);
    };

    const handleDateSelect = (selectedDate) => {
      if (selectedDate) {
        setSelectedDate(selectedDate);
        setFormattedDate(
          `${selectedDate.toLocaleString('default', { month: 'long' })} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
        );
        setDate(selectedDate.toISOString().slice(0, 10));
      }
      hideDateTimePicker();
    };

    return (
        <SafeAreaView>
            <Input
              style={styles.input}
              onChangeText={(name) => setName(name)}
              value={name}
              placeholder="Events name"
            />
            <Input
              style={styles.input}
              onChangeText={(address) => setAddress(address)}
              value={address}
              placeholder="Set Address here"
            />
            <TouchableOpacity
              style={styles.dateButtonStyle}
              onPress={showDateTimePicker}
            >
              <Text style={styles.dateButtonText}>
                {formattedDate || 'Select date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode={'date'}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateSelect}
                minimumDate={new Date('2023-01-01')}
                maximumDate={new Date('2025-01-01')}
              />
            )}
        
            <Input 
              style={styles.additionalInformationStyle}
              editable
              maxLength={50}
              onChangeText={(description) => setDescription(description)}
              value={description}
              placeholder="Write additional information here"
            />
            <View style={styles.buttonStyle}>
              <Button raised icon={{name: 'save', color:"white"}} onPress={saveEvent} title="SAVE" color="black" backgroundColor="white" /> 
            </View>
        </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 10,
      padding: 10,
    },
    dateTimePickerStyle: {
      width: '100%',
      marginTop: 10,
      marginBottom: 20
    },
    additionalInformationStyle: {
      padding: 10,
      marginTop: 10
    },
    buttonStyle: {
      width: 100,
      alignSelf: 'center',
      marginTop: 20,
      borderRadius: 10,
    },
    buttonDateStyle: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 10,
    },
    dateButtonStyle: {
      backgroundColor: 'lightgrey',
      borderRadius: 10,
      padding: 15,
      width: 200,
      alignItems: 'center',
      justifyContent: 'center'
    },

  });
