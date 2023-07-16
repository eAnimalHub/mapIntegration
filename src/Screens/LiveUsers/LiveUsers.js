import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import colors from '../../colors';
const {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Switch,
} = require('react-native');
import noNotification from '../../assets/locationView.png';
import fonts from '../../fonts';
import {openScreen} from '../../functions';
import mapLocation from '../../assets/mapLocation.png';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import {Context} from '../../../App';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LiveUsers = ({props, navigation, route}) => {
  const contextData = useContext(Context);
  const [isAnimating, setIsAnimating] = useState(true);
  const [state, setState] = useState({});
  const [isLocationLive, setIsLocationLive] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isLatitude, setIsLatitude] = useState('');
  const [isLongitude, setIsLongitude] = useState('');
  const gotoMapScreen = () => {
    setIsAnimating(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setIsAnimating(false);
        openScreen(navigation, 'MapView', {lat: latitude, long: longitude});
      },
      error => {
        Toast.show({
          type: 'error',
          text1: 'Location Is Not Available!',
          text2:
            'Verify your internet connection or enable location from settings',
        });
        setIsAnimating(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .onSnapshot(documentSnapshot => {
        const fetchedData = documentSnapshot.docs.map(doc => doc.data());
        contextData.setUserList(fetchedData);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const fetchData = async () => {
    let asyncData = await AsyncStorage.getItem('isLocationLive');
    setIsLocationLive(JSON.parse(asyncData));
    if (JSON.parse(asyncData)) {
      setIntervalFun();
    }
    setState({...state});
    try {
      const response = await firestore().collection('Users').get();
      const fetchedData = response.docs.map(doc => doc.data());
      contextData.setUserList(fetchedData);
      setIsAnimating(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Database Not Accessable.',
        text2: 'Verify your internet connection.',
      });
      setIsAnimating(false);
    }
  };

  const checkLocationEnabled = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        saveAndUpdateDataOnStore(latitude, longitude);
      },
      error => {
        Toast.show({
          type: 'error',
          text1: 'Location Is Not Available!',
          text2:
            'Verify your internet connection or enable location from settings',
        });
        setIsAnimating(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const saveAndUpdateDataOnStore = async (lat, long) => {
    setIsLatitude(lat);
    setIsLongitude(long);
    let data = await firestore()
      .collection('Users')
      .where('phone_number', '==', '03068635828')
      .get();

    if (data.docs.length > 0) {
      const docRef = data.docs[0].ref;
      await docRef.update({'location.lat': lat, 'location.long': long});
      setIsLocationLive(true);
      await AsyncStorage.setItem('isLocationLive', true.toString());
      setIntervalFun();
    } else {
      firestore()
        .collection('Users')
        .add({
          name: 'Shahrob Abbas',
          phone_number: '03068635828',
          location: {lat: lat, long: long},
        })
        .then(() => {
          setIsLocationLive(true);
          AsyncStorage.setItem('isLocationLive', true.toString());
          setIntervalFun();
        });
    }
    setIsAnimating(false);
  };

  const setOffline = async () => {
    let data = await firestore()
      .collection('Users')
      .where('phone_number', '==', '03068635828')
      .get();
    const docRef = data.docs[0].ref;
    await docRef.delete();
    setIsLocationLive(false);
    AsyncStorage.setItem('isLocationLive', false.toString());
    setIsAnimating(false);
    clearInterval(intervalId);
    setIsLatitude('');
    setIsLongitude('');
  };

  const locationOnOffFunction = async () => {
    if (isLocationLive && !isAnimating) {
      setIsAnimating(true);
      setOffline();
    }
    if (!isLocationLive && !isAnimating) {
      setIsAnimating(true);
      checkLocationEnabled();
    }
  };
  const setIntervalFun = async () => {
    const id = setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          if (isLatitude == latitude && isLongitude == longitude) {
            saveAndUpdateDataOnStore(latitude, longitude);
          }
        },
        error => {},
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }, 10000);
    setIntervalId(id);
  };

  const userListItemView = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          openScreen(navigation, 'MapView', {
            lat: Number(item.location.lat),
            long: Number(item.location.long),
          });
        }}
        activeOpacity={1}
        style={
          index == 0
            ? {flex: 1, marginBottom: 7, marginTop: 10}
            : {flex: 1, marginVertical: 7}
        }>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{flex: 0.9, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.background,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: 14,
                  fontFamily: fonts.bold,
                }}>{`${item.name.substring(0, 2).toUpperCase()}`}</Text>
            </View>
          </View>
          <View style={{flex: 4.3, justifyContent: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  color: colors.black,
                  fontSize: 14,
                  marginHorizontal: 5,
                  flex: 1,
                }}
                numberOfLines={1}>
                {item.name}
              </Text>
              <View
                style={{
                  backgroundColor: 'green',
                  borderRadius: 10,
                  marginHorizontal: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    color: colors.white,
                    fontSize: 12,
                    marginHorizontal: 10,
                    marginVertical: 4,
                  }}>
                  Location Shared
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontFamily: fonts.medium,
                color: colors.black,
                fontSize: 13,
                marginHorizontal: 5,
              }}>
              {item.phone_number}
            </Text>
          </View>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: colors.background,
            marginTop: 12,
          }}></View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={style.container}>
      <View style={{height: 100, marginVertical: 10}}>
        <View style={{flex: 1, justifyContent: 'center', marginHorizontal: 15}}>
          <Text
            style={{
              color: colors.black,
              fontSize: 21,
              fontFamily: fonts.bold,
            }}>
            Welcome Home!
          </Text>
          <Text
            style={{
              color: colors.gray,
              fontSize: 14,
              fontFamily: fonts.medium,
              marginTop: 5,
            }}>
            Share your location with your community and have some fun!
          </Text>
        </View>
      </View>
      <View
        style={[
          {
            height: 60,
            backgroundColor: 'white',
            marginHorizontal: 15,
            marginVertical: 10,
            borderRadius: 8,
            // alignItems: 'center',
            // justifyContent: 'center',
          },
          style.shadow,
          {
            shadowOpacity: 0.7,
            elevation: 10,
            shadowColor: colors.gray,
            flexDirection: 'row',
          },
        ]}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            style={{
              color: colors.black,
              fontSize: 14,
              fontFamily: fonts.bold,
              marginHorizontal: 10,
            }}>
            Share Location
          </Text>
        </View>
        <View style={{justifyContent: 'center', marginHorizontal: 10}}>
          <Switch
            trackColor={{false: colors.silver, true: colors.red}}
            thumbColor={colors.white}
            ios_backgroundColor="#3e3e3e"
            onChange={locationOnOffFunction}
            value={isLocationLive}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <FlatList
            data={contextData.userList}
            contentContainerStyle={{paddingBottom: 80}}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() =>
              !contextData.userList.length &&
              isAnimating == false && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    backgroundColor: colors.white,
                  }}>
                  <Image
                    source={noNotification}
                    style={{
                      width: 250,
                      height: 250,
                      marginTop: '30%',
                      resizeMode: 'contain',
                    }}></Image>
                  <Text
                    style={{
                      fontSize: 15,
                      fontFamily: 'Quicksand-Bold',
                      marginTop: 12,
                      color: colors.black,
                      textAlign: 'center',
                    }}>
                    No Live Users At The Moment.
                  </Text>
                </View>
              )
            }
            renderItem={({item, index}) => (
              <View>{userListItemView(item, index)}</View>
            )}
          />
        </View>
      </ScrollView>
      <View
        style={[
          style.shadow,
          {
            position: 'absolute',
            bottom: 45,
            right: 45,
            width: 50,
            height: 50,
            backgroundColor: colors.white,

            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 5,
          },
        ]}>
        <TouchableOpacity onPress={gotoMapScreen}>
          <Image style={{width: 22, height: 22}} source={mapLocation} />
        </TouchableOpacity>
      </View>
      {isAnimating && (
        <ActivityIndicator
          size="large"
          color={colors.red}
          animating={isAnimating}
          style={style.loading}
        />
      )}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: colors.blackColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
export default LiveUsers;
