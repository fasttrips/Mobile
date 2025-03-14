/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/home/HomeScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={MainNavigator} />
  </Stack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator screenOptions={{
    tabBarStyle: styles.tabBarStyle, // Custom tab bar style
    tabBarShowLabel: true, // Hide labels (optional)
    tabBarActiveTintColor: '#000000', // Active icon color
    tabBarInactiveTintColor: '#00000050', // Inactive icon color
  }}>
    <Tab.Screen
      name="Beranda"
      component={HomeScreen}
      options={{
        tile: 'Home Page',
        headerShown: false,
        color: '#fff',
        fontFamily:'Montserrat-Regular',
        tabBarIcon: ({ focused }) => {
          const size = focused ? 60 : 50;
          return (
            <Image
              source={require('../asset/logo.png')}  // Local image
              style={{ width: size, height: size, tintColor:'#37AFE1' }}
            />
          );
        },
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    height: 60,
  },
  image: {
    width: 30, // Specify width
    height: 30, // Specify height
  },
  tabBarIconStyle: {
    justifyContent: 'center',  // Center the icon vertically within the tab
    alignItems: 'center',  // Center the icon horizontally within the tab
    fontFamily:'Montserrat-Regular'
  },
});

export default HomeStack;
