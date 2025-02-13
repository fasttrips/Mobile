import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, Image, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../config/firebaseConfig';

const { width } = Dimensions.get('window');


GoogleSignin.configure({
  webClientId: '831730691096-hsuqs4noja9rc5r3c0sbj050q5st4pmq.apps.googleusercontent.com', // Replace with your web client ID from Firebase
});

const LoginScreen = () => {
  const [user, setUser] = useState(null);

  const signInWithGoogle = async () => {
    try {
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      setUser(userCredential.user);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      setUser(null);
      Alert.alert('Logged Out', 'You have been logged out.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#37AFE1" barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Image
          source={require('../asset/logo.png')} // Ganti dengan path logo Anda
          style={styles.logo}
        />
        <Text style={styles.textDesc}>TRASGO</Text>
        <Text style={styles.textDesc2}>Easy, Cheap, and Comfortable for Everyone</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity  onPress={signInWithGoogle}>
        <View style={{ borderRadius: 20, width: width - 100, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
          <Text style={{fontFamily:'Montserrat-Regular',color:'#37AFE1'}}>Lanjutkan Dengan Google</Text>
        </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20, // Memberi ruang di atas dan bawah layar
    backgroundColor: '#37AFE1'
  },
  textDesc: {
    textAlign: 'center',
    fontSize: 20,
    fontStyle: 'bold',
    color: 'white',
    fontFamily:'Montserrat-Bold'
  },
  textDesc2: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'normal',
    color: 'white',
    fontFamily:'Montserrat-Regular'
  },
  logoContainer: {
    flexGrow: 1, // Membuat logo tetap di tengah
    justifyContent: 'center',
    alignItems:"center"
  },
  logo: {
    width: width/2,
    height: width/2
  },
  buttonContainer: {
    width: '100%', // Tombol memenuhi lebar layar
    paddingHorizontal: 20, // Jarak dari sisi layar
    marginBottom: 20, // Jarak dari bawah layar
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default LoginScreen;
