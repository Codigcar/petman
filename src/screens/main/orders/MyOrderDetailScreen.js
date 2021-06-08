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
    FlatList, SafeAreaView, Linking
} from 'react-native';
import { Icon, Input, Rating, AirbnbRating, SearchBar, Avatar } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Carousel, Button, HeaderBackLeft, HeaderRight, Divider } from '../../../components';
import { fetchPOST, listVetsPurcharse } from '../../../utils/functions';

const Stack = createStackNavigator();

export default function MyOrderDetailScreen({ navigation, route }) {
    // console.log('MyOrderDetailScreen: ' + JSON.stringify(route));
    const [sales, setSales] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Detalle del pedido',
            headerStyle: Styles.headerBarStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerLeft: () => (
                <HeaderBackLeft navigation={navigation} />
            )
        });
    }, [navigation]);

    useEffect(() => {
        if (sales.length === 0) {
            fetchPOST(Constant.URI.SALE_DETAIL_LIST, {
                "I_V_IdVenta": route.params.sale.V_IdVenta
            }, function (response) {
                if (response.CodigoMensaje == 100) {
                    addToCard(response.Data);
                } else {
                    Alert.alert('', response.RespuestaMensaje);
                }
            })
        }
    });

    const addToCard = (items) => {
        let ITEMS_BUYED = {};
        items.forEach(product => {
            ITEMS_BUYED[product.VTA_IdVeterinaria + '-' + product.PR_IdProducto + '-' + product.MS_IdMascota] = {
                "VTA_IdVeterinaria": product.VTA_IdVeterinaria,
                "PR_IdProducto": product.PR_IdProducto,
                "MS_IdMascota": product.MS_IdMascota,
                "MS_NombreMascota": product.MS_NombreMascota,
                "DV_CantidadProducto": product.DV_CantidadProducto,
                "PR_MontoTotal": product.DV_MontoTotal,
                "VTA_NombreVeterinaria": product.VTA_NombreVeterinaria,
                "PR_NombreProducto": product.PR_NombreProducto,
                "PR_Descripcion": product.PR_Descripcion,
                "SV_NombreServicio": product.SV_NombreServicio,
                "MS_NombreFotoMascota": product.MS_NombreFotoMascota,
                "VTA_Celular": product.VTA_Celular,
                "VTA_MensajeCelular": product.VTA_MensajeCelular,
                "VTA_ImagenCelular": product.VTA_ImagenCelular
            }
        });
        let VETS_PURCHARSE = _addVetsPurcharse(ITEMS_BUYED);
        setSales(VETS_PURCHARSE);

        console.log("VETS_PURCHARSE: " + JSON.stringify(VETS_PURCHARSE));
    };

    const _addVetsPurcharse = (ITEMS_BUYED) => {
        const veterinarians = {};
        Object.keys(ITEMS_BUYED).map(function (key) {
            let { VTA_IdVeterinaria, VTA_NombreVeterinaria, VTA_Celular, VTA_MensajeCelular, VTA_ImagenCelular } = ITEMS_BUYED[key];
            veterinarians[VTA_IdVeterinaria] = { VTA_NombreVeterinaria, VTA_Celular, VTA_MensajeCelular, VTA_ImagenCelular };
            return { VTA_IdVeterinaria, VTA_NombreVeterinaria, VTA_Celular, VTA_MensajeCelular, VTA_ImagenCelular };
        });
        const vets_list = Object.keys(veterinarians).map(function (key) {
            return { 
                "VTA_IdVeterinaria": Number(key), 
                "VTA_NombreVeterinaria": veterinarians[key].VTA_NombreVeterinaria,
                "VTA_Celular": veterinarians[key].VTA_Celular,
                "VTA_MensajeCelular": veterinarians[key].VTA_MensajeCelular,
                "VTA_ImagenCelular": veterinarians[key].VTA_ImagenCelular,
            };
        });

        vets_list.forEach(e => {
            let montoSubTotal = 0;
            let list = [];
            Object.keys(ITEMS_BUYED).map(function (key) {
                let { VTA_IdVeterinaria, PR_MontoTotal } = ITEMS_BUYED[key];
                if (VTA_IdVeterinaria == e.VTA_IdVeterinaria) {
                    montoSubTotal += PR_MontoTotal;
                    list.push({ key: key, ...ITEMS_BUYED[key] });
                }
                return list;
            });
            e.montoSubTotal = montoSubTotal;
            e.vet_prods = list;
        });

        return vets_list;
    };

    const ProductDetails = (props) => {
        const products = props.items;
        // console.log('ITEMS: ' + JSON.stringify(products));
        return (
            <FlatList
                data={products}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) =>
                    <View style={{}}>
                        <View style={{ height: 60, justifyContent: "space-between", padding: 10 }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Avatar
                                    rounded
                                    size={25}
                                    source={{ uri: item.MS_NombreFotoMascota }}
                                    containerStyle={{ borderWidth: 1, borderColor: Styles.colors.secondary }}
                                />
                                <Text style={[Styles.textBoldOpaque, { fontSize: 12, marginLeft: 5 }]}>{item.PR_NombreProducto}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 5 }}>
                                <Text style={[Styles.textLightGrey, { fontSize: 12 }]}>Cantidad: {item.DV_CantidadProducto}</Text>
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <Text style={[Styles.textBoldOpaque, { fontSize: 12 }]}>S/{(item.PR_MontoTotal).toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                        <Divider />
                    </View>
                }
            />
        );
    }

    return (
        <FlatList
            data={sales}
            style={{ backgroundColor: Styles.colors.background }}
            ListFooterComponent={
                <View>
                    {sales.length <= 0
                        ? <></>
                        :
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 16, color: Styles.colors.secondary }]}>TOTAL</Text>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 16, color: Styles.colors.secondary }]}>S/{route.params.sale.V_MontoTotal}</Text>
                        </View>
                    }
                </View>
            }
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) =>
                <View>
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", height: 30 }}>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 18, textAlign: "center", marginRight: 10 }]}>{item.VTA_NombreVeterinaria}</Text>
                            <Avatar
                                size={20}
                                onPress={() => {
                                    Linking.openURL('whatsapp://send?text=' + item.VTA_MensajeCelular + '&phone=' + item.VTA_Celular).then().catch(() => {
                                        Alert.alert('Error', 'No tiene la aplicación WhatsApp instalada.');
                                    });
                                }}
                                source={{ uri: item.VTA_ImagenCelular }}
                            />
                        </View>
                        <Divider />
                    </View>

                    <View style={{ marginTop: -10 }}>
                        <ProductDetails items={item.vet_prods} />
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 14, color: Styles.colors.secondary }]}>SUB-TOTAL</Text>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 14, color: Styles.colors.secondary }]}>S/{item.montoSubTotal.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
});