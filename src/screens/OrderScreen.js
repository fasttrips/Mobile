import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { getOrder } from '../api/functions';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const AccountScreen = () => {

  const [order, setorder] = useState([]);

  const fetchorderData = async () => {
    await getOrder().then(orderData => {
      if (orderData) {
        setorder(orderData);
      } else {
        console.log('No user data found');
      }
    });
  };

  useEffect(() => {
    fetchorderData();
    const intervalId = setInterval(() => {
      fetchorderData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (order.length === 0) {
    return (
      <View style={styles.containerLoading}>
        <Text style={styles.title}>Order</Text>
        <View style={{alignItems:'center', justifyContent:'center',flex:1, backgroundColor:'white'}}>
          <Text style={{ fontFamily: 'Montserrat-Regular' }}>Anda Belum Punya Orderan</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order</Text>
      <View style={{ flex: 1 }}>
        <FlatList
          data={order}
          keyExtractor={(item) => item.id}
          vertical
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={[{ marginBottom: index === order.length - 1 ? 20 : 0 }, styles.itemCard]}>
              <Text>{item.id}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerLoading: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#37AFE1',
    width: width,
    padding: 20,
    fontFamily: 'Montserrat-Regular'
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'Montserrat-Regular'
  },
  itemCard: { marginHorizontal: 20, marginTop: 20, backgroundColor: 'white', elevation: 1, padding: 30, borderRadius: 10 }
});

export default AccountScreen;
