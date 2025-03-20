import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { ModalSearch } from './component/SearchComponent';
import { ModalRideComponent } from './component/ListRideComponent';
import { ModalPaymentComponent } from './component/PaymentComponent';

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
const { width } = Dimensions.get('window');

const TrasrideScreen = ({ route }) => {
    //param from home
    const mapRef = useRef(null);
    const { latitude, longitude } = route.params;

    const [listPlace, setlistPlace] = useState([
        { label: 'Lokasi Kamu', value: '1', latitude: 0, longitude: 0 },
        { label: 'Waterpark Top Galaxy', value: 'a', latitude: 1.040988078588758, longitude: 104.00593605267467 },
        { label: 'Panbil Mall', value: 'b', latitude: 1.0738162907495508, longitude: 104.02447271206975 },
        { label: 'PT Wasco', value: 'c', latitude: 1.064617545079578, longitude: 103.9150908012483 },
    ]);
    const [listPlace2, setlistPlace2] = useState([
        { label: 'Tujuan Kamu', value: '1', latitude: 0, longitude: 0 },
        { label: 'Waterpark Top Galaxy', value: 'a', latitude: 1.040988078588758, longitude: 104.00593605267467 },
        { label: 'Panbil Mall', value: 'b', latitude: 1.0738162907495508, longitude: 104.02447271206975 },
        { label: 'PT Wasco', value: 'c', latitude: 1.064617545079578, longitude: 103.9150908012483 },
    ]);

    const [modalChoice, setmodalChoice] = useState(false);

    const [originChoice, setoriginChoice] = useState('1');
    const [destinationChoice, setdestinationChoice] = useState('1');

    const [coordinates, setCoordinates] = useState([]);

    const [pickupLocation, setPickupLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState({
        latitude: -6.192889538240455,
        longitude: 106.74259727373227,
    });

    const [selectedValue, setSelectedValue] = useState(options[0].value);

    const [modalSearchBarShow, setmodalSearchBarShow] = useState(true);
    const [modalRideShow, setmodalRideShow] = useState(false);
    const [rideModal, setrideModal] = useState(true);
    const [modalPaymentShow, setmodalPaymentShow] = useState(true);



    useEffect(() => {
        setPickupLocation({
            latitude: latitude,
            longitude: longitude
        })
        // fetchRoute()
    }, []);

    const handleMapPress = (e) => {
        const coordinates = e.nativeEvent.coordinate;
        console.log(coordinates)
    }

    const bookingNow = () => {
        setmodalSearchBarShow(false)
        setmodalRideShow(false)
        setrideModal(false)
        setmodalPaymentShow(false)
    }

    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                // onRegionChangeComplete={(data) => console.log(data)}
                onPress={handleMapPress}
                showsUserLocation={true}
            >
                <Marker coordinate={pickupLocation} pinColor='red' title='Origin' />
                <Marker coordinate={destinationLocation} pinColor='green' title='Destination' />
                <Polyline coordinates={coordinates} strokeColor="#37AFE1" strokeWidth={4} />
            </MapView>
            {/* <ModalChoice isVisible={modalChoice} setModalVisible={setmodalChoice} navigasi={() => console.log("test")} /> */}
            <ModalSearch
                listPlace={listPlace}
                listPlace2={listPlace2}
                modalSearchBarShow={modalSearchBarShow}
                setmodalSearchBarShow={setmodalSearchBarShow}
                originChoice={originChoice}
                setoriginChoice={setoriginChoice}
                destinationChoice={destinationChoice}
                setdestinationChoice={setdestinationChoice}
            />
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
