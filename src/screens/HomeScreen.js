/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth } from '../config/firebaseConfig';

const { width } = Dimensions.get('window');
const items = [
    {
        name: 'TrasRide',
        image: <Image
            source={require('../asset/car.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
        navigate: 'ChoiceScreen',
    },
    {
        name: 'TrasRent',
        image: <Image
            source={require('../asset/rent.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
        navigate: '',
    },
    {
        name: 'TrasFood',
        image: <Image
            source={require('../asset/food.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
        navigate: '',
    },
    {
        name: 'TrasRelax',
        image: <Image
            source={require('../asset/massage.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
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
    },
    {
        name: 'TrasInn',
        image: <Image
            source={require('../asset/shop.png')}  // Local image
            style={{ width: 40, height: 40 }}
        />,
    },
];

const HomeScreen = ({navigation}) => {

    const [user, setUser] = useState(null);

    function onAuthStateChanged(user) {
        setUser(user);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [onAuthStateChanged, user]);

    if (!user) {
        return (
            <View>
                <Text>Loading</Text>
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
                    Hi, {user.displayName}
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
                        <Text style={styles.textDesc}>Rp 0</Text>
                        <Text style={styles.textDesc}>0 Point</Text>
                    </View>
                    <TouchableOpacity>
                        <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('../asset/topup.png')}  // Local image
                                style={{ width: 20, height: 20, marginBottom: 2, tintColor: '#37AFE1' }}
                            />
                            <Text style={styles.textDesc}>Bayar</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
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
                            <TouchableOpacity key={index} onPress={() => navigation.navigate(data.navigate)}>
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
                {/* <View style={styles.barItems}>
                    {items2.map((data, index) => {
                        return (
                            <TouchableOpacity key={index}>
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
                </View> */}
                <View style={{ margin: 20 }} />
                <TouchableOpacity>
                    <View style={styles.fastTripBar}>
                        <Text style={[styles.textDesc, { color: '#ffffff' }]}>
                            Yuk pakai Trasgo Plus Jauh Lebih Hemat
                        </Text>
                        <Text style={[styles.textDesc, { color: '#ffffff' }]}>
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={{ margin: 10 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: '#ffffff', flex: 1, justifyContent: 'center', flexDirection: 'column',
    },
    textHeader: {
        width: width - 50,
        fontSize: 20,
        color: '#fff',
        fontFamily: 'sans-serif',
    },
    textTitle: {
        width: width - 50,
        fontSize: 16,
        fontFamily: 'sans-serif',
    },
    textDesc: { fontSize: 12 },
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
