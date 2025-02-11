import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, Alert, PermissionsAndroid, Platform, Modal, Pressable } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import Geocoder from 'react-native-geocoding';
import axios from 'axios';
import { dispatchCommand } from 'react-native-reanimated';

const GOOGLE_API_KEY = 'AIzaSyBpcZDAU9DmCZqBGwpHpGxw7mcGq7Q75D8'; // Ganti dengan API Key Anda

const { width, height } = Dimensions.get('window');


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

  const [distance, setDistance] = useState(null);  // Menyimpan jarak
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);


  const [from, setfrom] = useState('Pilih Penjemputan');
  const [destination, setdestination] = useState('Pilih Pengantaran');

  const maxLength = 30;
  const truncatedFromText = from.length > maxLength ? from.substring(0, maxLength) + "..." : from;
  const truncatedDesText = destination.length > maxLength ? destination.substring(0, maxLength) + "..." : destination;
  const [coordinates, setCoordinates] = useState([]);

  const [location, setLocation] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const [modalDesVisible, setModalDesVisible] = useState(false);

  const [region, setRegion] = useState({
    latitude: 1.047237, // Default: Jakarta
    longitude: 103.992613,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [regionPick, setRegionPick] = useState({
    latitude: 1.047237, // Default: Jakarta
    longitude: 103.992613,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [regionDes, setRegionDes] = useState({
    latitude: 1.047237, // Default: Jakarta
    longitude: 103.992613,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [pickupLocation, setPickupLocation] = useState({
    latitude: 1.047237,
    longitude: 103.992613,
  });

  const [destinationLocation, setDestinationLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

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
        setPickupLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setDestinationLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        getLocationName({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setRegionPick({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        setLoading(false)
      },
      (error) => {
        Alert.alert('Error', `Unable to get location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  Geocoder.init('AIzaSyBpcZDAU9DmCZqBGwpHpGxw7mcGq7Q75D8');


  const getLocationName = (latitude, longitude) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        const address = json.results[0].formatted_address;
        setfrom(address); // Menyimpan alamat ke state
      })
      .catch(error => console.warn(error));
  };

  const getLocationDesName = (latitude, longitude) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        const address = json.results[0].formatted_address;
        setdestination(address); // Menyimpan alamat ke state
      })
      .catch(error => console.warn(error));
  };

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0;
    let len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 0x01) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 0x01) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    return points;
  };

  const fetchRoute = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${pickupLocation.latitude},${pickupLocation.longitude}&destination=${destinationLocation.latitude},${destinationLocation.longitude}&key=${GOOGLE_API_KEY}`
      );

      const points = response.data.routes[0].overview_polyline.points;
      const decodedPoints = decodePolyline(points);
      setCoordinates(decodedPoints);

      // Mendapatkan jarak dan durasi perjalanan
      const distanceText = response.data.routes[0].legs[0].distance.text;
      const durationText = response.data.routes[0].legs[0].duration.text;

      setDistance(distanceText);  // Menyimpan jarak
      setDuration(durationText);  // Menyimpan durasi
    } catch (error) {
      console.error("Error fetching route: ", error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    // getLocationName({ latitude: pickupLocation.latitude, longitude: pickupLocation.longitude });
  }, []);

  const handleLocationPickup = (data, details) => {
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      setRegionPick({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setPickupLocation({ latitude: lat, longitude: lng });
      setfrom(data.description)

      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleLocationDestination = (data, details) => {
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      setRegionDes({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setDestinationLocation({ latitude: lat, longitude: lng });
      setdestination(data.description)

      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleRegionDestinationComplete = (newRegion) => {
    setDestinationLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  };



  const handleRegionFromComplete = (newRegion) => {
    setPickupLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  };

  const mapRef = useRef(null);

  if(loading)
  {
    return(
      <View style={styles.containerloading}>
        <Text>Sedang Menentukan Lokasi</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
        <View style={styles.backgroundChoice}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={{ width: width - 40, marginBottom: 5, flexDirection: 'row' }}>
              <Image
                source={require('../../asset/from.png')}  // Local image
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text>{truncatedFromText}</Text>
            </View>
          </TouchableOpacity>
          <View style={{ width: width - 80, height: 1, backgroundColor: '#00000020', marginBottom: 10, marginTop: 10 }} />
          <TouchableOpacity onPress={() => setModalDesVisible(true)}>
            <View style={{ width: width - 40, marginBottom: 5, flexDirection: 'row' }}>
              <Image
                source={require('../../asset/des.png')}  // Local image
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text>{truncatedDesText}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ margin: 10 }} />
        {
          destination !== "Pilih Pengantaran" &&
          <>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: pickupLocation.latitude,
                longitude: pickupLocation.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            >
              <Marker coordinate={pickupLocation} pinColor='red' />
              <Marker coordinate={destinationLocation} pinColor='green' />
              <Polyline
                coordinates={coordinates}
                strokeColor="#37AFE1"   // Warna garis
                strokeWidth={4}      // Ketebalan garis
              />
            </MapView>
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
            <Text style={styles.textPayment}>{distance} {duration}</Text>
            <View style={{ margin: 10 }} />
          </>
        }
        {
          destination === "Pilih Pengantaran" &&
          <>
            <View
              style={styles.map}
            >
            </View>
            <View
              style={{ width: width, alignItems: 'center', justifyContent: 'center', padding: 150 }}
            >
            </View>
          </>
        }

      </View>
      {
        destination !== "Pilih Pengantaran" &&
        <View style={{ backgroundColor: '#37AFE110', width: width, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <TouchableOpacity style={styles.buttonPayment}>
            <View>
              <Text style={styles.textPayment}>Tunai </Text>
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
      }

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <GooglePlacesAutocomplete
              placeholder={truncatedFromText}
              fetchDetails={true}
              onPress={handleLocationPickup}
              query={{
                key: GOOGLE_API_KEY,
                language: 'id', // Bahasa Indonesia
              }}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.textInput,
              }}
            />
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{ width: width, height: height, borderRadius: 20 }}
              region={{
                latitude: regionPick.latitude,
                longitude: regionPick.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
              onRegionChangeComplete={handleRegionFromComplete}
            >
              <Marker coordinate={pickupLocation} />
            </MapView>
            <TouchableOpacity style={{ width: width, padding: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
              <Image
                source={require('../../asset/from.png')}  // Local image
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text>
                Pilih Lewat Peta
              </Text>
            </TouchableOpacity>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { setModalVisible(!modalVisible); getLocationName({ latitude: pickupLocation.latitude, longitude: pickupLocation.longitude }); fetchRoute() }}>
              <Text style={styles.textStyle}>Kembali</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDesVisible}
        onRequestClose={() => {
          setModalDesVisible(!modalDesVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <GooglePlacesAutocomplete
              placeholder={truncatedDesText}
              fetchDetails={true}
              onPress={handleLocationDestination}
              query={{
                key: GOOGLE_API_KEY,
                language: 'id', // Bahasa Indonesia
              }}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.textInput,
              }}
            />
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{ width: width, height: height, borderRadius: 20 }}
              region={{
                latitude: regionDes.latitude,
                longitude: regionDes.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
              onRegionChangeComplete={handleRegionDestinationComplete}
            >
              <Marker coordinate={destinationLocation} />
            </MapView>
            <TouchableOpacity style={{ width: width, padding: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
              <Image
                source={require('../../asset/from.png')}  // Local image
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text>
                Pilih Lewat Peta
              </Text>
            </TouchableOpacity>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { setModalDesVisible(!modalDesVisible); getLocationDesName({ latitude: destinationLocation.latitude, longitude: destinationLocation.longitude }); fetchRoute() }}>
              <Text style={styles.textStyle}>Kembali</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  containerloading: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent:'center'
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000090'
  },
  modalView: {
    width: width,
    height: height,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
    width: width - 40
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    width: width - 40,
    zIndex: 1,
    position: 'absolute',
    marginTop: height - 80
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  autocompleteContainer: {
    width: width - 40,
    zIndex: 9999,
    position: 'absolute'
  },
  textInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginTop: 30,
    borderRadius: 10, borderColor: 'red', borderWidth: 1
  },

});

export default ChoiceScreen;
