import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../lib/constants';
import { useTranslation } from 'react-i18next';
import { setLocale } from '../../lib/translations';
import ButtonComponent from '../../component/ButtonComponent';
import TextInputStandardComponent from '../../component/TextInputStandardComponent';
import DropdownFlagComponent from '../../component/DropdownFlagComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../../lib/transFunctions';

const { width } = Dimensions.get('window');

const VerifikasiScreen = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [error, setError] = useState('');

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
      setSelectedLanguage(response)
    }
    fetchData()
  }, [selectedLanguage]);

  // handle login press (to be implemented)
  const handleRegisterPress = () => {
    if (!form.phone) {
      setError(t('verifikasiScreen.emptyPhone'));
    } else {
      setError('');
      const string = flag + form.phone;
      const phoneNumber = string.replace(/[^\d+]/g, '');
    }
  };

  return (
    <View style={COMPONENT_STYLES.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
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
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
      <Text style={[COMPONENT_STYLES.textMedium, {fontWeight:'bold'}]}>{"20:00"} min</Text>
      <Text style={[COMPONENT_STYLES.textMedium, {fontWeight:'bold'}]}>{t('verifikasiScreen.kirimulang')}</Text>

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
    </View>
  );
};

const styles = StyleSheet.create({
  // You can add additional custom styles here if needed
});

export default VerifikasiScreen;
