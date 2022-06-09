import { createStackNavigator } from '@react-navigation/stack';
import { validateAll } from 'indicative/validator';
import React, { useLayoutEffect, useState, useEffect } from 'react';
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
    FlatList, Pressable, Dimensions
} from 'react-native';
import { Icon, Rating, AirbnbRating, SearchBar, Avatar, Accessory, Overlay } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Carousel, Button, HeaderBackLeft, HeaderRight, DropDownPicker, Input, InputMask, Divider } from '../../../components';
import { fetchPOST } from '../../../utils/functions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RNPickerSelect from 'react-native-picker-select';
import * as Progress from 'react-native-progress';
import PetEvolutionDetailScreen from './PetEvolutionDetailScreen'

const Stack = createStackNavigator();

export default function PetEvolutionScreen({ navigation, route }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PetEvolutionHomeScreen"
                component={PetEvolutionHomeScreen}
                initialParams={{ userRoot: route.params.userRoot, pet: route.params.pet }}
            />
            <Stack.Screen
                name="PetEvolutionDetailScreen"
                component={PetEvolutionDetailScreen} />
        </Stack.Navigator>
    );
}

function PetEvolutionHomeScreen({ navigation, route }) {
    console.log('PetEvolutionScreen: ' + JSON.stringify(route));
    const [items, setItems] = useState([]);
    const [percentage, setPercentage] = useState({});

    useEffect(() => {
       
        fetchPOST(Constant.URI.PET_EVOLUTION_LIST, {
            "i_ms_idmascota": route.params.pet.MS_IdMascota
        }, function (response) {
            if (response.CodigoMensaje == 100) {
                setItems(response.Data);
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        })
        fetchPOST(Constant.URI.PET_EVOLUTION_PERCENTAGE, {
            "i_ms_idmascota": route.params.pet.MS_IdMascota
        }, function (response) {
            if (response.CodigoMensaje == 100) {
                setPercentage(response.Data[0]);
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        })
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
        });
    }, [navigation]);

    return (
        <FlatList
            data={items}
            ListHeaderComponent={
                <View>
                    {typeof percentage.CodigoMensaje === "undefined"
                        ? <></>
                        :
                        <View style={{ height: 40, margin: 20, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            {percentage.MS_FotoAvance == "" ? null :
                                <Avatar
                                    size={60}
                                    source={{ uri: percentage.MS_FotoAvance }}
                                />
                            }
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Text style={[Styles.textBoldOpaque, { fontSize: 12, color: Styles.colors.black, marginBottom: 5 }]}>{percentage.MS_MensajeAvance}</Text>
                                <Progress.Bar progress={Number((percentage.MS_PorcentajeAvance) / 100)}
                                    width={150} height={10}
                                    borderColor={Styles.colors.black}
                                    borderWidth={2}
                                    color={Styles.colors.cian}
                                />
                            </View>
                        </View>
                    }
                </View>
            }
            style={{ backgroundColor: Styles.colors.background, flex: 1 }}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index }) =>
                <View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 10, marginLeft: 20, marginRight: 20 }} >
                        <Avatar
                            size={60}
                            rounded
                            source={{ uri: item.SV_RutaImagen }}
                        />
                        <View>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 14 }]}>{item.SV_NombreServicio}</Text>
                            <Text style={[Styles.fontBlinkerRegular, { fontSize: 14, color: Styles.colors.gris }]}>{item.SV_UltimoServicio}</Text>
                            <Text style={[Styles.fontBlinkerRegular, { fontSize: 14, color: Styles.colors.gris }]}>{item.SV_ProximoServicio}</Text>
                        </View>
                        <Button
                            buttonStyle={[Styles.button.primary, { width: 80, height: 30, borderWidth: 1 }]}
                            titleStyle={{ fontSize: 13 }}
                            title="ver"
                            onPress={() => {
                                navigation.navigate('PetEvolutionDetailScreen', { userRoot: route.params.userRoot, pet: route.params.pet, services: item });
                            }}
                        />
                    </View>
                    <Divider />
                </View>
            }
        />
    );
}