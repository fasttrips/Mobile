/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { Image, StyleSheet } from 'react-native';
import ChatScreen from '../screens/AccountScreen';
import OrderScreen from '../screens/OrderScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

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
        tabBarIcon: ({ focused }) => {
          const size = focused ? 25 : 20;
          return (
            <Image
              source={require('../asset/fast.png')}  // Local image
              style={{ width: size, height: size }}
            />
          );
        },
      }}
    />
    <Tab.Screen
      name="Order"
      component={OrderScreen}
      options={{
        tile: 'Home Page',
        headerShown: false,
        color: '#fff',
        tabBarIcon: ({ focused }) => {
          const size = focused ? 25 : 20;
          return (
            <Image
              source={require('../asset/order.png')}  // Local image
              style={{ width: size, height: size }}
            />
          );
        },
      }}
    />
    <Tab.Screen
      name="Akun"
      component={AccountScreen}
      options={{
        tile: 'Home Page',
        headerShown: false,
        color: '#fff',
        tabBarIcon: ({ focused }) => {
          const size = focused ? 25 : 20;
          return (
            <Image
              source={require('../asset/account.png')}  // Local image
              style={{ width: size, height: size }}
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
    position: 'absolute', // Make it floating
    left: 20, // Adjust the distance from the left
    right: 20, // Adjust the distance from the right
    elevation: 5, // Add shadow for Android
    backgroundColor: '#FFF', // Background color
    borderRadius: 20, // Rounded corners
    height: 60, // Height of the tab bar
    margin: 30,
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowOffset: { width: 0, height: 10 }, // Shadow offset for iOS
    shadowRadius: 10, // Shadow blur for iOS
    justifyContent: 'space-between', // Center the tab bar content vertically
    alignItems: 'center', // Center the tab bar content horizontally
  },
  image: {
    width: 30, // Specify width
    height: 30, // Specify height
  },
  tabBarIconStyle: {
    justifyContent: 'center',  // Center the icon vertically within the tab
    alignItems: 'center',  // Center the icon horizontally within the tab
  },
});

export default MainNavigator;
