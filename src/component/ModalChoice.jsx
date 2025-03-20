import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Modal, PanResponder } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, FONT_FAMILIES, COMPONENT_STYLES } from '../lib/constants';
import { Motion } from "@legendapp/motion"
import { ButtonComponent, ButtonSecondaryComponent } from './ButtonComponent';
import { useTranslation } from 'react-i18next';
import RadioButtonChoiceGroup from './RadioButtonChoiceComponent';
import DropdownComponent from './DropdownComponent';
import DropdownLanguangeComponent from './DropdownLanguangeComponent';
import DropdownSearchComponent from './DropdownSearchComponent';

const { width, height } = Dimensions.get('window');

const options = [
  {
    label: 'TrasRide',
    value: 'TR',
    icon: require("../assets/trasride/motor.png"),
    time: '20 min',
    price: 15000,
    discount: 1000,
    desc: 'cepat sampai tujuan'
  },
  {
    label: 'TrasRide XL',
    value: 'TRX',
    icon: require("../assets/trasride/motorxl.png"),
    time: '20 min',
    price: 18000,
    discount: 0,
    desc: 'jok besar yang bikin nyaman'
  },
  {
    label: 'TrasCar',
    value: 'TC',
    icon: require("../assets/trasride/mobil.png"),
    time: '20 min',
    price: 24000,
    discount: 3000,
    desc: 'gak kehujanan hati senang'
  },
  {
    label: 'TrasCar XL',
    value: 'TCX',
    icon: require("../assets/trasride/mobilxl.png"),
    time: '20 min',
    price: 32000,
    discount: 0,
    desc: 'bisa muat banyak'
  }
];

const languageItems = [
  { label: 'Tunai', value: 'tn' },
  { label: 'Traspay', value: 'tp' },
  { label: 'Gopay', value: 'gp' },
  { label: 'ShoopePay', value: 'sp' },
  { label: 'OVO', value: 'ov' },
];

const promo = [
  { label: 'Kode Promo', value: 's' },
  { label: 'Hemat Ride', value: 'XBXDCD' },
  { label: 'Hemat Car', value: 'XBXDCDA' },
];

const ModalChoice = ({ value, isVisible, setModalVisible, navigasi }) => {
  const { t } = useTranslation();
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[0].value);
  const [animateChoice, setanimateChoice] = useState(false);
  const [kodePromo, setkodePromo] = useState('s');
  const [payment, setpayment] = useState('tn');

  // Trigger the animation 0.5 seconds after the modal becomes visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimateModal(true);
      }, 100); // 0.5 seconds delay
      return () => clearTimeout(timer); // Clean up the timer if the modal visibility changes before the timeout
    } else {
      setAnimateModal(false); // Reset animation when modal is closed
    }
  }, [isVisible]);

  const cancelButton = () => {
    setAnimateModal(false);
    const timer = setTimeout(() => {
      setModalVisible(false)
    }, 200); // 0.5 seconds delay
    return () => clearTimeout(timer);
  }

  const handleSelect = (option) => {
    setSelectedValue(option.value);
  };

  const handleNavigasi = () => {
    cancelButton()
    const timer = setTimeout(() => {
      navigasi()
    }, 200); // 0.5 seconds delay
    return () => clearTimeout(timer);
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true, // Always respond to touch events
    onMoveShouldSetPanResponder: (evt, gestureState) => true, // Respond when the gesture moves
    onPanResponderMove: (evt, gestureState) => {
      // Gesture state contains the movement of the touch (in px)
      const { dy } = gestureState;  // dy is the vertical movement of the touch
      if (dy > 50) {
        setanimateChoice(false)
      } else if (dy < -50) {
        setanimateChoice(true)
      }
    },
  });

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Motion.View
          {...panResponder.panHandlers}
          initial={{ y: 0 }}
          animate={{ x: 0, y: animateChoice ? -1.3 * 100 : 2 * 100 }} // Use the animateModal state for triggering animation
          whileHover={{ scale: 1.2 }}
          whileTap={{ y: 20 }}
          transition={{ type: 'spring' }}
          style={styles.modalAnimate}
        >
          <View style={styles.modalComponent} >
            <View style={{ alignItems: 'center', margin: 10 }}>
              <View style={{ width: 50, height: 3, backgroundColor: '#00000050' }} />
            </View>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: '600', textAlign: 'center' }]}>{t('modalChoice.PilihKendaraan')}</Text>
            <View style={COMPONENT_STYLES.spacer} />
            <RadioButtonChoiceGroup
              options={options}
              selectedValue={selectedValue}
              onSelect={handleSelect}
            />
          </View>
        </Motion.View>
        <Motion.View
          initial={{ y: 0 }}
          animate={{ x: 0, y: animateModal ? 0 * 100 : 4 * 100 }} // Use the animateModal state for triggering animation
          whileHover={{ scale: 1.2 }}
          whileTap={{ y: 20 }}
          transition={{ type: 'spring' }}
          style={styles.modalAnimate}
        >
          <View style={styles.modalComponentBottom} >
            <View style={COMPONENT_STYLES.spacer} />
            <View style={COMPONENT_STYLES.spacer} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <DropdownLanguangeComponent
                  items={languageItems}
                  value={languageItems.find((e) => e.value === payment).label}
                  iconName={"chevron-forward-outline"}
                  onValueChange={setpayment}
                />
              </View>
              <View style={COMPONENT_STYLES.spacer} />
              <View style={COMPONENT_STYLES.spacer} />
              <View style={COMPONENT_STYLES.spacer} />
              <View style={COMPONENT_STYLES.spacer} />
              <View style={COMPONENT_STYLES.spacer} />
              <View style={{ flex: 1 }}>
                <DropdownSearchComponent
                  items={promo}
                  value={kodePromo}
                  iconName={"pricetags-outline"}
                  onValueChange={setkodePromo}
                />
              </View>
            </View>
            <View style={COMPONENT_STYLES.spacer} />
            <View style={COMPONENT_STYLES.spacer} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <ButtonComponent
                  title={t('button.pesan')}
                  onPress={cancelButton}
                />
              </View>
            </View>
          </View>
        </Motion.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 50,
  },
  modalAnimate: {
    position: 'absolute',
    bottom: 0, // Position it at the bottom
    left: 0,
    right: 0,
  },
  modalComponent: {
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  modalComponentBottom: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#00000030',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    elevation: 1
  }
});

export default ModalChoice;
