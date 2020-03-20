// import React from 'react';
// import SignIn from '../Screens/SignIn';
// import SignUp from '../Screens/SignUp';
// import DrawerNavigator from '../Navigator/drawerNavigator';
// import {TransitionPresets} from '@react-navigation/stack';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// const Stack = createNativeStackNavigator();
// const config = {
//   animation: 'spring',
//   config: {
//     stiffness: 1000,
//     damping: 500,
//     mass: 3,
//     overshootClamping: true,
//     restDisplacementThreshold: 0.01,
//     restSpeedThreshold: 0.01,
//   },
// };
// const RootNavigator = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         gestureEnabled: true,
//         cardOverlayEnabled: true,
//         headerShown: false,
//         ...TransitionPresets.ModalTransition,
//         animationTypeForReplace: 'pop',
//       }}
//       options={{
//         transitionSpec: {
//           open: config,
//           close: config,
//         },
//       }}>
//       <Stack.Screen name="SignIn" component={SignIn} />
//       <Stack.Screen name="SignUp" component={SignUp} />
//       <Stack.Screen name="Home" component={DrawerNavigator} />
//     </Stack.Navigator>
//   );
// };
// export default RootNavigator;
