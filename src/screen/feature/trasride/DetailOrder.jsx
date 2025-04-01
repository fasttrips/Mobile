import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ButtonComponent, ButtonSecondaryComponent } from '../../../component/ButtonComponent';
import { useTranslation } from 'react-i18next';
import MapView, { AnimatedRegion, Marker, Polyline } from 'react-native-maps';
import { getData } from '../../../api/service';
import { LoadingSearchComponent } from './component/LoadingSearchComponent';



const { width,height } = Dimensions.get('window');

const getBearing = (start, end) => {
    const y = Math.sin(end.lng - start.lng) * Math.cos(end.lat);
    const x = Math.cos(start.lat) * Math.sin(end.lat) -
        Math.sin(start.lat) * Math.cos(end.lat) * Math.cos(end.lng - start.lng);
    return (Math.atan2(y, x) * 180) / Math.PI; // Konversi ke derajat
};

const DetailOrder = ({ route, navigation }) => {
    const { idInvoice } = route.params
    const mapRef = useRef(null);

    const { t } = useTranslation();
    const [rating, setRating] = useState(0)
    const [tip, setTip] = useState(0)
    const [data, setdata] = useState("")
    const [status, setstatus] = useState(0)



    const [destinationLocation, setDestinationLocation] = useState({
        latitude: -6.206699626040456,
        longitude: 106.71610817076616,
    });
    const [driverLocation, setdriverLocation] = useState({
        latitude: -6.206699626040456,
        longitude: 106.71610817076616,
    });
    const [pickupLocation, setPickupLocation] = useState({
        latitude: -6.206699626040456,
        longitude: 106.71610817076616,
    });
    const [coordinates, setCoordinates] = useState([]);
    const [mencariDriver, setmencariDriver] = useState(false);

    const getProfileUser = async () => {
        try {
            const response = await getData('order/GetOrder/Detail/' + idInvoice);
            setdata(response)
            setstatus(response.data.status)
            setdriverLocation(response.locationDriver)
            setPickupLocation(response.data.pickupLocation)
            setDestinationLocation(response.data.destinationLocation)
            setCoordinates(response.data.coordinates)

            if (response.data.status === 4) {
                navigation.goBack()
            }

            if (response.data.status === 0) {
                setmencariDriver(true)
                const paddingMap = { top: 100, right: 100, bottom: 300, left: 100 };
                mapRef.current.fitToCoordinates(
                    [response.data.pickupLocation].filter(Boolean),
                    {
                        edgePadding: paddingMap, // Set padding for map zoom level
                        animated: true, // Animate the map transition
                    }
                );
            } else {
                setmencariDriver(false)
            }

            if (response.data.status === 1) {
                const paddingMap = { top: 100, right: 100, bottom: 300, left: 100 };
                mapRef.current.fitToCoordinates(
                    [response.data.pickupLocation, response.locationDriver].filter(Boolean),
                    {
                        edgePadding: paddingMap, // Set padding for map zoom level
                        animated: true, // Animate the map transition
                    }
                );
            }

            if (response.data.status >= 2) {
                const paddingMap = { top: 100, right: 100, bottom: 300, left: 100 };
                mapRef.current.fitToCoordinates(
                    [response.locationDriver, response.data.destinationLocation].filter(Boolean),
                    {
                        edgePadding: paddingMap, // Set padding for map zoom level
                        animated: true, // Animate the map transition
                    }
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProfileUser();
        const intervalId = setInterval(() => {
            getProfileUser();
        }, 10000);
        return () => { clearInterval(intervalId) };
    }, []);

    const batalMencari = async () => {

        try {
            const response = await getData('order/CancelOrderByUser/' + idInvoice);
            setmencariDriver(false)
            navigation.goBack()
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <MapView
                ref={mapRef}
                style={styles.map}
                pitch={30}
                region={{
                    latitude: pickupLocation.latitude,
                    longitude: pickupLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
            >
                <Marker coordinate={pickupLocation} pinColor='red' title='Origin' />
                <Marker coordinate={destinationLocation}>
                    <View style={{ backgroundColor: 'white', borderRadius: 100 }}>
                        <Image
                            source={require("../../../assets/logo.png")}
                            style={{ width: 40, height: 40 }}
                        />
                    </View>
                </Marker>
                {status > 0 && driverLocation !== null &&
                    <Marker coordinate={driverLocation} anchor={{ x: 0.5, y: 0.5 }}>
                        <View style={{ backgroundColor: 'black', borderRadius: 100 }}>
                            <Image
                                source={require("../../../assets/logo.png")}
                                style={{ width: 40, height: 40 }}
                            />
                        </View>
                    </Marker>
                }
                {coordinates !== null &&
                    <Polyline coordinates={coordinates} strokeColor="#37AFE1" strokeWidth={4} />
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
        </View>
    );
};

const styles = StyleSheet.create({
    barRating: { padding: 20, borderRadius: 10, flexDirection: "row", justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary },
    barTips: {
        padding: 20,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    elevation: 2,
    subPay: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        margin: 10
    },
    map: {
        flex: 1
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
    modalAnimateBottom: {
        position: 'absolute',
        bottom: 10, // Position it at the bottom
        left: 10,
        right: 10,

    },
});

export default DetailOrder;
