import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity, Alert, Platform, PermissionsAndroid, FlatList } from 'react-native';
import { BORDER_RADIUS, COLORS, COMPONENT_STYLES } from '../../lib/constants';
import { requestPermissions } from '../../lib/mapFunctions';
import Geolocation from '@react-native-community/geolocation';
import { useTranslation } from 'react-i18next';


const { width } = Dimensions.get('window');

const menu = [
  {
    items: "TrasRide",
    image: require("../../assets/trasride.png"),
    image2: require("../../assets/shape1.png"),
    navigate: 'TrasRide',
    status: true
  },
  {
    items: "TrasFood",
    image: require("../../assets/trasfood.png"),
    image2: require("../../assets/shape1.png"),
    navigate: 'TrasFood',
    status: true
  },
  {
    items: "TrasRent",
    image: require("../../assets/trasrent.png"),
    image2: require("../../assets/shape1.png"),
    navigate: 'TrasRent',
    status: true
  },
  {
    items: "TrasMove",
    image: require("../../assets/trasmove.png"),
    image2: require("../../assets/shape1.png"),
    navigate: 'TrasMove',
    status: true
  },
]

const bannerNews = [
  {
    id: 0,
    items: "TrasRide",
    image: "https://abigold.co.id/wp-content/uploads/2025/03/1.png",
  },
  {
    id: 1,
    items: "TrasRide",
    image: "https://abigold.co.id/wp-content/uploads/2025/03/2.png",
  },
]

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [pickupLocation, setPickupLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const getCurrentLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
      return;
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);


  return (
    <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
        <Image source={require("../../assets/frame.png")} style={styles.imageBack} />
        <View style={{ alignItems: 'center' }}>
          <Image source={require("../../assets/logo3.png")} style={{ width: 100, height: 100 }} />
        </View>
        <Text style={[COMPONENT_STYLES.textLarge, { color: 'white' }]}>{t("menuHome.selamat")}</Text>
        <Text style={[COMPONENT_STYLES.textLarge, { color: 'white' }]}>Hilyathul Wahid</Text>
        <View style={styles.balanceBar}>
          <View>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>TrasPoint</Text>
            <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: 600 }]}>0 PTS</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Level</Text>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Pemula</Text>
          </View>
        </View>
        <View style={styles.menuContainer}>
          {menu.map((item, index) => {
            return (
              <TouchableOpacity key={index} style={styles.menuItem}
                onPress={() => {
                  if (item.status === false) {
                    Alert.alert("Info", "Feature ini segera hadir")
                  } else {
                    navigation.navigate(item.navigate, {
                      latitude: 0,
                      longitude: 0
                    }
                    )
                  }
                }}>
                <View style={styles.shape} />
                <Image source={item.image} style={{ width: 50, height: 50 }} />
                <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>{item.items}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={[COMPONENT_STYLES.textMedium]}>{t("menuHome.inform")}</Text>
        <View style={COMPONENT_STYLES.spacer} />
        <FlatList
          data={bannerNews}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image }} style={styles.image} />
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 140,
    borderRadius: 10, // Membuat gambar bulat
    marginRight: 10, // Jarak antar gambar
    padding:5
},
  imageBack: { width: width, height: 350, position: 'absolute' },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  menuItem: {
    flex: 1,
    maxWidth: '45%', // Adjust this value to control the maximum width of each item
    height: 90,
    borderRadius: BORDER_RADIUS.medium,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shape: {
    width: 80,
    height: 60,
    position: 'absolute',
    backgroundColor: '#fff',
    elevation: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    top: 28
  },
  balanceBar: {
    backgroundColor: '#fff',
    marginTop: 140,
    borderRadius: BORDER_RADIUS.medium,
    height: 70,
    elevation: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20
  }
});

export default HomeScreen;
