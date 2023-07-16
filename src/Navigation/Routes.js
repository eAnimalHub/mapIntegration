import React from 'react';
// import {createNativeStackNavigator,TransitionPresets} from '@react-navigation/native-stack';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';

import {NavigationContainer} from '@react-navigation/native';

import {LiveUsers, MapView} from '../Screens';
import {View, SafeAreaView} from 'react-native';
import colors from '../colors';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import  Home  from '../Screens';
// import  Profile  from '../Screens';

const Stack = createStackNavigator();

// import Toast from 'react-native-toast-message';

function Routes(navigation) {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LiveUsers"
          screenOptions={{
            animationEnabled: true,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            ...TransitionPresets.SlideFromRightIOS,
            headerShown: false,
            headerMode: 'screen',
          }}>
          <Stack.Screen name="LiveUsers" component={LiveUsers} />
          <Stack.Screen name="MapView" component={MapView} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default Routes;
