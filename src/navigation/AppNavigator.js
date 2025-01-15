import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native';

const AppNavigator = () => {
  const isLoggedIn = true;
  return (
    // <SafeAreaView>
      <NavigationContainer>
        {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    // </SafeAreaView>
  );
};

export default AppNavigator;
