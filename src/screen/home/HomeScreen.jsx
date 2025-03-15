import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#37AFE1" barStyle="light-content" />
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#37AFE1',
   justifyContent: 'center',
   alignItems: 'center'
 }
});

export default HomeScreen;
