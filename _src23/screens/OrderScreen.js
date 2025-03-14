import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { getDriver, getOrder } from '../api/functions';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const AccountScreen = () => {

  const [order, setorder] = useState([]);

  const fetchOrderData = async () => {
    try {
      const orderData = await getOrder();
      if (!orderData || orderData.length === 0) {
        console.log("No order data found");
        return;
      }

      // Ambil semua data driver secara paralel
      const updatedOrders = await Promise.all(
        orderData.map(async (item) => {
          if (item.idDriver !== "") {
            const driverData = await getDriver(item.idDriver);
            return { ...item, driver: driverData }; // Gabungkan driverData ke order item
          }
          return item;
        })
      );

      setorder(updatedOrders);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };


  useEffect(() => {
    fetchOrderData();
    const intervalId = setInterval(() => {
      fetchOrderData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (order.length === 0) {
    return (
      <View style={styles.containerLoading}>
        <Text style={styles.title}>Order</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white' }}>
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
              {item.status !== 0 &&
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <View>
                    <Text style={styles.textSub}>{item?.driver?.nameKendaraan}</Text>
                    <Text style={styles.textSub}>{item?.driver?.platNumber}</Text>
                  </View>
                  <View style={{justifyContent:"center",alignItems:'center'}}>
                    <Image source={{ uri: item?.driver?.photoDriver }} style={styles.image} />
                    <Text style={styles.textNormal}>{item?.driver?.name}</Text>
                  </View>
                </View>
              }
              {item.status === 0 &&
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <View>
                    <Text style={styles.textSub}>???</Text>
                    <Text style={styles.textSub}>...</Text>
                  </View>
                  <View style={{justifyContent:"center",alignItems:'center'}}>
                    <LottieView width={100} height={100} source={require('../asset/animation/search.json')} autoPlay loop />
                  </View>
                </View>
              }
              {item.status === 0 &&
                <Text style={styles.textSub2}>Mencari driver</Text>
              }
              {item.status === 1 &&
                <Text style={styles.textSub2}>Menuju lokasi</Text>
              }
              {item.status === 2 &&
                <Text style={styles.textSub2}>Driver sudah di tempat</Text>
              }
              {item.status === 3 &&
                <Text style={styles.textSub2}>Sedang diantar</Text>
              }
              <View style={{ margin: 10 }}></View>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 13 }}>{item.payment}: IDR {item.harga.toLocaleString("id-ID")}</Text>
              <View style={{ margin: 5 }}></View>

              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../asset/from.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 13 }}>{item.from.length > 40 ? `${item.from.substring(0, 40)}...` : item.from}</Text>
              </View>
              <View style={{ height: 1, backgroundColor: 'grey', marginVertical: 5 }}></View>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../asset/des.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 13 }}>{item.destination.length > 40 ? `${item.destination.substring(0, 40)}...` : item.destination}</Text>
              </View>
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
  textSub: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular'
  },
  textSub2: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    fontWeight:'bold'
  },
  textNormal: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
  },
  itemCard: { marginHorizontal: 20, marginTop: 20, backgroundColor: 'white', elevation: 1, borderRadius: 10, padding: 20 },
  image: {
    width:80,height:80,borderRadius:50
  }
});

export default AccountScreen;
