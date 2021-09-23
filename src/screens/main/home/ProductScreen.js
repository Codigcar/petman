import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Platform, TouchableHighlight, ScrollView, Pressable } from 'react-native';
import { Avatar, Icon, Overlay } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import { Button, Divider, HeaderBackLeft, HeaderRight } from '../../../components';
import OverlayCart from '../../../components/header/OverlayCart';
import Carousel from 'react-native-snap-carousel';
import Constant from '../../../utils/constants';
import { fetchPOST, addToCart } from '../../../utils/functions';

const Stack = createStackNavigator();
let ITEMS_BUYED = {};
let ID_SERVICE = 0;
let VET_BUY = null;

export default function ProductScreen({ navigation, route }) {
    // console.log('ProductScreen: ' + JSON.stringify(route))
    let SIZE = 75;
    const [services, setServices] = useState([]);
    const [items, setItems] = useState([]);
    const [visible, setVisible] = useState(false);
    const [rating, setRating] = useState([]);

    const _loadStorage = async () => {
        let _itemsBuyed = await AsyncStorage.getItem('@ITEMS_BUYED');

        console.log("LEYENDO EL STORAGE")
        console.log('@ITEMS_BUYED: ', JSON.stringify(_itemsBuyed))
        if (_itemsBuyed != null) {
            ITEMS_BUYED = JSON.parse(_itemsBuyed);
            VET_BUY = await AsyncStorage.getItem('@VET_BUY');
            console.log('@VET_BUY: ', VET_BUY)
        } else {
            ITEMS_BUYED = {};
            VET_BUY = null;
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.veterinary.VTA_NombreVeterinaria,
            headerStyle: Styles.headerBarStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerLeft: () => (
                <HeaderBackLeft navigation={navigation} >
                    <View style={{ position: "absolute", left: 10, top: 45 }}>
                        <Avatar
                            size={60}
                            rounded
                            source={{ uri: route.params.veterinary.VTA_NombreFoto }}
                            overlayContainerStyle={styles.image_vet}
                        />
                    </View>
                </HeaderBackLeft>
            ),
            headerRight: () => (
                <HeaderRight navigation={navigation} userRoot={route.params.userRoot} hideCount={true} />
            )
        });
    }, [navigation]);

    useEffect(() => {
        fetchPOST(Constant.URI.SERVICES_LIST, null, function (response) {
            if (response.CodigoMensaje == 100) {
                setServices(response.Data);
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        })
        ID_SERVICE = 0;
        searchVeterinaryProduct();
        _loadStorage();
    }, []);

    const searchVeterinaryProduct = () => {
        fetchPOST(Constant.URI.VET_PROD_LIST, {
            "i_vta_idveterinaria": route.params.veterinary.VTA_IdVeterinaria,
            "i_sv_idservicio": ID_SERVICE,
            "i_pr_idproducto": route.params.veterinary.PR_IdProducto
        }, function (response) {
            if (response.CodigoMensaje == 100) {
                setItems(response.Data);
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        })
    }

    const renderCarouselItem = ({ item, index }) => {
        // console.log('item: ' + JSON.stringify(item) + ' - index: ' + JSON.stringify(index));
        const { SV_IdServicio, SV_NombreServicio, SV_RutaImagen } = item;
        return (
            <TouchableOpacity
                activeOpacity={.8}
                style={{ height: 120, width: 80, alignItems: "center", justifyContent: "flex-end" }}
                onPress={() => {
                    ID_SERVICE = SV_IdServicio;
                    console.log(ID_SERVICE + " - " + SV_IdServicio);
                    searchVeterinaryProduct();
                }}
            >
                <View style={{ height: 100, width: 80, alignItems: "center" }}>
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

    function getTotalCount() {
        let count = 0;
        Object.keys(ITEMS_BUYED).map((key) => {
            count += ITEMS_BUYED[key]['CantidadProducto'];
            return count;
        });
        return count;
    }

    function getTotalAmount() {
        let amount = 0;
        Object.keys(ITEMS_BUYED).map((key) => {
            let { PR_MontoTotal, CantidadProducto } = ITEMS_BUYED[key];
            amount += PR_MontoTotal * CantidadProducto;
            return amount;
        });
        return amount;
    }

    const add = (product) => {
        console.log('ADD: ' + JSON.stringify(VET_BUY) + ' - ' + route.params.veterinary.VTA_IdVeterinaria)
        if (VET_BUY != null && VET_BUY != route.params.veterinary.VTA_IdVeterinaria) {
            Alert.alert('', 'Hola PetLover!!! Primero debes terminar tu pedido con la Veterinaria actual, luego podrás elegir productos de otra Veterinaria, Muchas Gracias!!!!');
        } else {
            ITEMS_BUYED = addToCart(product, false, route.params.veterinary.VTA_NombreVeterinaria, ITEMS_BUYED, route.params.veterinary.VTA_IdVeterinaria);
            searchVeterinaryProduct();
        }
    }

    const renderRating = (ratingCount, imageSize, value) => {
        if (rating.length <= 0) {
            if (value == 0) { value = 1; }
            for (let index = 1; index <= ratingCount; index++) {
                rating.push(
                    <Image
                        key={index}
                        style={{ width: imageSize, height: imageSize, marginRight: 5 }}
                        source={index <= value ? Constant.GLOBAL.IMAGES.RATING_STAR : Constant.GLOBAL.IMAGES.RATING_STAR_INACTIVE}
                        loadingIndicatorSource={Constant.GLOBAL.IMAGES.RATING_STAR_INACTIVE}
                        resizeMode="contain"
                    />
                )
            }
        }
        return (
            <View style={[{ marginLeft: 10, flexDirection: "row", justifyContent: "center" }]}>
                {rating}
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <OverlayCart
                navigation={navigation}
                visible={visible}
                backdropPress={() => { setVisible(false); _loadStorage(); searchVeterinaryProduct(); }}
                userRoot={route.params.userRoot}
                successPayment={() => { ITEMS_BUYED = {}; searchVeterinaryProduct(); }}
            />

            <View style={{ width: Constant.DEVICE.WIDTH, height: 45, justifyContent: "center", borderBottomWidth: .5, borderBottomColor: Styles.colors.gris, backgroundColor: Styles.colors.background }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginLeft: 80, marginRight: 20 }}>
                    {renderRating(5, 15, parseInt(route.params.veterinary.VTA_Ranking))}
                    <View style={{ flexDirection: "row" }}>
                        <Icon name='clock-time-three-outline' type='material-community' size={15} color={Styles.colors.opaque} style={{ marginRight: 5, marginLeft: 0 }} />
                        <Text style={[Styles.textLightGrey, { fontSize: 14 }]}>{route.params.veterinary.VTA_Horario}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Icon name='home-outline' type='material-community' size={15} color={Styles.colors.opaque} style={{ marginRight: 5, marginLeft: 0 }} />
                        <Text style={[Styles.textLightGrey, { fontSize: 14 }]}>{route.params.veterinary.VTA_Distancia} {route.params.veterinary.VTA_Distancia_Unidad}</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={items}
                keyExtractor={(item, index) => item + index}
                extraData={ITEMS_BUYED}
                ListHeaderComponent={
                    <View>
                        <View style={{ backgroundColor: Styles.colors.background }}>
                            <View style={{ height: 130 }}>
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
                        </View>
                        <Divider style={{ height: 10, backgroundColor: Styles.colors.defaultBackground }} />
                    </View>
                }
                style={{ backgroundColor: Styles.colors.background }}
                renderItem={({ item, index }) =>
                    <View>
                        <View style={{ flexDirection: "row", height: SIZE, width: Constant.DEVICE.WIDTH, margin: 15, marginBottom: 25 }}>
                            <View style={{ width: SIZE + 10, justifyContent: "center" }} >
                                <Image style={{ width: SIZE, height: SIZE, resizeMode: "cover", borderRadius: 10, marginTop: 5 }}
                                    source={{ uri: item.PR_NombreFoto }}
                                />
                            </View>
                            <View style={{ marginLeft: 5, width: Constant.DEVICE.WIDTH - (SIZE + 50) }}>
                                <View style={{}}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 30 }}>
                                        <Text style={[Styles.textBoldOpaque, { fontSize: 16 }]}>{item.PR_NombreProducto}</Text>
                                        {(typeof ITEMS_BUYED[item.VTA_IdVeterinaria + '-' + item.PR_IdProducto + '-' + Constant.GLOBAL.PET.ID] === "undefined")
                                            ? <></>
                                            :
                                            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "flex-end" }}>
                                                <View style={{ backgroundColor: Styles.colors.cian, width: 20, height: 20, alignItems: "center", justifyContent: "center", borderRadius: 5 }}>
                                                    <Text style={[Styles.textLightGrey, { color: Styles.colors.background, fontSize: 14 }]}>{ITEMS_BUYED[item.VTA_IdVeterinaria + '-' + item.PR_IdProducto + '-' + Constant.GLOBAL.PET.ID]['CantidadProducto']}</Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                    <Text style={[Styles.textLightGrey, { fontSize: 12, width: Constant.DEVICE.WIDTH - (SIZE + 80), height: 30 }]}>{item.PR_Descripcion}</Text>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={[Styles.textBoldOpaque, { fontSize: 12, color: Styles.colors.secondary }]}>Precio S/ {item.PR_MontoTotal === null ? 0.00 : item.PR_MontoTotal.toFixed(2)}</Text>
                                    <Button
                                        buttonStyle={[Styles.button.primary, { width: 80, height: 25, borderWidth: 1, padding: -10 }]}
                                        title="agregar"
                                        titleStyle={[Styles.textOpaque, { fontSize: 12, color: Styles.colors.black }]}
                                        onPress={() => { add(item) }}
                                        disabled={(typeof ITEMS_BUYED[item.VTA_IdVeterinaria + '-' + item.PR_IdProducto + '-' + Constant.GLOBAL.PET.ID] != "undefined" &&
                                            ITEMS_BUYED[item.VTA_IdVeterinaria + '-' + item.PR_IdProducto + '-' + Constant.GLOBAL.PET.ID]['CantidadProducto'] >= item.PR_Stock)}
                                    />
                                </View>
                            </View>
                        </View>
                        <Divider />
                    </View>
                }
            />

            <View style={{ backgroundColor: '#e0e0e0', width: Constant.DEVICE.WIDTH, height: 80, justifyContent: "center" }}>
                <TouchableOpacity
                    activeOpacity={.8}
                    style={[
                        Styles.button.primary,
                        { height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingLeft: 20, paddingRight: 20, margin: 20 }
                    ]}
                    onPress={() => {
                        if (getTotalCount() > 0) {
                            setVisible(true);
                        }
                    }}
                >
                    <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
                        <View style={{ backgroundColor: '#ffd600', width: 30, height: 30, justifyContent: "center", alignItems: "center", borderRadius: 5 }}>
                            <Text style={[Styles.fontBlinkerRegular, { fontSize: 14, color: Styles.colors.black }]}>{getTotalCount()}</Text>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
                        <Text style={[Styles.textOpaque, { fontSize: 14, color: Styles.colors.black, textAlign: "center" }]}>mi canasta</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
                        <Text style={[Styles.fontBlinkerRegular, { fontSize: 14, color: Styles.colors.black }]}>S/{getTotalAmount().toFixed(2)}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image_vet: {
        // padding: 28,
        // borderWidth: .5,
        // borderColor: Styles.colors.opaque,
        backgroundColor: Styles.colors.background,
        ...Platform.select({
            android: {
                elevation: 2,
            },
            default: {
                shadowColor: Styles.colors.opaque,
                shadowOffset: { height: 1, width: 1 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
        })
    }
});