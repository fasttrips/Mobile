/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/home/HomeScreen';
import TrasrideScreen from '../screen/feature/trasride/MainScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrasfoodScreen from '../screen/feature/trasfood/MainScreen';
import TrasrentScreen from '../screen/feature/trasrent/MainScreen';
import TrasmoveScreen from '../screen/feature/trasmove/MainScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={MainNavigator} options={{ title: 'Home', headerShown: false }}/>
    <Stack.Screen
        name="TrasRide"
        component={TrasrideScreen}
        options={({ navigation }) => ({
          title: 'TrasRide',
          headerShown: false,
          headerStyle: {
            elevation: 0, // Remove elevation on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={32} color="black" style={{marginRight:20}}/>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="TrasFood"
        component={TrasfoodScreen}
        options={({ navigation }) => ({
          title: 'TrasFood',
          headerShown: true,
          headerStyle: {
            elevation: 0, // Remove elevation on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={32} color="black" style={{marginRight:20}}/>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="TrasRent"
        component={TrasrentScreen}
        options={({ navigation }) => ({
          title: 'TrasRent',
          headerShown: true,
          headerStyle: {
            elevation: 0, // Remove elevation on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={32} color="black" style={{marginRight:20}}/>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="TrasMove"
        component={TrasmoveScreen}
        options={({ navigation }) => ({
          title: 'TrasMove',
          headerShown: true,
          headerStyle: {
            elevation: 0, // Remove elevation on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={32} color="black" style={{marginRight:20}}/>
            </TouchableOpacity>
          ),
        })}
      />
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
              source={require('../assets/logo.png')}  // Local image
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
