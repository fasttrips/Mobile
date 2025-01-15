/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { auth } from '../config/firebaseConfig';

const AppNavigator = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isLoggedIn, setisLoggedIn] = useState(false);


  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {setInitializing(false);}
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    if(user)
    {
      setisLoggedIn(true);
    }else{
      setisLoggedIn(false);
    }
    return subscriber;
  }, [onAuthStateChanged, user]);

  return (
    // <SafeAreaView>
      <NavigationContainer>
        {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    // </SafeAreaView>
  );
};

export default AppNavigator;
