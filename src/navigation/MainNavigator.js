/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { Image, StyleSheet } from 'react-native';
import ChatScreen from '../screens/AccountScreen';
import OrderScreen from '../screens/OrderScreen';
import AccountScreen from '../screens/AccountScreen';
import TrasRelax from '../screens/FastRelax/ChoiceScreen';
import TrasFood from '../screens/FastFood/ChoiceScreen';
import TrasRent from '../screens/FastRent/ChoiceScreen';
import TrasRide from '../screens/FastRide/ChoiceScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={MainNavigator} />
    <Stack.Screen name="TrasRide" component={TrasRide} options={{
      title: 'Trasride',
      headerStyle: { 
        backgroundColor: '#37AFE1', 
        elevation: 0, // Menghilangkan shadow di Android
        shadowOpacity: 0, // Menghilangkan shadow di iOS
        alignItems: 'center',
      },
      headerTitleAlign: 'center',
      headerTintColor: '#fff',
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: 'normal',fontFamily:'Montserrat-Regular' },
      headerShown: true,
    }} />
    <Stack.Screen name="TrasRent" component={TrasRent} options={{
      title: 'Trasrent',
      headerStyle: { 
        backgroundColor: '#37AFE1', 
        elevation: 0, // Menghilangkan shadow di Android
        shadowOpacity: 0, // Menghilangkan shadow di iOS
        alignItems: 'center',
      },
      headerTitleAlign: 'center',
      headerTintColor: '#fff',
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: 'normal',fontFamily:'Montserrat-Regular' },
      headerShown: true,
    }} />
    <Stack.Screen name="TrasFood" component={TrasFood} options={{
      title: 'Trasfood',
      headerStyle: { 
        backgroundColor: '#37AFE1', 
        elevation: 0, // Menghilangkan shadow di Android
        shadowOpacity: 0, // Menghilangkan shadow di iOS
        alignItems: 'center',
      },
      headerTitleAlign: 'center',
      headerTintColor: '#fff',
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: 'normal',fontFamily:'Montserrat-Regular' },
      headerShown: true,
    }} />
    <Stack.Screen name="TrasRelax" component={TrasRelax} options={{
      title: 'Trasrelax',
      headerStyle: { 
        backgroundColor: '#37AFE1', 
        elevation: 0, // Menghilangkan shadow di Android
        shadowOpacity: 0, // Menghilangkan shadow di iOS
        alignItems: 'center',
      },
      headerTitleAlign: 'center',
      headerTintColor: '#fff',
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: 'normal',fontFamily:'Montserrat-Regular' },
      headerShown: true,
    }} />
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
    <Tab.Screen
      name="Order"
      component={OrderScreen}
      options={{
        tile: 'Home Page',
        headerShown: false,
        color: '#fff',
        fontFamily:'Montserrat-Regular',
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
        fontFamily:'Montserrat-Regular',
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
