import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../config/firebaseConfig';

GoogleSignin.configure({
  webClientId: '831730691096-hsuqs4noja9rc5r3c0sbj050q5st4pmq.apps.googleusercontent.com', // Replace with your web client ID from Firebase
});

const AccountScreen = () => {

  const signOut = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      Alert.alert('Logged Out', 'You have been logged out.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default AccountScreen;
