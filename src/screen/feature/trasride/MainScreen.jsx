import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { ModalSearch } from './component/SearchComponent';
import { ModalRideComponent } from './component/ListRideComponent';
import { ModalPaymentComponent } from './component/PaymentComponent';
import { ButtonComponent } from '../../../component/ButtonComponent';
import LottieView from 'lottie-react-native';
import { Motion } from '@legendapp/motion';

const options = [
    {
        label: 'TrasRide',
        value: 'TR',
        icon: require("../../../assets/trasride/motor.png"),
        time: '20 min',
        price: 15000,
        discount: 1000,
        desc: 'cepat sampai tujuan'
    },
    {
        label: 'TrasRide XL',
        value: 'TRX',
        icon: require("../../../assets/trasride/motorxl.png"),
        time: '20 min',
        price: 18000,
        discount: 0,
        desc: 'jok besar yang bikin nyaman'
    },
    {
        label: 'TrasCar',
        value: 'TC',
        icon: require("../../../assets/trasride/mobil.png"),
        time: '20 min',
        price: 24000,
        discount: 3000,
        desc: 'gak kehujanan hati senang'
    },
    {
        label: 'TrasCar XL',
        value: 'TCX',
        icon: require("../../../assets/trasride/mobilxl.png"),
        time: '20 min',
        price: 32000,
        discount: 0,
        desc: 'bisa muat banyak'
    }
];

const GOOGLE_API_KEY = 'AIzaSyDXQXYXToGvd4HQoP5XHYwwQBAbvnpaLNQ';
const { width, height } = Dimensions.get('window');

