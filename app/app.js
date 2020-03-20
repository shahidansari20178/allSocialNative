import React from 'react';
import DrawerNavigator from './Navigator/drawerNavigator';
import {enableScreens} from 'react-native-screens';
import {NavigationContainer} from '@react-navigation/native';
const RootNavigator = () => {
  enableScreens();

  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};
export default RootNavigator;
