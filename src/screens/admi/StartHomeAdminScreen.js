import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Platform, TouchableHighlight, ScrollView, Pressable, SectionList,Linking } from 'react-native';
import { Avatar, Icon, Overlay } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Button, Divider, DropDownPicker, HeaderBackLeft, HeaderLeft, HeaderRight } from '../../components';
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
                //   <HeaderLeft navigation={navigation} userRoot={route.params.userRoot} setUpdateAddress={false} />

            ), */
            /*  headerRight: () => (
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
        fetchPOST(Constant.URI.ESTADO_PEDIDO_LISTAR, {},
            function (response) {
                if (response.CodigoMensaje == 100) {
                    const list = response.Data.map((e) => {
                        return { label: e['V_NombreEstadoPedido'], value: e['V_EstadoPedido'], color: e['RZ_Color'] || Styles.colors.gris }
                    });
                    setStateOrders(list);

                    const listServicesCarrusel = response.Data.map((e) => {
                        return { SV_IdServicio: e['V_EstadoPedido'], SV_NombreServicio: e['V_NombreEstadoPedido'] }
                    });
                    setServices(listServicesCarrusel);

                    /* console.log('ESTADO_PEDIDO_LISTAR: ', stateOrders);

                    setServices([
                        {
                            SV_IdServicio: 1,
                            SV_NombreServicio: 'Pendiente',
                        }, */

                    // setServices(response.Data);
                } else {
                    Alert.alert('', response.RespuestaMensaje);
                }
                ID_SERVICE = 1;
                searchVeterinaryProduct();
                _loadStorage();
            })
    }, [])

    const searchVeterinaryProduct = () => {
        fetchPOST(Constant.URI.VENTA_OBTENER_PEDIDO, {
            "I_VTA_IdVeterinaria": route.params.veterinary.VTA_IdVeterinaria,
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

        stateOrders.map(element => {
            if(element.value === selectedStateOrder ){
                fetchPOST(Constant.URI.VENTA_ACTUALIZAR_ESTADO, {
                    "I_V_IdVenta": order.V_IdVenta ,
                    "I_V_Estado": element.value,
                }, function (response) {
                    if (response.CodigoMensaje == 100) {
                        console.log('respuesta!!');
                        if (order.V_IdVenta === listOfSeletectedOrders[listOfSeletectedOrdersLength - 1].V_IdVenta) {
                            Alert.alert('', response.RespuestaMensaje);
                            searchVeterinaryProduct();
                        }
                        fetchPOST(Constant.URI.NOTIFICATION_PUSH_LOCAL, { 
                            "device_token": order.DE_DeviceToken,
                            "title": `¡Tu pedido se encuentra en proceso de ${element.label}!`,
                            "body": `Para tu mascota ${order.DetallePedido[0].MS_NombreMascota}.`
                         }, function (response){
                            console.log('push notification enviado!!: ', response);
                        });
        
                    } else {
                        Alert.alert('', response.RespuestaMensaje);
                    }
                });
            }
        })

        /* fetchPOST(Constant.URI.VENTA_ACTUALIZAR_ESTADO, {
            "I_V_IdVenta": order.V_IdVenta ,
            "I_V_Estado": selectedStateOrder,
        }, function (response) {
            if (response.CodigoMensaje == 100) {
                console.log('respuesta!!');
                if (order.V_IdVenta === listOfSeletectedOrders[listOfSeletectedOrdersLength - 1].V_IdVenta) {
                    Alert.alert('', response.RespuestaMensaje);
                    searchVeterinaryProduct();
                }
                fetchPOST(Constant.URI.NOTIFICATION_PUSH_LOCAL, { 
                    "device_token": order.DE_DeviceToken
                 }, function (response){
                    console.log('push notification enviado!!: ', response);
                });

            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        }); */
        
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
                            fontSize: 14, textAlign: "center",
                            width: 80, height: 40, marginTop: 8,

                        }]}>
                        {SV_NombreServicio}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderHeader = ({ section }) => {
        return (
            <View>
                <View style={{ height: 40, paddingLeft: 20, justifyContent: "center", backgroundColor: Styles.colors.defaultBackground }}>
                    <Text style={[Styles.textBoldOpaque, { fontSize: 14 }]}>{section.title}</Text>
                </View>
                <Divider />
            </View>
        )
    }
    const sendWhatsapp = cellphone => {
        let countryCode = '+51';
        let message = '';
        Linking.openURL('whatsapp://send?text=' + message + '&phone=' + countryCode + cellphone).then().catch(() => {
            Alert.alert('Error', 'No tiene la aplicación WhatsApp instalada.');
        });
    }

    const renderItemsOrders = (item) => {
        return (
            <View>
                <View style={{ flexDirection: "row", height: SIZE+10 , width: Constant.DEVICE.WIDTH, margin: 15, marginLeft: 20, marginBottom: 35 }}>
                    <View style={{ width: SIZE - 20, justifyContent: "center" }} >
                        <CheckBox
                            disabled={false}
                            value={listOfSeletectedOrders.find(element => element.V_IdVenta === item.V_IdVenta) ? true: false}
                            onValueChange={(newValue) => {
                                console.log('CheckBox value: ', item.V_IdVenta);
                                if (newValue) {
                                    const found = listOfSeletectedOrders.find(element => element.V_IdVenta === item.V_IdVenta);
                                    if (!found) {
                                        setListOfSeletectedOrders((oldArray) => [...oldArray, item/* .V_IdVenta */]);
                                    }
                                } else {
                                    const found = listOfSeletectedOrders.filter(element => element.V_IdVenta !== item.V_IdVenta);
                                    setListOfSeletectedOrders(found);
                                }
                                console.log('setListOfSeletectedOrders: ', JSON.stringify(listOfSeletectedOrders));
                            }}
                        />
                    </View>
                    <View style={{ marginLeft: 5, width: Constant.DEVICE.WIDTH - (SIZE + 50) }}>
                        <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", height: 30 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Text style={[Styles.textBoldOpaque, { fontSize: 16, backgroundColor: 'transparent', marginRight: 10 }]}>{item.CCL_NombreCompleto}</Text>
                                <TouchableOpacity onPress={() => sendWhatsapp(item.CCL_Celular) /* console.log('item.CCL_Celular: ',item.CCL_Celular) */ } activeOpacity={0.7}>
                                    <Icon name='whatsapp' type='font-awesome' color={Styles.colors.opaque} size={20} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginTop: 8 }}>
                                <Image style={{ width: 40, height: 40, resizeMode: "cover", borderRadius: 10, marginTop: 5 }}
                                    source={{ uri: item.DetallePedido[0].MS_NombreFotoMascota }}
                                />
                                <View style={{ flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", marginLeft: 15/* , backgroundColor:'red' */}}>
                                    <Text style={[Styles.textLightGrey, { fontSize: 16 }]}>{item.DetallePedido[0].MS_NombreMascota}</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                        <Image style={{ width: 20, height: 20, resizeMode: "cover", borderRadius: 10, marginTop: 5 }}
                                            source={{ uri: item.DetallePedido[0].SE_RutaSexoMascota }}
                                        />
                                        <Text style={[Styles.textLightGrey, { fontSize: 16 }]}>{item.DetallePedido[0].MS_Descripcion2}</Text>
                                    </View>
                                    <Text style={[Styles.textLightGrey, { fontSize: 16 }]}>{item.UB_Direccion}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <Divider style={{marginTop: 0}} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={items}
                keyExtractor={(item, index) => item + index}
                extraData={ITEMS_BUYED}
                ListHeaderComponent={
                    <View>
                        <View style={{ backgroundColor: Styles.colors.background }}>
                            <View style={{ height: 50, marginTop:0, flex:1,alignItems: "center", justifyContent:"center" }}>
                                <Carousel
                                    data={services}
                                    renderItem={renderCarouselItem}
                                    sliderWidth={Constant.DEVICE.WIDTH}
                                    itemWidth={(Constant.DEVICE.WIDTH / 4)}
                                    contentContainerCustomStyle={{ paddingLeft: 0, paddingRight: 0/* , backgroundColor:'cyan' */ }}
                                    inactiveSlideScale={1}
                                    inactiveSlideOpacity={1}
                                    enableMomentum={false}
                                    enableSnap={true}
                                    slideStyle={{alignItems: "center"/*, justifyContent:"center" , marginTop:"40%"  */}}
                                    removeClippedSubviews={false}
                                />
                            </View>
                        </View>
                        <Divider style={{ height: 10, backgroundColor: Styles.colors.defaultBackground }} />
                    </View>
                }
                style={{ backgroundColor: Styles.colors.background }}
                renderItem={({ item, index }) =>
                    renderItemsOrders(item)
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
                                inputAndroid: { backgroundColor: 'transparent', width: (Constant.DEVICE.WIDTH / 2) - 50, margin: -13 },
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
                                    console.log('itemfOr: ', item);
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