import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Platform, TouchableHighlight, ScrollView, Pressable } from 'react-native';
import { Avatar, Icon, Overlay } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Button, Divider, DropDownPicker, HeaderBackLeft, HeaderRight } from '../../components';
import OverlayCart from '../../components/header/OverlayCart';
import Carousel from 'react-native-snap-carousel';
import Constant from '../../utils/constants';
import { fetchPOST, addToCart } from '../../utils/functions';
import { Styles } from '../../assets/css/Styles';
import CheckBox from '@react-native-community/checkbox';

const Stack = createStackNavigator();
let ITEMS_BUYED = {};
let ID_SERVICE = 0;
let VET_BUY = null;

export default function StartHomeAdminScreen({ navigation, route }) {
    // console.log('ProductScreen: ' + JSON.stringify(route))
    let SIZE = 75;
    const [services, setServices] = useState([]);
    const [items, setItems] = useState([]);
    const [visible, setVisible] = useState(false);
    const [rating, setRating] = useState([]);
    const [selectedService, setSelectedService] = useState(false);
    const [stateOrders, setStateOrders] = useState([]);
    const [selectedStateOrder, setSelectedStateOrder] = useState(0);
    const [listOfSeletectedOrders, setListOfSeletectedOrders] = useState([]);
    const [orderLast, setOrderLast] = useState(0);

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
            // title: route.params.veterinary.VTA_NombreVeterinaria,
            title: 'Pedidos',
            headerStyle: Styles.headerBarStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            /* headerLeft: () => (
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
            ), */
            /* headerRight: () => (
                // <HeaderRight navigation={navigation} userRoot={route.params.userRoot} hideCount={true} />
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
                
            ) */
        });
    }, [navigation]);

    useEffect(() => {
        fetchPOST(Constant.URI.VENTA_OBTENER_PEDIDO, {
            "I_VTA_IdVeterinaria": 3,
            "I_V_Estado": 0,
        }, function (response) {
            if (response.CodigoMensaje == 100) {
                console.log('VENTA_OBTENER_PEDIDO: ', response.Pedido);
                // setServices(response.Data);
                setServices([
                    {
                        SV_IdServicio: 1,
                        SV_NombreServicio: 'Pendiente',
                    },
                    {
                        SV_IdServicio: 2,
                        SV_NombreServicio: 'Recojo',
                    },
                    {
                        SV_IdServicio: 3,
                        SV_NombreServicio: 'Atentido',
                    },
                    {
                        SV_IdServicio: 4,
                        SV_NombreServicio: 'Entregado',
                    },
                ]);
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        })
        ID_SERVICE = 1;
        searchVeterinaryProduct();
        _loadStorage();
    }, []);

    useEffect(() => {
        fetchPOST(Constant.URI.ESTADO_PEDIDO_LISTAR, {},
            function (response) {
                if (response.CodigoMensaje == 100) {
                    const list = response.Data.map((e) => {
                        return { label: e['V_NombreEstadoPedido'], value: e['V_EstadoPedido'], color: e['RZ_Color'] || Styles.colors.gris }
                    });
                    setStateOrders(list);
                    console.log('ESTADO_PEDIDO_LISTAR: ', stateOrders);
                    // setServices(response.Data);
                } else {
                    Alert.alert('', response.RespuestaMensaje);
                }
            })


    }, [])

    const searchVeterinaryProduct = () => {
        fetchPOST(Constant.URI.VENTA_OBTENER_PEDIDO, {
            "I_VTA_IdVeterinaria": 3,
            "I_V_Estado": ID_SERVICE,
        }, function (response) {
            if (response.CodigoMensaje == 100) {
                // console.log('setItems: ',response.Pedido);
                console.log('route.params.veterinary.VTA_IdVeterinaria: ', route.params.veterinary.VTA_IdVeterinaria);
                console.log('ID_SERVICE: ', ID_SERVICE);
                console.log('route.params.veterinary.PR_IdProducto: ', route.params.veterinary.PR_IdProducto);
                setListOfSeletectedOrders([]);
                setItems(response.Pedido);
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        })
    }

    const changeOfOrderStatus = (order, listOfSeletectedOrdersLength) => {
        fetchPOST(Constant.URI.VENTA_ACTUALIZAR_ESTADO, {
            "I_V_IdVenta": order,
            "I_V_Estado": selectedStateOrder,
        }, function (response) {
            if (response.CodigoMensaje == 100) {
                console.log('respuesta!!');
                if (order === listOfSeletectedOrders[listOfSeletectedOrdersLength - 1]) {
                    Alert.alert('', response.RespuestaMensaje);
                    searchVeterinaryProduct();
                }
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        });
        console.log('respuesta2!!');
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
                    // setListOfSeletectedOrders([]);
                    // setSelectedService([]);
                }}
            >
                <View style={{ height: 100, width: 80, alignItems: "center" }}>
                    {/* Avatar aqui */}
                    {/* <Avatar
                        size={60}
                        rounded
                        source={{ uri: SV_RutaImagen }}
                    /> */}
                    <Text style={
                        [Styles.textOpaque,
                        (ID_SERVICE === SV_IdServicio) && { color: Styles.colors.secondary },
                        {
                            fontSize: 12, textAlign: "center",
                            width: 80, height: 40, marginTop: 8,

                        }]}>
                        {SV_NombreServicio}
                    </Text>
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

            {/* Estrellas del producto */}
            {/* ------ */}
            {/*  <View style={{ width: Constant.DEVICE.WIDTH, height: 45, justifyContent: "center", borderBottomWidth: .5, borderBottomColor: Styles.colors.gris, backgroundColor: Styles.colors.background }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginLeft: 80, marginRight: 20 }}>
                    {renderRating(5, 15, parseInt(route.params.veterinary.VTA_Ranking))}
                    <View style={{ flexDirection: "row" }}>
                        <Icon name='clock-time-three-outline' type='material-community' size={15} color={Styles.colors.opaque} style={{ marginRight: 5, marginLeft: 10 }} />
                        <Text style={[Styles.textLightGrey, { fontSize: 14 }]}>{route.params.veterinary.VTA_Horario}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Icon name='home-outline' type='material-community' size={15} color={Styles.colors.opaque} style={{ marginRight: 5, marginLeft: 0 }} />
                        <Text style={[Styles.textLightGrey, { fontSize: 14 }]}>{route.params.veterinary.VTA_Distancia} {route.params.veterinary.VTA_Distancia_Unidad}</Text>
                    </View>
                </View>
            </View> */}

            <FlatList
                data={items}
                keyExtractor={(item, index) => item + index}
                extraData={ITEMS_BUYED}
                ListHeaderComponent={
                    <View>
                        <View style={{ backgroundColor: Styles.colors.background }}>
                            <View style={{ height: 50 }}>
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
                                    removeClippedSubviews={false}
                                />
                            </View>
                        </View>
                        <Divider style={{ height: 10, backgroundColor: Styles.colors.defaultBackground }} />
                    </View>
                }
                style={{ backgroundColor: Styles.colors.background /* 'blue' */ }}
                renderItem={({ item, index }) =>
                    <View>
                        <View style={{ flexDirection: "row", height: SIZE, width: Constant.DEVICE.WIDTH, margin: 15, marginLeft: 20, marginBottom: 25 }}>
                            <View style={{ width: SIZE - 20, justifyContent: "center" }} >
                                <CheckBox
                                    disabled={false}
                                    value={listOfSeletectedOrders.find(element => element === item.V_IdVenta)}
                                    onValueChange={(newValue) => {
                                        console.log('CheckBox value: ', item.V_IdVenta);
                                        if (newValue) {
                                            const found = listOfSeletectedOrders.find(element => element === item.V_IdVenta);
                                            if (!found) {
                                                setListOfSeletectedOrders((oldArray) => [...oldArray, item.V_IdVenta]);
                                            }
                                        } else {
                                            const found = listOfSeletectedOrders.filter(element => element !== item.V_IdVenta);
                                            setListOfSeletectedOrders(found);
                                        }
                                        console.log('setListOfSeletectedOrders: ', JSON.stringify(listOfSeletectedOrders));
                                    }}
                                />
                            </View>
                            <View style={{ marginLeft: 5, width: Constant.DEVICE.WIDTH - (SIZE + 50) }}>
                                <View style={{}}>
                                    <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", height: 30 }}>
                                        <Text style={[Styles.textBoldOpaque, { fontSize: 16 }]}>{item.CCL_NombreCompleto}</Text>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 8 }}>
                                            <Image style={{ width: 40, height: 40, resizeMode: "cover", borderRadius: 10, marginTop: 5 }}
                                                source={{ uri: item.DetallePedido[0].MS_NombreFotoMascota }}
                                            />
                                            <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", marginLeft: 15/* , backgroundColor:'cyan'  */ }}>
                                                <Text style={[Styles.textLightGrey, { fontSize: 16 }]}>{item.DetallePedido[0].MS_NombreMascota}</Text>
                                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                                    <Image style={{ width: 20, height: 20, resizeMode: "cover", borderRadius: 10, marginTop: 5 }}
                                                        source={{ uri: item.DetallePedido[0].SE_RutaSexoMascota }}
                                                    />
                                                    <Text style={[Styles.textLightGrey, { fontSize: 16 }]}>{item.DetallePedido[0].MS_Descripcion2}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {/* {(typeof ITEMS_BUYED[item.VTA_IdVeterinaria + '-' + item.PR_IdProducto + '-' + Constant.GLOBAL.PET.ID] === "undefined")
                                            ? <></>
                                            :
                                            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "flex-end" }}>
                                                <View style={{ backgroundColor: Styles.colors.cian, width: 20, height: 20, alignItems: "center", justifyContent: "center", borderRadius: 5 }}>
                                                    <Text style={[Styles.textLightGrey, { color: Styles.colors.background, fontSize: 14 }]}>{ITEMS_BUYED[item.VTA_IdVeterinaria + '-' + item.PR_IdProducto + '-' + Constant.GLOBAL.PET.ID]['CantidadProducto']}</Text>
                                                </View>
                                            </View>
                                        } */}
                                    </View>
                                    <Text style={[Styles.textLightGrey, { fontSize: 12, width: Constant.DEVICE.WIDTH - (SIZE + 80), height: 30 }]}>{item.PR_Descripcion}</Text>
                                </View>
                                {/* <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={[Styles.textBoldOpaque, { fontSize: 12, color: Styles.colors.secondary }]}>Precio S/ {item.PR_MontoTotal === null ? 0.00 : item.PR_MontoTotal.toFixed(2)}</Text>
                                    <Button
                                        buttonStyle={[Styles.button.primary, { width: 80, height: 25, borderWidth: 1, padding: -10 }]}
                                        title="agregar"
                                        titleStyle={[Styles.textOpaque, { fontSize: 12, color: Styles.colors.black }]}
                                        onPress={() => { add(item) }}
                                        disabled={(typeof ITEMS_BUYED[item.VTA_IdVeterinaria + '-' + item.PR_IdProducto + '-' + Constant.GLOBAL.PET.ID] != "undefined" &&
                                            ITEMS_BUYED[item.VTA_IdVeterinaria + '-' + item.PR_IdProducto + '-' + Constant.GLOBAL.PET.ID]['CantidadProducto'] >= item.PR_Stock)}
                                    />
                                </View> */}

                                {/* <CheckBox
                                    disabled={false}
                                    value={acceptTerms}
                                    onValueChange={(newValue) => setAcceptTerms(newValue)}
                                /> */}
                            </View>
                        </View>
                        <Divider />
                    </View>
                }
            />
            {/* boton abajo */}
            <View style={{ backgroundColor: /* 'red' */ '#e0e0e0', width: Constant.DEVICE.WIDTH, height: 180 }}>
                <Divider style={{ height: 10, backgroundColor: Styles.colors.defaultBackground }} />
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: 'white', flexGrow: 1 }}>
                    <View style={{ width: Constant.DEVICE.WIDTH / 2, paddingHorizontal: 30 }}>
                        <DropDownPicker
                            placeholder={{}}
                            items={stateOrders}
                            onValueChange={setSelectedStateOrder}
                            value={selectedStateOrder}
                            style={{
                                inputAndroid: { backgroundColor: 'red', width: (Constant.DEVICE.WIDTH / 2) - 30, margin: -1 },
                                iconContainer: { top: -5, right: 10 },
                            }}
                            useNativeAndroidPickerStyle={false}
                            textInputProps={{ underlineColorAndroid: Styles.colors.gris }}
                            Icon={() => {
                                return <Icon name='keyboard-arrow-down' type='material' size={30} color={Styles.colors.gris} />;
                            }}
                        />
                    </View>
                    <View style={{ width: Constant.DEVICE.WIDTH / 2 }}>
                        <TouchableOpacity
                            activeOpacity={.8}
                            style={[
                                Styles.button.primary,
                                { height: 40, flexDirection: "row",/*  justifyContent: "space-between", alignItems: "center", */ paddingLeft: 20, paddingRight: 20, margin: 20 }
                            ]}
                            onPress={() => {
                                if (listOfSeletectedOrders.length === 0) {
                                    setOrderLast([]);
                                }
                                else {
                                    setOrderLast(listOfSeletectedOrders[listOfSeletectedOrders.length - 1]);
                                }
                                listOfSeletectedOrders.map((item) => {
                                    console.log('itemFOr: ', item);
                                    console.log('orderLast: ', orderLast);
                                    changeOfOrderStatus(item, listOfSeletectedOrders.length);
                                })
                            }}
                        >
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
                                <Text style={[Styles.textOpaque, { fontSize: 14, color: Styles.colors.black, textAlign: "center" }]}>Aplicar</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                    <Icon name='bus-side' type='material-community' size={40} color={Styles.colors.opaque} style={{}} />
                    <Text style={[Styles.textLightGrey, { fontSize: 16, marginBottom: 20 }]}>Pedidos</Text>
                </View>
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