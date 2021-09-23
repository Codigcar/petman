import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { validateAll } from 'indicative/validator';
import React, { useLayoutEffect, useState, useEffect, useReducer } from 'react';
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
import { Icon, Input, AirbnbRating, SearchBar, Avatar } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Button, HeaderLeft, HeaderRight, Divider, InputText } from '../../../components';
import Carousel from 'react-native-snap-carousel';
import { fetchPOST } from '../../../utils/functions';
import PetSelectScreen from './PetSelectScreen';

const Stack = createStackNavigator();

export default function StartHomeScreen({ navigation, route }) {
    // console.log('StartHomeScreen: ' + JSON.stringify(navigation) + ' || ' + JSON.stringify(route))
    // console.log('PET: ' + Constant.GLOBAL.PET.ID)

    const [updateAddress, setUpdateAddress] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    const chooseScreen = (navigateTo) => {
        let arr = [];

        console.log('NAGITATION_TO: ' + JSON.stringify(navigateTo));
        switch (navigateTo) {
            case 'LOAD_INITIAL':
                arr.push(
                    <Stack.Screen
                        name="StartHome"
                        component={HomeScreen}
                        initialParams={{ userRoot: route.params.userRoot }}
                        options={{
                            headerTitle: null,
                            headerStyle: Styles.headerBarStyle,
                            headerLeft: () => (
                                <HeaderLeft navigation={navigation} userRoot={route.params.userRoot} setUpdateAddress={setUpdateAddress} />
                            ),
                            headerRight: () => (
                                <HeaderRight navigation={navigation} userRoot={route.params.userRoot}  setUpdateAddress={setUpdateAddress} />
                            ),
                        }}
                    />
                );
                break;
            case 'LOAD_PET':
                arr.push(
                    <Stack.Screen
                        name="PetSelectScreen"
                        component={PetSelectScreen}
                        initialParams={{ userRoot: route.params.userRoot }}
                    />
                );
                break;
            default:
                break;
        }
        return arr[0];
    };

    return (
        <Stack.Navigator>{chooseScreen(Constant.GLOBAL.PET.ID == 0 ? "LOAD_PET" : "LOAD_INITIAL")}</Stack.Navigator>
    );
}

