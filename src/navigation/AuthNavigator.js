import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screen/auth/LoginScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login', headerShown: false }}
        />
      </Stack.Navigator>
  );
}
