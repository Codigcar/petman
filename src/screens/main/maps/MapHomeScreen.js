// import React, { useLayoutEffect, useState, useEffect, useReducer } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import {
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   KeyboardAvoidingView,
//   ImageBackground,
//   TouchableOpacity,
//   FlatList,
//   SafeAreaView
// } from 'react-native';
// import { Icon, Input, AirbnbRating, SearchBar, Avatar, ListItem } from 'react-native-elements';
// import 'react-native-gesture-handler';
// import { Styles } from '../../../assets/css/Styles';
// import Constant from '../../../utils/constants';
// import { Button, HeaderBackLeft, HeaderRight, Divider, InputText } from '../../../components';
// import { fetchPOST } from '../../../utils/functions';
// import MapPlaceSearch from './MapPlaceSearch';
// import MapViewScreen from './MapViewScreen';

// export default class MapHomeScreen extends React.Component {
//   state = {
//     isMapReady: false,
//     region: {}
//   };

//   componentDidMount() {
//     this.props.navigation.setOptions({
//       title: 'Dirección',
//       headerStyle: Styles.headerBarStyle,
//       headerTitleStyle: Styles.headerTitleStyle,
//       headerTitleAlign: 'center',
//       headerBackTitleVisible: false,
//       headerLeft: () => (
//         <HeaderBackLeft navigation={this.props.navigation} />
//       ),
//       headerRight: () => (
//         <HeaderRight navigation={this.props.navigation} userRoot={this.props.route.params.userRoot} />
//       )
//     });
//     this.getInitialState();
//   }

//   getInitialState() {
//     this.setState({
//       region: {
//         latitude: 37.78825,
//         longitude: -122.4324,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421
//       }
//     });
//   }

//   getCoordsFromName(loc) {
//     console.log('getCoordsFromName: ' + JSON.stringify(loc))
//     this.setState({
//       region: {
//         latitude: loc.lat,
//         longitude: loc.lng,
//         latitudeDelta: 0.003,
//         longitudeDelta: 0.003
//       }
//     });
//   }

//   onMapRegionChange(region) {
//     // console.log('onMapRegionChange: ' + JSON.stringify(region));
//     this.setState({ region });
//   }

//   onMapLayout = () => {
//     this.setState({ isMapReady: true });
//   }

//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <MapPlaceSearch notifyChange={(loc) => this.getCoordsFromName(loc)} />
//         {this.state.region['latitude'] &&
//           <MapViewScreen
//             region={this.state.region}
//             onLayout={this.onMapLayout}
//             onRegionChange={(reg) => this.onMapRegionChange(reg)} />
//         }
//       </View >
//     );
//   }
// }

// const styles = StyleSheet.create({
// });