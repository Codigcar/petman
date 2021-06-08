import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
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
    FlatList
} from 'react-native';
import { Icon, Input, Rating, AirbnbRating, SearchBar, Avatar } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Carousel, Button, HeaderBackLeft, HeaderRight, Divider } from '../../../components';
import { fetchPOST } from '../../../utils/functions';
import PetTabScreen from './PetTabScreen';
import AddPetScreen from './AddPetScreen';

const Stack = createStackNavigator();

export default function PetsHomeScreen({ navigation, route }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ userRoot: route.params.userRoot }}
            />
            <Stack.Screen
                name="PetTabScreen"
                component={PetTabScreen} />
            <Stack.Screen
                name="AddPetScreen"
                component={AddPetScreen} />
        </Stack.Navigator>
    );
}

function HomeScreen({ navigation, route }) {
    let SIZE = 80;
    const [items, setItems] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Tus mascotas',
            headerStyle: Styles.headerBarStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerLeft: () => {
                if (items.length <= 0) {
                    return (<></>)
                }
                return (
                    <HeaderBackLeft navigation={navigation} />
                )
            }
        });
    }, [navigation, items]);

    useFocusEffect(
        React.useCallback(() => {
            fetchPOST(Constant.URI.PET_LIST, {
                "i_ccl_idcliente": route.params.userRoot.CCL_IdCliente
            }, function (response) {
                if (response.CodigoMensaje == 100 || response.CodigoMensaje == 0) {
                    setItems(response.Data);
                } else {
                    Alert.alert('', response.RespuestaMensaje);
                }
            })
        }, [])
    );

    return (
        <FlatList
            data={items}
            ListEmptyComponent={
                <View>
                    <View style={{ height: 80, paddingLeft: 20, justifyContent: "center" }}>
                        <Text style={[Styles.textBoldOpaque, { fontSize: 18, textAlign: "center" }]}>Por favor registrar una mascota</Text>
                    </View>
                </View>
            }
            ListFooterComponent={
                <View>
                    <Button
                        containerStyle={{ margin: 20 }}
                        buttonStyle={Styles.button.secondary}
                        title="+ nueva mascota"
                        onPress={() => navigation.navigate('AddPetScreen', { userRoot: route.params.userRoot })}
                    />
                </View>
            }
            keyExtractor={(item, index) => String.valueOf(item.VTA_IdVeterinaria) + `${index}`}
            style={{ backgroundColor: Styles.colors.background }}
            renderItem={({ item, index }) =>
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {
                        console.log(item);
                        navigation.navigate('PetTabScreen', { userRoot: route.params.userRoot, pet: item });
                        setItems([]);
                    }}
                >
                    <View style={{ flexDirection: "row", margin: 10 }}>
                        <View style={{ justifyContent: "center", alignItems: "center", width: SIZE + 10 }} >
                            <Avatar
                                rounded
                                size={SIZE}
                                source={{ uri: item.MS_Foto }}
                            />
                        </View>
                        <View style={{ justifyContent: "center", width: Constant.DEVICE.WIDTH - (SIZE + 30), paddingLeft: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text style={[Styles.textOpaque, { fontSize: 24 }]}>{item.MS_NombreMascota}</Text>
                                <Image style={{ width: 30, height: 30, resizeMode: "cover" }}
                                    source={{ uri: item.SE_RutaSexoMascota }}
                                />
                            </View>
                            <View style={{ marginTop: 10, marginBottom: 10 }}>
                                <Text style={[Styles.textLightGrey, { fontSize: 13 }]}>{item.MS_Descripcion1}</Text>
                                <Text style={[Styles.textLightGrey, { fontSize: 13 }]}>{item.MS_Descripcion2}</Text>
                            </View>
                        </View>
                    </View>
                    <Divider />
                </TouchableOpacity>
            }
        />
    );
}


const styles = StyleSheet.create({
});