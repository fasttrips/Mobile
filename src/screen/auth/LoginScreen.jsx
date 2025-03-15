import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../lib/constants';
import { useTranslation } from 'react-i18next';
import { setLocale } from '../../lib/translations';
import ButtonComponent from '../../component/ButtonComponent';
import TextInputComponent from '../../component/TextInputComponent';
import DropdownFlagComponent from '../../component/DropdownFlagComponent';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [flag, setflag] = useState('🇮🇩 +62');

  // Update the locale when selectedLanguage changes
  useEffect(() => {
    setLocale(selectedLanguage);
  }, [selectedLanguage]);

  // handle login press (to be implemented)
  const handleLoginPress = () => {
    if (!phone) {
      setError(t('loginScreen.emptyPhone'));
    } else {
      setError('');
      const string = flag+phone;
      const phoneNumber = string.replace(/[^\d+]/g, '');
      console.log('Login pressed with phone:', phoneNumber);
    }
  };

  const languageItems = [
    { label: 'Indonesian', value: '+62', flag: "🇮🇩" },
    { label: 'Singapore', value: '+65', flag: "🇸🇬" },
    { label: 'Malaysia', value: '+60', flag: "🇲🇾" },
  ];

  return (
    <View style={COMPONENT_STYLES.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={{ alignItems: 'center' }}>
        <Image source={require('../../assets/logo2.png')} style={{ width: 200, height: 200 }} />
        <Image source={require('../../assets/opening.png')} style={{ width: width - 100, height: 290 }} />
      </View>
      <View style={{ flex: 1 }} />
      <Text style={[COMPONENT_STYLES.textLarge, { fontWeight: '600' }]}>{t('loginScreen.welcome')}</Text>
      <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{t('loginScreen.welcomeSub')}</Text>
      <View style={COMPONENT_STYLES.spacer} />
      <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: '600' }]}>{t('loginScreen.phoneLabel')}</Text>
      <View style={{ flexDirection: 'row' }}>
        <DropdownFlagComponent
          // label={t('loginScreen.placeholderEmail')}
          items={languageItems}
          value={flag}
          onValueChange={setflag}
        />
        <View style={{ flex: 1 }} >
          <TextInputComponent
            // label={t('loginScreen.phoneLabel')}
            placeholder={t('loginScreen.placeholderPhone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            errorMessage={error}
          />
        </View>
      </View>
      <View style={COMPONENT_STYLES.spacer} />
      <ButtonComponent
        title={t('loginScreen.loginButton')}
        onPress={handleLoginPress}
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

export default LoginScreen;
