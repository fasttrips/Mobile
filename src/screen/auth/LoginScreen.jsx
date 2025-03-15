import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../lib/constants';
import ButtonComponent from '../../component/ButtonComponent';
import TextInputComponent from '../../component/TextInputComponent';
import { useTranslation } from 'react-i18next';
import { setLocale } from '../../lib/translations';
import DropdownComponent from '../../component/DropdownComponent';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState(''); // email should be a string
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // handle login press (to be implemented)
  const handleLoginPress = () => {
    if (!email) {
      setError(t('loginScreen.emailError'));
    } else {
      setError('');
      // You can add further login logic here
      console.log('Login pressed with email:', email);
    }
  };

  // Update the locale when selectedLanguage changes
  useEffect(() => {
    setLocale(selectedLanguage);
  }, [selectedLanguage]);

  const languageItems = [
    { label: 'English', value: 'en' },
    { label: 'Indonesian', value: 'id' },
  ];

  return (
    <View style={COMPONENT_STYLES.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView contentContainerStyle={COMPONENT_STYLES.scrollView}>
        <View style={{ paddingHorizontal: 50 }}>
          <DropdownComponent
            label={t('loginScreen.placeholderEmail')}
            items={languageItems}
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            placeholder={{ label: t('loginScreen.placeholderEmail'), value: null }}
          />
        </View>

        <Text style={COMPONENT_STYLES.textLarge}>
          {t('loginScreen.title')}
        </Text>

        <TextInputComponent
          label={t('loginScreen.emailLabel')}
          placeholder={t('loginScreen.placeholderEmail')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          errorMessage={error}
        />

        <ButtonComponent
          title={t('loginScreen.loginButton')}
          onPress={handleLoginPress}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // You can add additional custom styles here if needed
});

export default LoginScreen;
