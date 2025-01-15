import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../config/firebaseConfig';

GoogleSignin.configure({
  webClientId: '831730691096-hsuqs4noja9rc5r3c0sbj050q5st4pmq.apps.googleusercontent.com', // Replace with your web client ID from Firebase
});

const LoginScreen = () => {
  const [user, setUser] = useState(null);

  const signInWithGoogle = async () => {
    try {
      // Initiate Google sign-in
      const signInResult = await GoogleSignin.signIn();

      // Try the new style of google-sign in result, from v13+ of that module
      const idToken = signInResult.data?.idToken;

      // Create a Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      setUser(userCredential.user);
      // Alert.alert('Success', `Welcome ${userCredential.user}!`);
    } catch (error) {
      console.log(error);
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
      <Text style={styles.title}>Login with Google</Text>
      {!user ? (
        <Button title="Sign in with Google" onPress={signInWithGoogle} />
      ) : (
        <>
          <Text style={styles.text}>Welcome, {user.displayName}</Text>
          <Button title="Sign Out" onPress={signOut} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

export default LoginScreen;
