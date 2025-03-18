import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image } from 'react-native';
import { COLORS, COMPONENT_STYLES } from '../../lib/constants';
import { useTranslation } from 'react-i18next';
import { ButtonComponent } from '../../component/ButtonComponent';
import TextInputComponent from '../../component/TextInputComponent';
import DropdownFlagComponent from '../../component/DropdownFlagComponent';
import DropdownLanguangeComponent from '../../component/DropdownLanguangeComponent';
import { getData } from '../../lib/transFunctions';
import ModalDown from '../../component/ModalDown';


const { width } = Dimensions.get('window');

const options = [
  { label: 'WhatsApp', value: 'wa', ico: "logo-whatsapp" },
  { label: 'SMS', value: 'sms', ico: "chatbox-ellipses-outline" }
];

const flagItems = [
  { label: 'Indonesian', value: '+62', flag: "🇮🇩" },
  { label: 'Singapore', value: '+65', flag: "🇸🇬" },
  { label: 'Malaysia', value: '+60', flag: "🇲🇾" },
];

const languageItems = [
  { label: 'Bahasa Indonesia', value: 'id' },
  { label: 'English', value: 'en' },
  { label: '普通话', value: 'cn' },
];

const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('id');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [flag, setflag] = useState('🇮🇩 +62');
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const response = await getData();
      setSelectedLanguage(response)
    }
    fetchData()
  }, [selectedLanguage]);

  // handle login press (to be implemented)
  const handleLoginPress = () => {
    if (!phone) {
      setError(t('loginScreen.emptyPhone'));
    } else {
      setError('');
      const cleanedPhone = phone.replace(/^0/, '');
      const string = flag + cleanedPhone;
      const phoneNumber = string.replace(/[^\d+]/g, '');
      console.log(phoneNumber);
      setModalVisible(true)
    }
  };

  

  return (
    <View style={COMPONENT_STYLES.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={{flexDirection:'row'}}>
        <View style={{flex:1}}/>
        <DropdownLanguangeComponent
          // label={t('loginScreen.placeholderEmail')}
          items={languageItems}
          value={languageItems.find((e)=> e.value === selectedLanguage).label}
          iconName={"caret-down-outline"}
          onValueChange={setSelectedLanguage}
        />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Image source={require('../../assets/logo2.png')} style={{ width: 200, height: 200 }} />
        <Image source={require('../../assets/opening.png')} style={{ width: width - 150, height: 240 }} />
      </View>
      <View style={{ flex: 1 }} />
      <Text style={[COMPONENT_STYLES.textLarge, { fontWeight: '600' }]}>{t('loginScreen.welcome')}</Text>
      <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600' }]}>{t('loginScreen.welcomeSub')}</Text>
      <View style={COMPONENT_STYLES.spacer} />
      <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: '600' }]}>{t('loginScreen.phoneLabel')}</Text>
      <View style={{ flexDirection: 'row' }}>
        <DropdownFlagComponent
          // label={t('loginScreen.placeholderEmail')}
          items={flagItems}
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
      <ModalDown isVisible={modalVisible} setModalVisible={setModalVisible} navigasi={()=> navigation.navigate("Verifikasi")}/>
    </View>
  );
};

const styles = StyleSheet.create({
  box:{
    width: 100,
    height: 100,
    backgroundColor: "#9911ff",
    borderRadius: 5,
  }
});

export default LoginScreen;
