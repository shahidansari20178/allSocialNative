import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Menu from '../Assets/menu.png';
import {useNavigation, useRoute} from '@react-navigation/native';
const RootNavigator = props => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}
        onPress={() => navigation.openDrawer()}>
        <Image source={Menu} style={{height: 30, width: 30}} />
      </TouchableOpacity>
      <Text style={{flex: 7, textAlign: 'center', alignSelf: 'center'}}>
        {route.name}
      </Text>
    </View>
  );
};
export default RootNavigator;
