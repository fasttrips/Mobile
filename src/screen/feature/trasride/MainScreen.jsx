import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../../lib/constants';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { decodePolyline } from '../../../lib/mapFunctions';
import axios from 'axios';
import { ButtonComponent } from '../../../component/ButtonComponent';
import ModalChoice from '../../../component/ModalChoice';

const GOOGLE_API_KEY = 'AIzaSyDXQXYXToGvd4HQoP5XHYwwQBAbvnpaLNQ';

const { width } = Dimensions.get('window');

const TrasrideScreen = ({ route }) => {
    //param from home
    const { latitude, longitude } = route.params;

    const mapRef = useRef(null);

    const [modalChoice, setmodalChoice] = useState(true);


    const [coordinates, setCoordinates] = useState([]);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState({
        latitude: -6.192889538240455,
        longitude: 106.74259727373227,
    });

    useEffect(() => {
        setPickupLocation({
            latitude: latitude,
            longitude: longitude
        })
        // fetchRoute()
    }, []);

    const handleMapPress=(e)=>{
        const coordinates = e.nativeEvent.coordinate;
        console.log(coordinates)
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
            {/* <View style={{ position: 'absolute', flexDirection:'row',justifyContent:'space-around', width:width }}>
                <ButtonComponent title="Origin" onPress={() => setmodalChoice(true)} />
                <ButtonComponent title="Destination" onPress={() => console.log(destinationLocation)} />
            </View> */}
            <ModalChoice isVisible={modalChoice} setModalVisible={setmodalChoice} navigasi={() => console.log("test")}/>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
});

export default TrasrideScreen;
