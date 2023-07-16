import React, {useContext, useLayoutEffect, useState} from 'react';
import colors from '../../colors';
import MapView, {Marker} from 'react-native-maps';
import {Context} from '../../../App';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import BackIcon from '../../assets/back.png';

const {StyleSheet, View, SafeAreaView, Image} = require('react-native');

const MapViews = ({props, navigation, route}) => {
  const contextData = useContext(Context);
  const buBack = () => {
    navigation.goBack();
  };
  useLayoutEffect(() => {}, [contextData.userList]);

  return (
    <SafeAreaView style={style.container}>
      <View style={{flex: 1}}>
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: route.params.lat,
            longitude: route.params.long,
            latitudeDelta: 0.055,
            longitudeDelta: 0.0221,
          }}>
          {contextData.userList.map(marker => (
            <Marker
              //  key={marker.id}
              coordinate={{
                latitude: parseFloat(marker.location.lat),
                longitude: parseFloat(marker.location.long),
              }}
              title={marker.name}
            />
          ))}
        </MapView>
      </View>
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          position: 'absolute',
          top: 0,
        }}>
        <TouchableWithoutFeedback
          style={{flex: 1, justifyContent: 'center'}}
          onPress={buBack}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Image
              style={{marginLeft: 15, height: 28, width: 28}}
              source={BackIcon}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
export default MapViews;
