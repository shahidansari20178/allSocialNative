import {DrawerItem, createDrawerNavigator} from '@react-navigation/drawer';
import React, {ReactElement} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import Home from '../Screens/Home';
const Drawer = createDrawerNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
function CustomDrawerContent({drawerPosition, navigation}): ReactElement {
  return (
    <ScrollView style={styles.container}>
      <DrawerItem
        label="Home"
        onPress={(): void => {
          navigation.navigate('Home');
        }}
      />
      <DrawerItem
        label="Profile"
        onPress={(): void => {
          navigation.navigate('Profile');
        }}
      />
      <DrawerItem
        label="Edit"
        onPress={(): void => {
          navigation.navigate('Edit');
        }}
      />
      <DrawerItem
        label="Logout"
        onPress={(): void => {
          navigation.navigate('SignIn');
        }}
      />
    </ScrollView>
  );
}
function Navigator(): ReactElement {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props): ReactElement => (
        <CustomDrawerContent {...props} />
      )}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}
export default Navigator;
