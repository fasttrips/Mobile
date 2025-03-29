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
import { LoadingSearchComponent } from './component/LoadingSearchComponent';
import ModalDriver from '../../../component/ModaDriver';
import ModalInfo from '../../../component/ModalInfo';
import { postData } from '../../../api/service';

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
    const [driverLocation, setdriverLocation] = useState({
        latitude: -6.206699626040456,
        longitude: 106.71610817076616,
    });

    const [options, setoptions] = useState([
        {
            label: 'TrasRide',
            value: 'TR',
            icon: require("../../../assets/trasride/motor.png"),
            time: '20 min',
            price: 15000,
            discount: 1000,
            desc: 'cepat sampai tujuan',
            icon:'1'
        },
        {
            label: 'TrasRide XL',
            value: 'TRX',
            icon: require("../../../assets/trasride/motorxl.png"),
            time: '20 min',
            price: 18000,
            discount: 0,
            desc: 'jok besar yang bikin nyaman',
            icon:'2'
        },
        {
            label: 'TrasRide XL',
            value: 'TRX',
            icon: require("../../../assets/trasride/motorxl.png"),
            time: '20 min',
            price: 18000,
            discount: 0,
            desc: 'jok besar yang bikin nyaman',
            icon:'3'
        },
        {
            label: 'TrasRide XL',
            value: 'TRX',
            icon: require("../../../assets/trasride/motorxl.png"),
            time: '20 min',
            price: 18000,
            discount: 0,
            desc: 'jok besar yang bikin nyaman',
            icon:'4'
        }
    ])

    const [listPlace, setlistPlace] = useState([
        { label: 'Lokasi Kamu', value: '1', latitude: 0, longitude: 0 },
    ]);

    const [listPlace2, setlistPlace2] = useState([
        { label: 'Tujuan Kamu', value: '1', latitude: 0, longitude: 0 },
    ]);

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

    const [selectedValue, setSelectedValue] = useState([options[0]]);
    const [modalSearchBarShow, setmodalSearchBarShow] = useState(true);
    const [modalRideShow, setmodalRideShow] = useState(false);
    const [rideModal, setrideModal] = useState(true);
    const [modalPaymentShow, setmodalPaymentShow] = useState(true);
    const [mencariDriver, setmencariDriver] = useState(false);
    const [modalCancel, setmodalCancel] = useState(false);

    const [findDriver, setfindDriver] = useState(false);
    const [statusDriver, setstatusDriver] = useState(0);

    const [initialSearch, setinitialSearch] = useState(false);

    const bookingNow = () => {
        setmodalSearchBarShow(false)
        setmodalRideShow(false)
        setrideModal(false)
        setmodalPaymentShow(false)
        setmencariDriver(true)
        const paddingMap = { top: 100, right: 100, bottom: 200, left: 100 }; // Adjust padding as needed
        mapRef.current.fitToCoordinates(
            [{ latitude: pickupLocation.latitude, longitude: pickupLocation.longitude }].filter(Boolean),
            {
                edgePadding: paddingMap, // Set padding for map zoom level
                animated: true, // Animate the map transition
            }
        );
        setTimeout(() => {
            mapRef.current.fitToCoordinates([pickupLocation, driverLocation].filter(Boolean), {
                edgePadding: paddingMap,
                animated: true,
            });
            setmodalSearchBarShow(true)
            setrideModal(false)
            setmencariDriver(false)
            setfindDriver(true)
        }, 2000);
    }

    const batalMencari = () => {
        setmodalSearchBarShow(true)
        setmodalRideShow(false)
        setrideModal(true)
        setmodalPaymentShow(true)
        setmencariDriver(false)
        setfindDriver(false)
        setmodalCancel(false)
        const paddingMap = { top: 100, right: 100, bottom: 300, left: 100 }; // Adjust padding as needed
        mapRef.current.fitToCoordinates(
            [{ latitude: pickupLocation.latitude, longitude: pickupLocation.longitude }, destinationLocation].filter(Boolean),
            {
                edgePadding: paddingMap, // Set padding for map zoom level
                animated: true, // Animate the map transition
            }
        );
    }

    const handleUserLocationChange = (event) => {
        if (initialSearch === false) {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            setinitialSearch(true)
            setPickupLocation({ latitude: latitude, longitude: longitude });
        }
    };

    const paddingMap = { top: 100, right: 100, bottom: 300, left: 100 }

    const buttonPickup = async (a) => {
        const formData = {
            nameSearch: a.placeId
        };
        try {
            const response = await postData('maps/getPlaceLocation', formData);
            setTimeout(async () => {
                setPickupLocation({
                    latitude: parseFloat(response.data.latitude),
                    longitude: parseFloat(response.data.longitude)
                });
                mapRef.current.fitToCoordinates([{ latitude: parseFloat(response.data.latitude), longitude: parseFloat(response.data.longitude) }, destinationLocation].filter(Boolean), {
                    edgePadding: paddingMap,
                    animated: true,
                });
                const formData2 = {
                    originLat: parseFloat(response.data.latitude),
                    originLon: parseFloat(response.data.longitude),
                    destinationLat: destinationLocation.latitude,
                    destinationLon: destinationLocation.longitude,
                };
                try {
                    const responseFinal = await postData('maps/getDirections', formData2);
                    setCoordinates(responseFinal.coordinate)
                } catch (error) {

                }
            }, 1000); // 1000 ms delay
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    const buttonDestination = async (a) => {
        const formData = {
            nameSearch: a.placeId
        };
        try {
            const response = await postData('maps/getPlaceLocation', formData);
            setTimeout(async () => {
                setDestinationLocation({
                    latitude: parseFloat(response.data.latitude),
                    longitude: parseFloat(response.data.longitude)
                });
                mapRef.current.fitToCoordinates([pickupLocation, { latitude: parseFloat(response.data.latitude), longitude: parseFloat(response.data.longitude) }].filter(Boolean), {
                    edgePadding: paddingMap,
                    animated: true,
                });
                const formData2 = {
                    originLat: pickupLocation.latitude,
                    originLon: pickupLocation.longitude,
                    destinationLat: parseFloat(response.data.latitude),
                    destinationLon: parseFloat(response.data.longitude)
                };
                try {
                    const responseFinal = await postData('maps/getDirections', formData2);
                    setCoordinates(responseFinal.coordinate)
                    setoptions(responseFinal.listLayanan)
                } catch (error) {

                }
            }, 1000);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <MapView
                ref={mapRef}
                // provider={PROVIDER_GOOGLE}
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
                {driverLocation.latitude !== 0 && statusDriver === 0 && findDriver &&
                    <Polyline coordinates={[pickupLocation, driverLocation]} strokeColor="#37AFE1" strokeWidth={4} />
                }
                {findDriver &&
                    <Marker coordinate={driverLocation} pinColor='blue' title='Driver' />
                }
            </MapView>
            {mencariDriver &&
                <>
                    <View style={styles.modalAnimatebackground} />
                    <View style={styles.modalAnimateBottom}>
                        <ButtonComponent style={{ backgroundColor: COLORS.secondary }} title={"Batal Mencari"} onPress={() => batalMencari()} />
                    </View>
                    <LoadingSearchComponent />
                </>
            }
            {findDriver &&
                <ModalDriver
                    title={"asd"}
                    desc={"hjk"}
                    isVisible={findDriver}
                    setModalVisible={setfindDriver}
                    actions={() => setmodalCancel(true)}
                    call={() => navigation.navigate("Call", {
                        idDriver: 0
                    })}
                    chat={() => navigation.navigate("Chat", {
                        idDriver: 0
                    })}
                    selesai={() => navigation.replace("Rating", {
                        idInvoice: 'INV 123.2123'
                    })}
                />
            }
            <ModalInfo
                isVisible={modalCancel}
                setModalVisible={setmodalCancel}
                title={"Cancel Booking"}
                desc={"kamu ingin membatalkan pesanan ?"}
                actions={() => batalMencari()}
            />
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
                        selectedValue={selectedValue}
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
    modalAnimatebackground: {
        position: 'absolute',
        backgroundColor: '#00000090',
        width: width,
        height: height
    },
    modalAnimateCenter: {
        position: 'absolute',
        top: height / 3, // Position it at the bottom
        left: 50,
        right: 50,
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
