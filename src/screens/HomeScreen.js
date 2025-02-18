/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    PermissionsAndroid,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth } from '../config/firebaseConfig';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import { getBanner, getUser } from '../api/functions';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');
const items = [
    {
        name: 'TrasRide',
        image: <Image
            source={require('../asset/car.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
        navigate: 'TrasRide',
        status: true
    },
    {
        name: 'TrasRent',
        image: <Image
            source={require('../asset/rent.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
        navigate: 'TrasRent',
        status: false
    },
    {
        name: 'TrasFood',
        image: <Image
            source={require('../asset/food.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
        navigate: 'TrasFood',
        status: false
    },
    
    {
        name: 'TrasHotel',
        image: <Image
            source={require('../asset/shop.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
        status: false
    },
];

const items2 = [
    {
        name: 'TrasMove',
        image: <Image
            source={require('../asset/package.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
        navigate: '',
        status: false
    },
    {
        name: 'TrasRelax',
        navigate: 'TrasRelax',
        image: <Image
            source={require('../asset/massage.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
        status: false
    },
    
];

async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Izin notifikasi diberikan:', authStatus);
    }
}

const requestPermissions = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, // Notifikasi (Android 13+)
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, // Mikrofon
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // Lokasi Akurat
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, // Lokasi Kasar
            ]);

            return {
                notifications: granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] === PermissionsAndroid.RESULTS.GRANTED,
                microphone: granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED,
                fineLocation: granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED,
                coarseLocation: granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED,
            };
        } catch (err) {
            console.warn(err);
            return null;
        }
    }
    return {
        notifications: true,
        microphone: true,
        fineLocation: true,
        coarseLocation: true,
    };
};

const HomeScreen = ({ navigation }) => {

    const [user, setUser] = useState(null);
    const [banner, setBanner] = useState([]);


    const fetchBannerData = async () => {
        await getBanner().then(bannerData => {
            if (bannerData) {
                setBanner(bannerData)
            } else {
                console.log('No user data found');
            }
        })
    }

    useEffect(() => {
        requestUserPermission();
        requestPermissions();

        const fetchUserData = async () => {
            getUser().then(userData => {
                if (userData) {
                    setUser(userData)
                    clearInterval(intervalId);
                } else {
                    console.log('No user data found');
                }
            })
        }
        fetchUserData();
        fetchBannerData();

        // Dapatkan token perangkat untuk notifikasi
        messaging().getToken().then(token => console.log('FCM Token:', token));
        // Handle notifikasi ketika aplikasi berjalan
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert('Pesan Baru!', JSON.stringify(remoteMessage.notification));
        });

        const intervalId = setInterval(fetchUserData, 500);
        return unsubscribe;
    }, []);

    if (!user) {
        return (
            <View style={styles.containerLoading}>
                <LottieView width={width - 100} height={width - 100} source={require('../asset/animation/search.json')} autoPlay loop />
                <Text style={{ fontFamily: 'Montserrat-Regular' }}>Sedang Memuat Data</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.backgroundStyle}>
            <StatusBar backgroundColor="#37AFE1" barStyle="light-content" />
            <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ alignItems: 'center' }}>
                <View style={styles.backgroundDesign} />
                <View style={{ margin: 20 }} />
                <Text style={styles.textHeader}>
                    Hi, {user.fullname}
                </Text>
                <Text style={[styles.textTitle, { color: '#fff' }]}>
                    Selamat datang di Trasgo
                </Text>
                <View style={{ margin: 25 }} />
                <View style={styles.barTopup}>
                    <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../asset/wallet.png')}  // Local image
                            style={{ width: 30, height: 30 }}
                        />
                    </View>
                    <View style={{ width: 150, height: 50, justifyContent: 'center' }}>
                        <TouchableOpacity>
                            <Text style={styles.textDesc}>Rp {user.balance.toLocaleString("id-ID")}</Text>
                        </TouchableOpacity>
                        <Text style={styles.textDesc}>{user.point.toLocaleString("id-ID")} Point</Text>
                    </View>
                    <TouchableOpacity onPress={() => Alert.alert("Info", "Feature ini segera hadir")}>
                        <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('../asset/topup.png')}  // Local image
                                style={{ width: 20, height: 20, marginBottom: 2, tintColor: '#37AFE1' }}
                            />
                            <Text style={styles.textDesc}>Bayar</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Alert.alert("Info", "Feature ini segera hadir")}>
                        <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('../asset/plus.png')}  // Local image
                                style={{ width: 20, height: 20, marginBottom: 2, tintColor: '#37AFE1' }}
                            />
                            <Text style={styles.textDesc}>TopUp</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.barItems}>
                    {items.map((data, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => {
                                if (data.status === false) {
                                    Alert.alert("Info", "Feature ini segera hadir")
                                } else {
                                    navigation.navigate(data.navigate)
                                }
                            }}>
                                <View style={styles.contentTopop}>
                                    <View style={styles.imageBackgrounds}>
                                        {data.image}
                                    </View>
                                    <View style={{ margin: 2 }} />
                                    <Text style={styles.textDesc}>{data.name}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={styles.barItems}>
                    {items2.map((data, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => {
                                if (data.status === false) {
                                    Alert.alert("Info", "Feature ini segera hadir")
                                } else {
                                    navigation.navigate(data.navigate)
                                }
                            }}>
                                <View style={styles.contentTopop}>
                                    <View style={styles.imageBackgrounds}>
                                        {data.image}
                                    </View>
                                    <View style={{ margin: 2 }} />
                                    <Text style={styles.textDesc}>{data.name}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={{ margin: 20 }} />
                <TouchableOpacity onPress={() => Alert.alert("Info", "Fitur ini segera hadir")}>
                    <View style={styles.fastTripBar}>
                        <Text style={[styles.textDesc, { color: '#ffffff', fontFamily: 'Montserrat-Regular' }]}>
                            Yuk pakai Trasgo Plus Jauh Lebih Hemat
                        </Text>
                        <Text style={[styles.textDesc, { color: '#ffffff', fontFamily: 'Montserrat-Regular' }]}>
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{ margin: 10 }} />
                <View style={{paddingHorizontal:20}}>
                    <FlatList
                        data={banner}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item.image }} style={styles.image} />
                        )}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 230,
        height: 140,
        borderRadius: 10, // Membuat gambar bulat
        marginHorizontal: 5, // Jarak antar gambar
    },
    containerLoading: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    backgroundStyle: {
        backgroundColor: '#ffffff', flex: 1, justifyContent: 'center', flexDirection: 'column',
    },
    textHeader: {
        width: width - 50,
        fontSize: 20,
        color: '#fff',
        fontFamily: 'Montserrat-Regular'
    },
    textTitle: {
        width: width - 50,
        fontSize: 16,
        fontFamily: 'Montserrat-Regular'
    },
    textDesc: { fontSize: 12, fontFamily: 'Montserrat-Regular' },
    backgroundDesign: {
        position: 'absolute',
        backgroundColor: '#37AFE1',
        width: width,
        height: 180,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    barTopup: {
        width: width - 50,
        height: 70,
        backgroundColor: '#fff',
        elevation: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 20,
    },
    barItems: {
        width: width - 50,
        height: 70,
        marginTop: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 20,
    },
    contentTopop: {
        width: 70,
        height: 70,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageBackgrounds: { backgroundColor: '#37AFE150', padding: 10, borderRadius: 10 },
    fastTripBar: { width: width - 50, height: 30, backgroundColor: '#37AFE1', borderRadius: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingLeft: 20, paddingRight: 20 },
});

export default HomeScreen;
