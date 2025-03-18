import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../lib/constants';
import { useTranslation } from 'react-i18next';
import { setLocale } from '../../lib/translations';
import ButtonComponent from '../../component/ButtonComponent';
import TextInputComponent from '../../component/TextInputComponent';
import DropdownFlagComponent from '../../component/DropdownFlagComponent';

const { width } = Dimensions.get('window');

const RegisterScreen = () => {
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

  // Update the locale when selectedLanguage changes
  useEffect(() => {
    setLocale(selectedLanguage);
  }, [selectedLanguage]);

  // handle login press (to be implemented)
  const handleRegisterPress = () => {
    if (!form.phone) {
      setError(t('registerScreen.emptyPhone'));
    } else {
      setError('');
      const string = flag + form.phone;
      const phoneNumber = string.replace(/[^\d+]/g, '');
      console.log('Login pressed with phone:', phoneNumber);
    }
  };

  return (
    <View style={COMPONENT_STYLES.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={COMPONENT_STYLES.spacer} />
      <View style={COMPONENT_STYLES.spacer} />
      <Text style={COMPONENT_STYLES.textLarge}>{t('registerScreen.title')}</Text>
      <View style={COMPONENT_STYLES.spacer} />
      <View style={COMPONENT_STYLES.spacer} />
      <View style={COMPONENT_STYLES.spacer} />
      <View style={COMPONENT_STYLES.spacer} />
      <TextInputComponent
        label={t('registerScreen.namaLengkap')}
        placeholder={t('registerScreen.placeholdernamaLengkap')}
        value={form.name}
        onChangeText={(value) => handleInputChange('nama', value)}
        keyboardType="default"
        errorMessage={error}
      />
      <TextInputComponent
        label={t('registerScreen.phoneLabel')}
        placeholder={t('registerScreen.placeholderPhone')}
        value={form.phone}
        onChangeText={(value) => handleInputChange('phone', value)}
        keyboardType="phone-pad"
        errorMessage={error}
      />
      <TextInputComponent
        label={t('registerScreen.emailLabel')}
        placeholder={t('registerScreen.placeholderEmail')}
        value={form.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email"
        errorMessage={error}
      />
      <TextInputComponent
        label={t('registerScreen.referalLabel')}
        placeholder={t('registerScreen.placeholderReferal')}
        value={form.referal}
        onChangeText={(value) => handleInputChange('referal', value)}
        keyboardType="referal"
        errorMessage={error}
      />
      <View style={COMPONENT_STYLES.spacer} />
      <View style={COMPONENT_STYLES.spacer} />
      <View style={COMPONENT_STYLES.spacer} />
      <ButtonComponent
        title={t('registerScreen.registerButton')}
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

export default RegisterScreen;
