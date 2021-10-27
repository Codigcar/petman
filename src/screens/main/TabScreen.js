import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from 'react-native';
import { AuthContext } from '../../components/authContext';
import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { Icon } from 'react-native-elements';
import { StartHomeScreen, PetsHomeScreen, ConnectHomeScreen, MyOrdersHomeScreen, BathScreen, ProductScreen, PaymentScreen, SettingsHomeScreen } from '../main';
import { Styles } from '../../assets/css/Styles';
import Constant from '../../utils/constants';
import { fetchPOST } from '../../utils/functions';
import StartHomeAdminScreen from '../admi/StartHomeAdminScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const sizeBottomIcon = 30;

export default function TabScreen({ navigation, route }) {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={{ userRoot: route.params.userRoot }}
      />
      <Stack.Screen
        name="ProductScreen"
        component={ProductScreen}
      />
      <Stack.Screen
        name="StartHomeAdminScreen"
        component={StartHomeAdminScreen}
      />
      <Stack.Screen
        name="BathScreen"
        component={BathScreen}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
      />
      <Stack.Screen
        name="SettingsHomeScreen"
        component={SettingsHomeScreen}
      />
      {/* <Stack.Screen
        name="MapHomeScreen"
        component={MapHomeScreen}
      /> */}
      <Stack.Screen
        name="Signout"
        component={Logout}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation, route }) {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      initialRouteName="StartHomeScreen"
      tabBarOptions={{
        showLabel: false
      }}
    >
      <Tab.Screen
        name="StartHomeScreen"
        component={StartHomeScreen}
        initialParams={{ userRoot: route.params.userRoot }}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                style={{ width: 30, height: 30 }}
                source={focused
                  ? Constant.GLOBAL.IMAGES.ICON_FOOTER_HOME
                  : Constant.GLOBAL.IMAGES.ICON_FOOTER_HOME_INACTIVE}
              />
            );
          }
        }}
        listeners={{
          tabPress: e => {
            e.preventDefault();
            console.log('presionado');
            fetchPOST(Constant.URI.PET_LIST, {
              "i_ccl_idcliente": route.params.userRoot.CCL_IdCliente
            }, function (response) {
              if (response.CodigoMensaje == 100 || response.CodigoMensaje == 0) {
                console.log('Mascotas: ' + response.Data.length);
                if (response.Data.length <= 0) {
                  navigation.navigate('PetsHomeScreen', { userRoot: route.params.userRoot });
                } else {
                  navigation.navigate('StartHomeScreen', { userRoot: route.params.userRoot });
                }
              } else {
                Alert.alert('', response.RespuestaMensaje);
              }
            })
          },
        }}
      />
      <Tab.Screen
        name="PetsHomeScreen"
        component={PetsHomeScreen}
        initialParams={{ userRoot: route.params.userRoot }}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                style={{ width: 30, height: 30 }}
                source={focused
                  ? Constant.GLOBAL.IMAGES.ICON_FOOTER_PET
                  : Constant.GLOBAL.IMAGES.ICON_FOOTER_PET_INACTIVE}
              />
            );
          }
        }}
      />
      {/* <Tab.Screen //TODO: Comentado por el momento.
        name="ConnectHomeScreen"
        component={ConnectHomeScreen}
        initialParams={{ userRoot: route.params.userRoot, pet: route.params.pet }}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                style={{ width: 30, height: 30 }}
                source={focused
                  ? Constant.GLOBAL.IMAGES.ICON_FOOTER_CONNECT
                  : Constant.GLOBAL.IMAGES.ICON_FOOTER_CONNECT_INACTIVE}
              />
            );
          }
        }}
      /> */}
      <Tab.Screen
        name="MyOrdersHomeScreen"
        component={MyOrdersHomeScreen}
        initialParams={{ userRoot: route.params.userRoot }}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                style={{ width: 40, height: 30 }}
                source={focused
                  ? Constant.GLOBAL.IMAGES.ICON_FOOTER_ORDER
                  : Constant.GLOBAL.IMAGES.ICON_FOOTER_ORDER_INACTIVE}
              />
            );
          }
        }}
      />

    </Tab.Navigator>
  );
}

function Logout({ navigation }) {
  const { signOut } = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  useEffect(
    () => navigation.addListener('focus', () => signOut()),
    []
  );

  return <></>;
}