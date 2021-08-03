import React, { useLayoutEffect, useState, useEffect, useReducer } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
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
import { Icon, Input, AirbnbRating, SearchBar, Avatar, ListItem } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Button, HeaderBackLeft, HeaderRight, Divider, InputText } from '../../../components';
import { fetchPOST } from '../../../utils/functions';
import { DataScreen, ContactScreen } from './';
import AsyncStorage from '@react-native-community/async-storage';

const DATA = [
  {
    title: 'Datos personales',
    name: "SettingsDataScreen",
    screen: DataScreen,
    icon: "account-outline",
    icon_type: "material-community",

  },
  {
    title: 'Contacto',
    name: "SettingsContactScreen",
    screen: ContactScreen,
    icon: "phone",
    icon_type: "material-community",

  },
  {
    title: 'Cerrar sesión',
    name: "Signout",
    icon: "logout",
    icon_type: "material-community",
  }
];

export default function SettingsHomeScreen({ navigation, route }) {

  // const getToken2 = async() => {
  //   const usuario = await AsyncStorage.getItem('usuario');
  //   const password = await AsyncStorage.getItem('password');
  //   console.log('password: ',password);
  //   console.log('usuario: ',usuario);

  // }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsHome"
        component={HomeScreen}
        initialParams={{ userRoot: route.params.userRoot }}
        options={{
          title: 'Mi Perfil',
          headerStyle: Styles.headerBarStyle,
          headerTitleStyle: Styles.headerTitleStyle,
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerLeft: () => (
            <HeaderBackLeft navigation={navigation} />
          ),
          headerRight: () => (
            <HeaderRight navigation={navigation} userRoot={route.params.userRoot} />
          ),
        }} />
      <Stack.Screen
        name="SettingsDataScreen"
        component={DataScreen}
        initialParams={{ userRoot: route.params.userRoot }}
      />
      <Stack.Screen
        name="SettingsContactScreen"
        component={ContactScreen}
        initialParams={{ userRoot: route.params.userRoot }}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation, route }) {
  const [network, setNetwork] = useState(null);

  const renderItem = (item) => {
    return (
      <ListItem onPress={() => navigation.navigate(item.name)} bottomDivider>
        <Icon name={item.icon} type={item.icon_type} size={26} color={Styles.colors.opaque} />
        <ListItem.Content>
          <ListItem.Title style={[Styles.textOpaque, { fontSize: 18 }]} >{item.title}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron size={24} />
      </ListItem>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.headerSubContainer}>
            <Text style={styles.headerTitle}>Hola</Text>
            <Text style={styles.headerSubTitle}>{`${route.params.userRoot.CCL_Nombre} ${route.params.userRoot.CCL_ApePaterno}`}</Text>
          </View>
          <Avatar
            size={90}
            containerStyle={{ margin: 5, padding: 3 }}
            imageProps={{ resizeMode: "contain" }}
            source={Constant.GLOBAL.IMAGES.LOGO}
          />
        </View>
        <View>
          <FlatList
            data={DATA}
            renderItem={({ item }) => renderItem(item)}
            keyExtractor={item => item.name}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: "column",
    justifyContent: "space-between"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: Styles.colors.opaque,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    })
  },
  headerSubContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 5
  },
  headerTitle: {
    fontFamily: Styles.fontBlinkerRegular,
    fontSize: 20,
    color: Styles.colors.secondary
  },
  headerSubTitle: {
    fontFamily: Styles.fontBlinkerBold,
    fontSize: 20,
    color: Styles.colors.opaque
  },
});