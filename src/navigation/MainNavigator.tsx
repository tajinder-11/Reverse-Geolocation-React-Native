import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import Geocoding from '../screens/MainAppScreens/Geocoding';
import Users from '../screens/MainAppScreens/Users';
import {SCREEN_NAMES} from '../utilities/constants';

const MainStack = createStackNavigator();

interface MainNavigatorProps {}

const MainNavigator: React.FC<MainNavigatorProps> = () => (
  <MainStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <MainStack.Screen name={SCREEN_NAMES.GeocodingScreen} component={Geocoding} />
    <MainStack.Screen name={SCREEN_NAMES.UsersScreen} component={Users} />
  </MainStack.Navigator>
);

export default MainNavigator;
