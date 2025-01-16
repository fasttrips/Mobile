import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, Alert, PermissionsAndroid, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const { width } = Dimensions.get('window');

const mapDUmmy = [
  {
    image: <Image
      source={require('../../asset/car.png')}  // Local image
      style={{ width: 50, height: 50 }}
    />,
    name: 'Mobil',
  },
  {
    image: <Image
      source={require('../../asset/helmet.png')}  // Local image
      style={{ width: 50, height: 50 }}
    />,
    name: 'Motor',
  },
];


const ChoiceScreen = () => {

  const [latitudeFrom, setlatitudeFrom] = useState(0);
  const [longitudeFrom, setlongitudeFrom] = useState(0);

  const [latitudeTo, setlatitudeTo] = useState(0);
  const [longitudeTo, setlongitudeTo] = useState(0);

  const [from, setfrom] = useState('Pilih Penjemputan');
  const [destination, setdestination] = useState('Pilih Pengantaran');

  const [location, setLocation] = useState(null);

  // Request permissions on Android
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handles this automatically
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setlatitudeFrom(position.coords.latitude);
        setlongitudeFrom(position.coords.longitude);
      },
      (error) => {
        Alert.alert('Error', `Unable to get location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
        <View style={styles.backgroundChoice}>
          <TouchableOpacity>
            <View style={{ width: width - 40, marginBottom: 5, flexDirection: 'row' }}>
              <Image
                source={require('../../asset/from.png')}  // Local image
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text>{from}</Text>
            </View>
          </TouchableOpacity>
          <View style={{ width: width - 80, height: 1, backgroundColor: '#00000020', marginBottom: 10, marginTop: 10 }} />
          <TouchableOpacity>
            <View style={{ width: width - 40, marginBottom: 5, flexDirection: 'row' }}>
              <Image
                source={require('../../asset/des.png')}  // Local image
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text>{destination}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ margin: 10 }} />
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: latitudeFrom,
            longitude: longitudeFrom,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        />
        <View style={{ margin: 10 }} />
        <View style={{ width: 30, height: 1, backgroundColor: 'black' }} />
        <View style={{ flex: 3, width: width - 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          {mapDUmmy.map((data, index) => {
            return (
              <TouchableOpacity key={index} style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, width: 100, height: 100, backgroundColor: '#37AFE110', borderRadius: 10, borderColor: '#37AFE1', borderWidth: 1 }}>
                {data.image}
                <Text style={{ fontSize: 10 }}>{data.name}</Text>
                <Text>Rp 25.000</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={{ backgroundColor: '#37AFE110', width: width, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <TouchableOpacity style={styles.buttonPayment}>
          <View>
            <Text style={styles.textPayment}>Tunai</Text>
            <Text style={styles.textPayment2}>Saldo : Rp 8.500</Text>
          </View>
          <Text style={styles.textPayment}>IDR 25.000</Text>
        </TouchableOpacity>
        <View style={{ margin: 5 }} />
        <TouchableOpacity style={styles.buttonConfirm}>
          <Text style={styles.textButton}>Pesan Sekarang</Text>
        </TouchableOpacity>
        <View style={{ margin: 5 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  backgroundChoice: {
    flex: 1,
    backgroundColor: 'white',
    elevation: 4,
    width: width - 40,
    height: 100,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    margin: 1,
  },
  buttonConfirm: { width: width - 40, height: 50, backgroundColor: '#37AFE1', justifyContent: 'center', alignItems: 'center', borderRadius: 20, elevation: 1 },
  textButton: { color: 'white', fontWeight: 'bold' },
  containerMaps: {
    height: 200,
    width: width,
    borderRadius: 20,
  },
  map: {
    flex: 6,
    width: width - 40,
    borderRadius: 20,
  },
  buttonPayment: {
    width: width - 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  textPayment: { color: 'black', fontWeight: 'bold' },
  textPayment2: { color: 'red', fontWeight: '200' },

});

export default ChoiceScreen;
