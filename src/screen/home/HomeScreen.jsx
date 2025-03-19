import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { BORDER_RADIUS, COLORS, COMPONENT_STYLES, SHADOW_CARD } from '../../lib/constants';


const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);

  const menu = [
    {
      items: "TrasRide",
      image: require("../../assets/trasride.png"),
      image2: require("../../assets/shape1.png")
    },
    {
      items: "TrasFood",
      image: require("../../assets/trasfood.png"),
      image2: require("../../assets/shape1.png")
    },
    {
      items: "TrasRent",
      image: require("../../assets/trasrent.png"),
      image2: require("../../assets/shape1.png")
    },
    {
      items: "TrasMove",
      image: require("../../assets/trasmove.png"),
      image2: require("../../assets/shape1.png")
    },
  ]
  return (
    <View style={[COMPONENT_STYLES.container, { padding: 0 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView contentContainerStyle={[COMPONENT_STYLES.scrollView]}>
        <Image source={require("../../assets/frame.png")} style={styles.imageBack} />
        <View style={{ alignItems: 'center' }}>
          <Image source={require("../../assets/logo3.png")} style={{ width: 100, height: 100 }} />
        </View>
        <Text style={[COMPONENT_STYLES.textLarge, { color: 'white' }]}>Selamat Datang</Text>
        <Text style={[COMPONENT_STYLES.textLarge, { color: 'white' }]}>Hilyathul Wahid</Text>
        <View style={styles.balanceBar}>
          <View>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>TrasPoint</Text>
            <Text style={[COMPONENT_STYLES.textMedium, { fontWeight: 600}]}>0 PTS</Text>
          </View>
          <View style={{alignItems:'center'}}>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>Level</Text>
            <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600}]}>Pemula</Text>
          </View>
        </View>
        <View style={styles.menuContainer}>
          {menu.map((item, index) => {
            return (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <View style={styles.shape} />
                <Image source={item.image} style={{ width: 50, height: 50 }} />
                <Text style={[COMPONENT_STYLES.textSmall, { fontWeight: 600 }]}>{item.items}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={COMPONENT_STYLES.spacer} />
        <View style={COMPONENT_STYLES.spacer} />
        <Text style={[COMPONENT_STYLES.textMedium]}>Informasi buat kamu</Text>
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
    backgroundColor:'#fff', 
    marginTop: 140, 
    borderRadius: BORDER_RADIUS.medium, 
    height:70,
    elevation:5,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    padding: 20
  }
});

export default HomeScreen;
