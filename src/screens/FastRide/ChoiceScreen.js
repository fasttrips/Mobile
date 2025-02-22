import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, Alert, PermissionsAndroid, Platform, Modal, Pressable } from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import Geocoder from 'react-native-geocoding';
import axios from 'axios';
import { CommonActions, useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { getUser } from '../../api/functions';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

const GOOGLE_API_KEY = 'AIzaSyBpcZDAU9DmCZqBGwpHpGxw7mcGq7Q75D8'; // Ganti dengan API Key Anda

const { width, height } = Dimensions.get('window');

const VEHICLE_OPTIONS = [
  {
    image: <Image source={require('../../asset/helmet.png')} style={{ width: 50, height: 50 }} />,
    name: 'Motor',
  },
  {
    image: <Image source={require('../../asset/car.png')} style={{ width: 50, height: 50 }} />,
    name: 'Mobil',
  },
  {
    image: <Image source={require('../../asset/car.png')} style={{ width: 50, height: 50 }} />,
    name: 'Taxi',
  },
];

const ChoiceScreen = ({ navigation }) => {
  // const navigation = useNavigation();
  const [showCircle, setShowCircle] = useState(false);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('Cari lokasi asal');
  const [destination, setDestination] = useState('Cari lokasi tujuan');
  const [coordinates, setCoordinates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDesVisible, setModalDesVisible] = useState(false);
  const [regionPick, setRegionPick] = useState({
    latitude: 1.047237,
    longitude: 103.992613,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [regionDes, setRegionDes] = useState({
    latitude: 1.047237,
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
  const [hargaMotor, setHargaMotor] = useState(0);
  const [hargaMobil, setHargaMobil] = useState(0);
  const [hargaTaxi, setHargaTaxi] = useState(0);
  const [user, setUser] = useState(null);

  const [pilihan, setPilihan] = useState({
    harga: 0,
    type: "",
  });

  const mapRef = useRef(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setPickupLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setDestinationLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        getLocationName({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setRegionPick({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setRegionDes({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLoading(false);
      },
      (error) => {
        Alert.alert('Error', `Tidak dapat menentukan lokasi, pastikan GPS anda berfungsi dengan baik`);
        navigation.goBack();
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 10000 }
    );
  };

  Geocoder.init(GOOGLE_API_KEY);

  const getLocationName = (latitude, longitude) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        const address = json.results[0].formatted_address;
        setFrom(address);
      })
      .catch(error => console.warn(error));
  };

  const getLocationDesName = (latitude, longitude) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        const address = json.results[0].formatted_address;
        setDestination(address);
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

      const distanceText = response.data.routes[0].legs[0].distance.text;
      const durationText = response.data.routes[0].legs[0].duration.text;

      setDistance(distanceText);
      setDuration(durationText);
      hitungTarifGojek(1, (response.data.routes[0].legs[0].distance.value / 1000).toFixed(1));
      hitungTarifGocar(1, (response.data.routes[0].legs[0].distance.value / 1000).toFixed(1));
      hitungTarifTaksi('grabcar_taxi', (response.data.routes[0].legs[0].distance.value / 1000).toFixed(1), Math.round(response.data.routes[0].legs[0].duration.value / 60));
    } catch (error) {
      console.error("Error fetching route: ", error);
    }
  };

  const hitungTarifGojek = (zona, jarakKm) => {
    const tarif = {
      1: { bawah: 2000, atas: 2500, minimal: 12000 },
      2: { bawah: 2550, atas: 2800, minimal: 10200 },
      3: { bawah: 2100, atas: 2600, minimal: 7000 }
    };

    if (!tarif[zona]) {
      return "Zona tidak valid";
    }

    let tarifBawah = jarakKm * tarif[zona].bawah;
    let tarifAtas = jarakKm * tarif[zona].atas;

    tarifBawah = Math.max(tarifBawah, tarif[zona].minimal);
    tarifAtas = Math.max(tarifAtas, tarif[zona].minimal);
    setHargaMotor(tarifAtas);
  };

  const hitungTarifGocar = (zona, jarakKm) => {
    const tarif = {
      1: { bawah: 3400, atas: 4250, minimal: 25000 },
      2: { bawah: 3500, atas: 5000, minimal: 15000 },
      3: { bawah: 3100, atas: 3900, minimal: 10500 }
    };

    if (!tarif[zona]) {
      return "Zona tidak valid";
    }

    let tarifBawah = jarakKm * tarif[zona].bawah;
    let tarifAtas = jarakKm * tarif[zona].atas;

    tarifBawah = Math.max(tarifBawah, tarif[zona].minimal);
    tarifAtas = Math.max(tarifAtas, tarif[zona].minimal);
    setHargaMobil(tarifAtas);
  };

  const hitungTarifTaksi = (tipe, jarakKm, waktuMenit) => {
    const tarif = {
      "bluebird_reguler": { bukaPintu: 7000, perKm: 4500, perMenit: 500 },
      "bluebird_eksekutif": { bukaPintu: 15000, perKm: 7000, perMenit: 750 },
      "grabcar_taxi": { bukaPintu: 8000, perKm: 5400, perMenit: 500 }
    };

    if (!tarif[tipe]) {
      return "Tipe taksi tidak valid";
    }

    let totalTarif = tarif[tipe].bukaPintu + (jarakKm * tarif[tipe].perKm) + (waktuMenit * tarif[tipe].perMenit);
    setHargaTaxi(totalTarif);
  };

  const pushOrder = async () => {
    try {
      const getUsers = await getUser()
      setUser(getUsers)
      // Ambil FCM Token
      const fcmToken = await messaging().getToken();
      const orderRef = firestore().collection('order').doc();
      await orderRef.set({
        id: orderRef.id,
        idUser: getUsers.id,
        fcmUser: fcmToken,
        nameUser: getUsers.fullname,
        destination,
        from,
        pickupLocation,
        destinationLocation,
        duration,
        harga: parseFloat(pilihan.harga.replace(/\./g, "")),
        type: pilihan.type,
        coupon: "",
        fcmDriver: "",
        idDriver: "",
        status: 0,
        potonganDriver: pilihan.type === "Motor" ? 2000 : 3500,
        payment: "Tunai",
        createdAt: new Date(),
        updateAt: new Date(),
      });
      navigation.navigate('Home', { screen: 'Order' });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    getCurrentLocation();
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
      setFrom(data.description);

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
      setDestination(data.description);

      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  };

  const handleRegionDestinationComplete = (newRegion) => {
    setShowCircle(false);
    setDestinationLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  };

  const handleRegionDestinationChange = (newRegion) => {
    setShowCircle(true);
  };

  const handleRegionFromComplete = (newRegion) => {
    setShowCircle(false);
    setPickupLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    });
  };

  const handleRegionFromChange = (newRegion) => {
    setShowCircle(true);
  };

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <LottieView width={width - 100} height={width - 100} source={require('../../asset/animation/search.json')} autoPlay loop />
        <Text style={{ fontFamily: 'Montserrat-Regular' }}>Menentukan Lokasi Anda</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {destination === "Cari lokasi tujuan" && <View style={styles.backgroundDesign} />}
      <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
        <View style={styles.backgroundChoice}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={{ width: width - 40, marginBottom: 5, flexDirection: 'row' }}>
              <Image source={require('../../asset/from.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 13 }}>{from.length > 40 ? `${from.substring(0, 40)}...` : from}</Text>
            </View>
          </TouchableOpacity>
          <View style={{ width: width - 80, height: 1, backgroundColor: '#00000020', marginBottom: 10, marginTop: 10 }} />
          <TouchableOpacity onPress={() => setModalDesVisible(true)}>
            <View style={{ width: width - 40, marginBottom: 5, flexDirection: 'row' }}>
              <Image source={require('../../asset/des.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 13 }}>{destination.length > 40 ? `${destination.substring(0, 40)}...` : destination}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {destination === "Cari lokasi tujuan" && <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 13, color: '#fff', marginTop: 20 }}>Yuk cari lokasi tujuan kamu</Text>}
        <View style={{ margin: 10 }} />
        {destination !== "Cari lokasi tujuan" && (
          <>
            <MapView
              provider={PROVIDER_GOOGLE}
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
              <Polyline coordinates={coordinates} strokeColor="#37AFE1" strokeWidth={4} />
            </MapView>
            <View style={{ margin: 10 }} />
            <View style={{ width: 30, height: 1, backgroundColor: 'black' }} />
            <View style={{ flex: 3, width: width - 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              {VEHICLE_OPTIONS.map((data, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    const hargaChoice = () => {
                      switch (data.name) {
                        case "Motor":
                          return hargaMotor.toLocaleString("id-ID");
                        case "Mobil":
                          return hargaMobil.toLocaleString("id-ID");
                        case "Taxi":
                          return hargaTaxi.toLocaleString("id-ID");
                        default:
                          return 0;
                      }
                    };
                    setPilihan({
                      harga: hargaChoice(),
                      type: data.name
                    });
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    width: 100,
                    height: 100,
                    backgroundColor: pilihan.type === data.name ? '#37AFE110' : '#fff',
                    borderRadius: 10,
                    borderColor: pilihan.type === data.name ? '#37AFE1' : '#00000020',
                    borderWidth: 1,
                    fontFamily: 'Montserrat-Regular'
                  }}
                >
                  {data.image}
                  <Text style={{ fontSize: 10 }}>{data.name}</Text>
                  {data.name === "Motor" && <Text style={{ fontFamily: 'Montserrat-Regular' }}>Rp {hargaMotor.toLocaleString("id-ID")}</Text>}
                  {data.name === "Mobil" && <Text style={{ fontFamily: 'Montserrat-Regular' }}>Rp {hargaMobil.toLocaleString("id-ID")}</Text>}
                  {data.name === "Taxi" && <Text style={{ fontFamily: 'Montserrat-Regular' }}>Rp {hargaTaxi.toLocaleString("id-ID")}</Text>}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.textPayment}>{distance} {duration}</Text>
            <View style={{ margin: 10 }} />
          </>
        )}
        {destination === "Cari lokasi tujuan" && (
          <>
            <View style={styles.map} />
            <View style={{ width: width, alignItems: 'center', justifyContent: 'center', padding: 150 }} />
          </>
        )}
      </View>
      {destination !== "Cari lokasi tujuan" && (
        <View style={{ backgroundColor: '#37AFE110', width: width, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <TouchableOpacity style={styles.buttonPayment}>
            <View>
              <Text style={styles.textPayment}>Tunai </Text>
              {/* <Text style={styles.textPayment2}>Coin : Rp {user?.balance}</Text> */}
            </View>
            <Text style={styles.textPayment}>IDR {pilihan.harga}</Text>
          </TouchableOpacity>
          <View style={{ margin: 5 }} />
          <TouchableOpacity
            style={[styles.buttonConfirm, pilihan.type === "" && { backgroundColor: '#ccc' }]}
            disabled={pilihan.type === ""}
            onPress={() => pushOrder()}
          >
            <Text style={styles.textButton}>Pesan Sekarang</Text>
          </TouchableOpacity>
          <View style={{ margin: 5 }} />
        </View>
      )}
      {/* bagian asal  */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ width: width, height: height / 2, borderRadius: 20 }}
              region={{
                latitude: regionPick.latitude,
                longitude: regionPick.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
              onRegionChangeComplete={handleRegionFromComplete}
              onRegionChange={handleRegionFromChange}
            >
              {!showCircle && <Marker coordinate={pickupLocation} pinColor='red' />}
            </MapView>
            <GooglePlacesAutocomplete
              placeholder={from.length > 40 ? `${from.substring(0, 40)}...` : from}
              fetchDetails={true}
              keyboardShouldPersistTaps="always"
              onPress={handleLocationPickup}
              query={{
                key: GOOGLE_API_KEY,
                language: 'id',
              }}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.textInput,
              }}
            />
            {showCircle && <View style={styles.blueCircle} />}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { setModalVisible(!modalVisible); getLocationName({ latitude: pickupLocation.latitude, longitude: pickupLocation.longitude }); fetchRoute(); }}
            >
              <Text style={styles.textStyle}>Kembali</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalDesVisible}
        onRequestClose={() => setModalDesVisible(!modalDesVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ width: width, height: height / 2, borderRadius: 20 }}
              region={{
                latitude: regionDes.latitude,
                longitude: regionDes.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
              onRegionChangeComplete={handleRegionDestinationComplete}
              onRegionChange={handleRegionDestinationChange}
            >
              {!showCircle && <Marker coordinate={destinationLocation} pinColor='green' />}
            </MapView>
            <GooglePlacesAutocomplete
              placeholder={destination.length > 40 ? `${destination.substring(0, 40)}...` : destination}
              fetchDetails={true}
              onPress={handleLocationDestination}
              query={{
                key: GOOGLE_API_KEY,
                language: 'id',
              }}
              styles={{
                container: styles.autocompleteContainer,
                textInput: styles.textInput,
              }}
            />
            {showCircle && <View style={styles.blueCircle} />}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => { setModalDesVisible(!modalDesVisible); getLocationDesName({ latitude: destinationLocation.latitude, longitude: destinationLocation.longitude }); fetchRoute(); }}
            >
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
  containerLoading: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center'
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
  buttonConfirm: {
    width: width - 40,
    height: 50,
    backgroundColor: '#37AFE1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 1
  },
  textButton: {
    color: 'white',
    fontWeight: 'normal',
    fontFamily: 'Montserrat-Medium'
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
  textPayment: {
    color: 'black',
    fontFamily: 'Montserrat-Medium'
  },
  textPayment2: {
    color: 'red',
    fontWeight: '200',
    fontFamily: 'Montserrat-Regular'
  },
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
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#37AFE1',
    width: width - 40,
    zIndex: 1,
    position: 'absolute',
    marginTop: height - 80
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular'
  },
  autocompleteContainer: {
    width: width - 40,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginTop: 30,
    borderRadius: 10,
    borderColor: 'red',
    borderWidth: 1,
    fontFamily: 'Montserrat-Regular'
  },
  blueCircle: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    width: 10,
    height: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    transform: [{ translateX: -5 }, { translateY: -5 }],
  },
  backgroundDesign: {
    position: 'absolute',
    backgroundColor: '#37AFE1',
    width: width,
    height: 180,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default ChoiceScreen;