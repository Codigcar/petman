import { createStackNavigator } from '@react-navigation/stack';
import { validateAll } from 'indicative/validator';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
    useRoute,
    useNavigationState,
} from '@react-navigation/native';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    ImageBackground,
    TouchableOpacity, TouchableHighlight,
    FlatList, Pressable
} from 'react-native';
import { Icon, Rating, AirbnbRating, Divider, SearchBar, Avatar, Accessory } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Carousel, Button, HeaderBackLeft, HeaderRight, DropDownPicker, Input } from '../../../components';
import InputMask from '../../../components/InputMask';
import { fetchPOST } from '../../../utils/functions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { PetProfileScreen, PetEvolutionScreen } from './'

const Tab = createMaterialTopTabNavigator();

export default function PetTabScreen({ navigation, route }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Tus mascotas',
            headerStyle: Styles.headerBarStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerLeft: () => (
                <HeaderBackLeft navigation={navigation} />
            )
        });
    }, [navigation]);

    return (
        <View style={{ flex:1, backgroundColor: Styles.colors.background }}>
            <View style={{ height: 130, width: Constant.DEVICE.WIDTH, justifyContent: "center" }}>
                <View style={{ position: "absolute", top: 15, left: 0, right: 20, bottom: 0, alignItems: "flex-end" }} >
                    <Image style={{ width: 22, height: 22, resizeMode: "cover" }}
                        source={{ uri: route.params.pet.SE_RutaSexoMascota }}
                    />
                </View>
                <View style={{ height: 105, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }} >
                    <Avatar
                        rounded
                        size={75}
                        source={{ uri: route.params.pet.MS_Foto }}
                    >
                        {/* <Avatar.Accessory name='camera-outline' type='ionicon' size={30} /> //TODO: Comentado hasta que este el tema de subir foto */}
                    </Avatar>
                    <Text style={[Styles.textOpaque, { fontSize: 18 }]}>{route.params.pet.MS_NombreMascota}</Text>
                </View>
            </View>
            <Tab.Navigator
                initialRouteName="PetProfileScreen"
                tabBarOptions={{
                    activeTintColor: Styles.colors.secondary,
                    inactiveTintColor: Styles.colors.opaque,
                    indicatorStyle: { backgroundColor: Styles.colors.secondary },
                    labelStyle: { fontSize: 14 }
                }}
            >
                <Tab.Screen
                    name="PetProfileScreen"
                    component={PetProfileScreen}
                    initialParams={{ userRoot: route.params.userRoot, pet: route.params.pet }}
                    options={{
                        tabBarLabel: ({ color }) => {
                            return <Text style={[Styles.textBoldOpaque, { fontSize: 14, color: color }]}>Perfil</Text>;
                        },
                    }}
                />
                <Tab.Screen
                    name="PetEvolutionScreen"
                    component={PetEvolutionScreen}
                    initialParams={{ userRoot: route.params.userRoot, pet: route.params.pet }}
                    options={{
                        tabBarLabel: ({ color }) => {
                            return <Text style={[Styles.textBoldOpaque, { fontSize: 14, color: color }]}>Evolución</Text>;
                        },
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}
