import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text, Platform,
} from 'react-native';
import Header from '../Common/header';
import firebase from 'react-native-firebase';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../Helper/responsiveScreen';
const fcmToken = '@fcmToken';
const Home = props => {
  const [socialList, setSocialList] = useState([]);
  useEffect(async () => {

    firebase.database('socialAll').socialRef.limitToLast(1).once('value',(data)=> {
      payload.notification.title = data.val().title;
      payload.notification.body= data.val().socialSiteUrl;
    });
    axios
      .get(
        'https://us-central1-allsocial-51f6b.cloudfunctions.net/socialAll_Get_All_Provider',
      )
      .then(response => {
        setSocialList(response.data);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });

    let token = await AsyncStorage.getItem(fcmToken)
    if(!token){
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
        firebase
          .messaging()
          .getToken()
          .then(async fcmToken => {
            if (fcmToken) {
              await storeData(fcmToken);
              firebase
                .database()
                .ref("/users/")
                .push({
                  notification_token: fcmToken,
                  created_at: Date.now(),
                })
                .then(res => {
                  console.log(res);
                });
            } else {
              alert("user doesn't have a device token yet");
            }
          });
      } else {
        alert("no");
      }
    }

    const channel = new firebase.notifications.Android.Channel(
      'channelId',
      'Channel Name',
      firebase.notifications.Android.Importance.Max
    ).setDescription('A natural description of the channel');
    firebase.notifications().android.createChannel(channel);

// the listener returns a function you can use to unsubscribe
    firebase.notifications().onNotification((notification) => {
      if (Platform.OS === 'android') {
        const localNotification = new firebase.notifications.Notification({
          sound: 'default',
          show_in_foreground: true,
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .android.setChannelId('channelId') // e.g. the id you chose above
          .android.setColor('#000000') // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));

      } else if (Platform.OS === 'ios') {

        const localNotification = new firebase.notifications().Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .ios.setBadge(notification.ios.badge);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));

      }
    });
    firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
      //alert("foreground");
    });
    firebase.notifications().getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
      //  alert("background");
      });
  }, []);

  const storeData = async (token) => {
    try {
      await AsyncStorage.setItem(fcmToken, token);
    } catch (e) {
      // saving error
    }
  };

  const renderSocialList = ({item}) => {
    if (!item.isReachable) {
      return null;
    }
    return (
      <TouchableOpacity style={{borderWidth: 1, width: wp(40)}}>
        <Image
          style={{width: wp(30), height: wp(30)}}
          source={{uri: `data:image/gif;base64,${item.socialSiteImageUri}`}}
        />
        <Text style={{textAlign: 'center'}}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Header navigation={props.navigation} title={'Home'} />
        <FlatList
          data={socialList}
          renderItem={renderSocialList}
          keyExtractor={item => item.id}
          numColumns={2}
        />
      </SafeAreaView>
    </>
  );
};

export default Home;
