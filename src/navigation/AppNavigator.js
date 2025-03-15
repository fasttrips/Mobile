/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';


const AppNavigator = () => {

  const [isLoggedIn, setisLoggedIn] = useState(false);

  // async function onAuthStateChanged() {
  //   const user = await AsyncStorage.getItem('uid');
  //   if (user !== null) {
  //     setisLoggedIn(true);
  //   } else {
  //     setisLoggedIn(false);
  //   }
  // }

  // useEffect(() => {
  //   setInterval(onAuthStateChanged, 500);
  // }, []);

  return (
    // <SafeAreaView>
      <NavigationContainer>
        {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    // </SafeAreaView>
  );
};

export default AppNavigator;
