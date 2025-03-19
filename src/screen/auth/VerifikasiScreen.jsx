import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../lib/constants';
import { useTranslation } from 'react-i18next';
import { setLocale } from '../../lib/translations';
import { ButtonComponent } from '../../component/ButtonComponent';
import TextInputStandardComponent from '../../component/TextInputStandardComponent';
import DropdownFlagComponent from '../../component/DropdownFlagComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../../lib/transFunctions';

const { width } = Dimensions.get('window');

const VerifikasiScreen = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60); // 20 minutes in seconds
  const intervalRef = useRef(null);

  const [form, setForm] = useState({
    nama: '',
    phone: '',
    email: '',
    kodereferal: ''
  })

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  useEffect(() => {
    async function fetchData() {
      const response = await getData();
      setSelectedLanguage(response);

      const storedTimer = await AsyncStorage.getItem('verificationTimer');
      if (storedTimer) {
        setTimer(parseInt(storedTimer, 10));
      }
    }
    fetchData();
  }, [selectedLanguage]);

  useEffect(() => {
    if (timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      AsyncStorage.setItem('verificationTimer', timer.toString());
    };
  }, [timer]);

  // handle login press (to be implemented)
  const handleRegisterPress = async () => {
    const user = await AsyncStorage.setItem('accessTokens', "asd");
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleResendPress = async () => {
    // Reset the timer to 20 minutes
    setTimer(60);
    await AsyncStorage.setItem('verificationTimer', '60');
    // Add your resend OTP logic here
  };

  return (
    <View style={COMPONENT_STYLES.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>

        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={COMPONENT_STYLES.textLarge}>{t('verifikasiScreen.title')}</Text>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <TextInputStandardComponent
          label={t('verifikasiScreen.kodeverifikasi')}
          placeholder={t('verifikasiScreen.placeholderkode')}
          value={form.phone}
          onChangeText={(value) => handleInputChange('phone', value)}
          keyboardType="numeric"
          errorMessage={error}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: 'bold' }]}>{timer === 0 ? "" : formatTime(timer)}</Text>
          <TouchableOpacity
            onPress={handleResendPress}
            disabled={timer > 0}
            style={{ opacity: timer > 0 ? 0.5 : 1 }}
          >
            <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: 'bold' }]}>{t('verifikasiScreen.kirimulang')}</Text>
          </TouchableOpacity>
        </View>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <ButtonComponent
          title={t('verifikasiScreen.verifikasiButton')}
          onPress={handleRegisterPress}
        />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // You can add additional custom styles here if needed
});

export default VerifikasiScreen;