function HomeScreen({ navigation, route }) {
    let SIZE = 100;
    // console.log('StartHomeScreen HomeScreen: ' + JSON.stringify(route));
    const [services, setServices] = useState([]);
    const [items, setItems] = useState([]);
    const [value, setValue] = useState("");

    useEffect(() => {
        fetchPOST(Constant.URI.SERVICES_LIST, null, function (response) {
            if (response.CodigoMensaje == 100) {
                setServices(response.Data);
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        })

        fetchPOST(Constant.URI.VET_VISITED_LIST, {
            "ccl_idcliente": route.params.userRoot.CCL_IdCliente,
            "i_vta_longitud": "0",
            "i_vta_latitud": "0"
        }, function (response) {
            if (response.CodigoMensaje == 100) {
                setItems(response.Data);
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        })
    }, []);


    useFocusEffect(
        React.useCallback(() => {
            fetchPOST(Constant.URI.VET_VISITED_LIST, {
                "ccl_idcliente": route.params.userRoot.CCL_IdCliente,
                "i_vta_longitud": "0",
                "i_vta_latitud": "0"
            }, function (response) {
                if (response.CodigoMensaje == 100) {
                    setItems(response.Data);
                } else {
                    Alert.alert('', response.RespuestaMensaje);
                }
            })
        }, [])
    );

    const renderCarouselItem = ({ item, index }) => {
        // console.log('SV_NombreServicio: ', item.SV_NombreServicio);
        // console.log('SV_IdServicio: ', item.SV_IdServicio);
        const { SV_IdServicio, SV_NombreServicio, SV_RutaImagen } = item;
        return (
            <TouchableOpacity
                // activeOpacity={.8}
                style={{ height: 120, width: 80, alignItems: "center", justifyContent: "center"}}
                onPress={() => {
                    console.log('item presionado carousel: ',item[index]);
                    console.log('SV_NombreServicio: ',SV_NombreServicio);
                    navigation.navigate('BathScreen', { userRoot: route.params.userRoot, SV_IdServicio, SV_NombreServicio });
                }}
            >
                <View style={{ height: 100, width: 80, alignItems: "center"}}>
                    <Avatar
                        size={60}
                        rounded
                        source={{ uri: SV_RutaImagen }}
                    />
                    <Text style={[Styles.textOpaque, { fontSize: 12, textAlign: "center", width: 80, height: 40, marginTop: 8 }]}>{SV_NombreServicio}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderRating = (ratingCount, imageSize, rating) => {
        let images = []
        if (rating == 0) { rating = 1; }
        for (let index = 1; index <= ratingCount; index++) {
            images.push(
                <Image
                    key={index}
                    style={{ width: imageSize, height: imageSize, marginRight: 2 }}
                    source={index <= rating ? Constant.GLOBAL.IMAGES.RATING_STAR : Constant.GLOBAL.IMAGES.RATING_STAR_INACTIVE}
                    resizeMode="contain"
                />
            )
        }

        return (
            <View style={[{ flexDirection: "row", justifyContent: "center" }]}>
                {images}
            </View>
        );
    }

    return (
        <FlatList
            data={items}
            keyExtractor={(item, index) => String.valueOf(item.VTA_IdVeterinaria) + `${index}`}
            ListHeaderComponent={
                <View>
                    <View>
                        <View style={{ height: 60, margin: 5, marginTop: 15, marginBottom: 0, paddingBottom: 0}}>
                            <Input
                                placeholder='Buscar veterinaria'
                                leftIcon={{ type: 'ionicon', name: 'search-outline', color: Styles.colors.gris, style: { paddingHorizontal:10}, size:20 }}
                                inputContainerStyle={{ borderWidth: 1, borderColor: Styles.colors.gris, borderRadius: 10, padding:0 }}
                                inputStyle={[Styles.textOpaque, {fontSize:16, padding:0, margin:0}]}
                                errorStyle={{ height: 0 }}
                                onChangeText={setValue}
                                // autoCorrect={false}
                                value={value}
                            />
                        </View>
                        <View style={{ height: 120 }}>
                            <Carousel
                                data={services}
                                renderItem={renderCarouselItem}
                                sliderWidth={Constant.DEVICE.WIDTH}
                                itemWidth={(Constant.DEVICE.WIDTH / 4)}
                                contentContainerCustomStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                inactiveSlideScale={1}
                                inactiveSlideOpacity={1}
                                enableMomentum={false}
                                enableSnap={true}
                                slideStyle={{ alignItems: "center" }}
                                removeClippedSubviews = {false}
                            />
                        </View>
                        <Divider style={{ height: 10, backgroundColor: Styles.colors.defaultBackground }} />
                    </View>

                    <View style={{ height: 35, marginLeft: 15, justifyContent: "center" }}>
                        <Text style={StyleSheet.flatten([Styles.textBoldOpaque, { fontSize: 20 }])}>Veterinarias visitadas</Text>
                    </View>
                </View>
            }
            ListHeaderComponentStyle={{ backgroundColor: Styles.colors.background }}
            style={{ backgroundColor: Styles.colors.background }}
            renderItem={({ item, index }) =>
                <>
                    {(value.length == 0 || item.VTA_NombreVeterinaria.toUpperCase().indexOf(value.toUpperCase()) > -1)
                        ?
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => {
                                console.log(item);
                                navigation.navigate('ProductScreen', { userRoot: route.params.userRoot, veterinary: item });
                            }}
                        >
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ width: SIZE + 10 }} >
                                    <Image style={{ width: SIZE, height: SIZE, resizeMode: "cover" }}
                                        source={{ uri: item.VTA_NombreFoto }}
                                    />
                                </View>
                                <View style={{ justifyContent: "space-evenly", width: Constant.DEVICE.WIDTH - (SIZE + 30), paddingRight: 10 }}>
                                    <View>
                                        <Text style={[Styles.textBoldOpaque, { fontSize: 14 }]}>{item.VTA_NombreVeterinaria}</Text>
                                        <View style={{ alignItems: "flex-start" }}>
                                            {renderRating(5, 15, parseInt(item.VTA_Ranking))}
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon name='clock-time-three-outline' type='material-community' size={15} color={Styles.colors.lightGrey} style={{ marginRight: 5, marginLeft: 0 }} />
                                            <Text style={[Styles.textLightGrey, { fontSize: 14 }]}>{item.VTA_Horario}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <Icon name='home-outline' type='material-community' size={15} color={Styles.colors.lightGrey} style={{ marginRight: 5, marginLeft: 0 }} />
                                            <Text style={[Styles.textLightGrey, { fontSize: 14 }]}>{item.VTA_Distancia} {item.VTA_Distancia_Unidad}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <Divider />
                        </TouchableOpacity>
                        : null
                    }
                </>
            }
        />
    );
}

const styles = StyleSheet.create({
});