const TrasrideScreen = ({ navigation }) => {
    //param from home
    const mapRef = useRef(null);

    const [pickupLocation, setPickupLocation] = useState({
        latitude: 0,
        longitude: 0,
    });
    const [destinationLocation, setDestinationLocation] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [listPlace, setlistPlace] = useState([
        { label: 'Lokasi Kamu', value: '1', latitude: 0, longitude: 0 },
        { label: 'RS Ananda Tambun', value: 'a', latitude: -6.270965403411115, longitude: 107.0259369540338 },
        { label: 'Tiptop Tambun', value: 'b', latitude: -6.279923623321473, longitude: 107.03889738708703 },
        { label: 'Colombus WaterPark', value: 'c', latitude: -6.285725054950756, longitude: 107.03082930293469 },
    ]);

    const [listPlace2, setlistPlace2] = useState([
        { label: 'Tujuan Kamu', value: '1', latitude: 0, longitude: 0 },
        { label: 'RS Ananda Tambun', value: 'a', latitude: -6.270965403411115, longitude: 107.0259369540338 },
        { label: 'Tiptop Tambun', value: 'b', latitude: -6.279923623321473, longitude: 107.03889738708703 },
        { label: 'Colombus WaterPark', value: 'c', latitude: -6.285725054950756, longitude: 107.03082930293469 },
    ]);

    const [modalChoice, setmodalChoice] = useState(false);

    const [originChoice, setoriginChoice] = useState({
        label: 'Lokasi Kamu',
        value: '1',
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude
    });
    const [destinationChoice, setdestinationChoice] = useState({
        label: 'Tujuan Kamu',
        value: '1',
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude
    });
    const [coordinates, setCoordinates] = useState([]);

    const [selectedValue, setSelectedValue] = useState(options[0].value);
    const [modalSearchBarShow, setmodalSearchBarShow] = useState(true);
    const [modalRideShow, setmodalRideShow] = useState(false);
    const [rideModal, setrideModal] = useState(true);
    const [modalPaymentShow, setmodalPaymentShow] = useState(true);
    const [mencariDriver, setmencariDriver] = useState(false);

    const [initialSearch, setinitialSearch] = useState(false);

    // const handleMapPress = (e) => {
    //     const coordinates = e.nativeEvent.coordinate;
    //     console.log(coordinates)
    // }

    const bookingNow = () => {
        setmodalSearchBarShow(false)
        setmodalRideShow(false)
        setrideModal(false)
        setmodalPaymentShow(false)
        setmencariDriver(true)
    }

    const batalMencari = () => {
        setmodalSearchBarShow(true)
        setmodalRideShow(false)
        setrideModal(true)
        setmodalPaymentShow(true)
        setmencariDriver(false)
    }

    const handleUserLocationChange = (event) => {
        if (initialSearch === false) {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            setinitialSearch(true)
            setPickupLocation({ latitude: latitude, longitude: longitude });
        }
    };

    const [markers, setMarkers] = useState([]);
    const paddingMap = { top: 100, right: 100, bottom: 300, left: 100 }

    const buttonPickup = (a) => {
        setTimeout(() => {
            setPickupLocation({
                latitude: a.latitude,
                longitude: a.longitude
            });
            mapRef.current.fitToCoordinates([{ latitude: a.latitude, longitude: a.longitude }, destinationLocation].filter(Boolean), {
                edgePadding: paddingMap,
                animated: true,
            });
        }, 1000); // 1000 ms delay
    };
    const buttonDestination = (a) => {
        setTimeout(() => {
            setDestinationLocation({
                latitude: a.latitude,
                longitude: a.longitude
            });
            mapRef.current.fitToCoordinates([pickupLocation, { latitude: a.latitude, longitude: a.longitude }].filter(Boolean), {
                edgePadding: paddingMap,
                animated: true,
            });
        }, 1000); // 1000 ms delay
    };

    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                    latitude: pickupLocation.latitude,
                    longitude: pickupLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                onUserLocationChange={handleUserLocationChange}
                // onRegionChangeComplete={(data) => console.log(data)}
                // onPress={handleMapPress}
                showsUserLocation={true}
            >
                <Marker coordinate={pickupLocation} pinColor='red' title='Origin' />
                <Marker coordinate={destinationLocation} pinColor='green' title='Destination' />
                <Polyline coordinates={coordinates} strokeColor="#37AFE1" strokeWidth={4} />
            </MapView>
            {mencariDriver &&
                <>
                    <View style={styles.modalAnimateBottom}>
                        <ButtonComponent style={{ backgroundColor: COLORS.secondary }} title={"Batal Mencari"} onPress={() => batalMencari()} />
                    </View>
                    <View style={styles.modalAnimateCenter}>
                        <Text style={[COMPONENT_STYLES.textLarge, { textAlign: 'center' }]}>Sedang Mencari Driver Terdekat</Text>
                    </View>
                </>
            }
            <ModalSearch
                listPlace={listPlace}
                listPlace2={listPlace2}
                modalSearchBarShow={modalSearchBarShow}
                setmodalSearchBarShow={setmodalSearchBarShow}
                originChoice={originChoice.value}
                setoriginChoice={setoriginChoice}
                destinationChoice={destinationChoice.value}
                setdestinationChoice={setdestinationChoice}
                buttonOrigin={(a) => buttonPickup(a)}
                buttonDestination={(a) => buttonDestination(a)}
                navigation={() => navigation.goBack()}
            />
            {destinationLocation.latitude !== 0 &&
                <>
                    {rideModal &&
                        <ModalRideComponent
                            modalRideShow={modalRideShow}
                            setmodalRideShow={setmodalRideShow}
                            options={options}
                            selectedValue={selectedValue}
                            setSelectedValue={setSelectedValue}
                        />
                    }
                    <ModalPaymentComponent
                        navigasi={() => bookingNow()}
                        modalPaymentShow={modalPaymentShow}
                        setmodalPaymentShow={setmodalPaymentShow}
                    />
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    modalAnimateTop: {
        position: 'absolute',
        top: 10, // Position it at the bottom
        left: 10,
        right: 10,
    },
    modalAnimateBottom: {
        position: 'absolute',
        bottom: 10, // Position it at the bottom
        left: 10,
        right: 10,
    },
    modalAnimateCenter: {
        position: 'absolute',
        top: height / 2, // Position it at the bottom
        left: 10,
        right: 10,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20,
        elevation: 5
    },
    modalComponentTop: {
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#00000030',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        elevation: 1
    }
});

export default TrasrideScreen;
