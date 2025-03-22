import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import { BORDER_RADIUS, COLORS, COMPONENT_STYLES } from '../../lib/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';



const { width } = Dimensions.get('window');

const menu = [
  {
    name: "My Profile",
    iconName: "person-circle-outline"
  },
  {
    name: "Referal dan Hadiah",
    iconName: "people-circle-outline"
  },
  {
    name: "Saved Address",
    iconName: "map-outline"
  },
  {
    name: "Term & Conditions",
    iconName: "newspaper-outline"
  },
  {
    name: "Support",
    iconName: "mail-outline"
  },
  {
    name: "LogOut",
    iconName: "log-out-outline"
  }
]


const AkunScreen = ({ navigation }) => {

  return (
    <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={{ backgroundColor: 'white', height: 50 }}>
        <Text style={[COMPONENT_STYLES.textLarge, { position: 'absolute', bottom: 0, marginLeft: 15 }]}>
          Akun
        </Text>
      </View>
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
        <View>
          <Text style={[COMPONENT_STYLES.textMedium]}>
            Hilyathul Wahid
          </Text>
          <Text style={[COMPONENT_STYLES.textSmall]}>
            081310531713
          </Text>
          <Text style={[COMPONENT_STYLES.textSmall]}>
            hilmanzutech@gmail.com
          </Text>
        </View>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', backgroundColor: COLORS.primary, padding: 10, height: 100, borderRadius: 10 }}>
          <View style={{ padding: 10 }}>
            <View style={{ padding: 10, paddingHorizontal: 15, backgroundColor: 'white', flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Ionicons name="wallet-outline" size={32} color="black" />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[COMPONENT_STYLES.textLarge, { color: 'white' }]}>
              Traspay
            </Text>
            <Text style={[COMPONENT_STYLES.textMedium, { color: 'white' }]}>
              Rp 20.000
            </Text>
          </View>
        </TouchableOpacity>
        <View style={COMPONENT_STYLES.spacer} />
        {menu.map((data, index) => {
          return (
            <TouchableOpacity key={index} style={{ alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', padding: 10, borderRadius: 10 }}>
              <View>
                <View style={{ padding: 10, backgroundColor: 'white', flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                  <Ionicons name={data.iconName} size={24} color="black" />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[COMPONENT_STYLES.textMedium, { color: 'black' }]}>
                  {data.name}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default AkunScreen;
