import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity, Alert, Platform, PermissionsAndroid } from 'react-native';
import { BORDER_RADIUS, COLORS, COMPONENT_STYLES } from '../../lib/constants';
import { useTranslation } from 'react-i18next';


const { width } = Dimensions.get('window');

const AktifitasScreen = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={{ backgroundColor: 'white', height: 50 }}>
        <Text style={[COMPONENT_STYLES.textLarge, { position: 'absolute', bottom: 0, marginLeft: 15 }]}>
          {t('menuAktifitas.title')}
        </Text>
      </View>
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
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

export default AktifitasScreen;
