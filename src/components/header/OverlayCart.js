import AsyncStorage from '@react-native-community/async-storage';
import React, { memo, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { Avatar, Divider, Icon, Overlay } from 'react-native-elements';
import { Styles } from '../../assets/css/Styles';
import Button from '../../components/Button';
import { RadioForm, RadioButton, RadioButtonInput, RadioButtonLabel } from '../SimpleRadioButton.js'
import Constant from '../../utils/constants';
import { addToCart, fetchPOST, listVetsPurcharse, removeToCart } from '../../utils/functions';
import OverlayAddress from '../../components/header/OverlayAddress'
import { set } from 'react-native-reanimated';

let ITEMS = {};
let MOBILITY = {};

const OverlayCart = ({ visible, backdropPress, userRoot, successPayment, navigation }) => {
    const [vetPurcharse, setVetPurcharse] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleOverlayAddress, setVisibleOverlayAddress] = useState(false);
    const [address, setAddress] = useState(userRoot.UB_Direccion);

    const _loadStorage = async () => {
        let _itemsBuyed = await AsyncStorage.getItem('@ITEMS_BUYED');
        if (_itemsBuyed != null) {
            ITEMS = JSON.parse(_itemsBuyed);
        }
        console.log('OVERLAY: ' + JSON.stringify(ITEMS));
        let list = listVetsPurcharse(ITEMS);
        setVetPurcharse(list);
    };

    useEffect(() => {
        if (vetPurcharse.length <= 0 && visible) {
            console.log('IAIAIAIAIA: ' + vetPurcharse.length + "- " + visible)
            _loadStorage();
            if (userRoot.UB_Direccion == null) {
                Alert.alert('', 'Por favor ingresa una dirección para continuar tu compra.');
            }
        }
    });

    const getTotalAmount = (itemsBuyed, mobility) => {
        let amount = 0;
        Object.keys(itemsBuyed).map((key) => {
            let { PR_MontoTotal, CantidadProducto } = itemsBuyed[key];
            amount += PR_MontoTotal * CantidadProducto;
            return amount;
        });

        Object.keys(mobility).map(function (key) {
            let { PR_MontoTotal } = mobility[key];
            amount += PR_MontoTotal;
        });
        return amount;
    }

    const add = (product, minus) => {
        ITEMS = addToCart(product, minus, undefined, ITEMS);
        let list = listVetsPurcharse(ITEMS);
        setVetPurcharse(list);
    }

    const remove = (item) => {
        ITEMS = removeToCart(item, ITEMS, toggleOverlay);
        let list = listVetsPurcharse(ITEMS);
        setVetPurcharse(list);
    }

    const makePayment = () => {
        setLoading(true);
        let amount = getTotalAmount(ITEMS, MOBILITY).toFixed(2);
        let commission = 0;
        let body = {
            "I_CCL_IdCliente": userRoot.CCL_IdCliente,
            "I_TAR_IdTarjeta": 1,//TODO: route.params.userRoot.TAR_IdTarjeta,
            "I_V_MontoTotal": amount,
            "I_USU_IdUsuario_Registro": userRoot.USU_IdUsuario
        };

        let venta_detalle = Object.keys(ITEMS).map((key) => {
            let { VTA_IdVeterinaria, PR_IdProducto, MS_IdMascota, PR_MontoComision, CantidadProducto } = ITEMS[key];
            commission += PR_MontoComision * CantidadProducto;
            return {
                "I_VTA_IdVeterinaria": VTA_IdVeterinaria,
                "I_PR_IdProducto": PR_IdProducto,
                "I_MS_IdMascota": MS_IdMascota,
                "I_DV_CantidadProducto": CantidadProducto
            };
        });

        Object.keys(MOBILITY).map(function (key) {
            let { VTA_IdVeterinaria, PR_IdProducto, MS_IdMascota, PR_MontoComision, CantidadProducto } = MOBILITY[key];
            commission += PR_MontoComision * CantidadProducto;
            venta_detalle.push({
                "I_VTA_IdVeterinaria": VTA_IdVeterinaria,
                "I_PR_IdProducto": PR_IdProducto,
                "I_MS_IdMascota": MS_IdMascota,
                "I_DV_CantidadProducto": CantidadProducto
            });
        });

        body.I_V_MontoComision = commission;
        body.venta_detalle = venta_detalle;

        console.log('VENTA: ' + JSON.stringify(body));
        toggleOverlay();
        ITEMS = {};
        if (successPayment != null) {
            successPayment();
        }
        navigation.navigate('PaymentScreen', { userRoot: userRoot, totalAmount: amount, body });
    }

    const ProductDetails = (props) => {
        const products = props.items;
        // console.log('ITEMS products: ' + JSON.stringify(products));
        return (
            <FlatList
                data={products}
                keyExtractor={(item, index) => item + index}
                extraData={ITEMS}
                renderItem={({ item }) =>
                    <View style={{ justifyContent: "space-between", paddingLeft: 10, paddingRight: 10 }}>
                        <View style={{ height: 80 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 5 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={[Styles.textBoldOpaque, { fontSize: 12 }]}>{item.PR_NombreProducto}</Text>
                                    <Avatar
                                        rounded
                                        size={25}
                                        source={{ uri: item.MS_NombreFotoMascota }}
                                        containerStyle={{ borderWidth: 2, borderColor: Styles.colors.secondary, marginLeft: 10 }}
                                    />
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Pressable
                                        activeOpacity={.8}
                                        style={{ margin: 5, padding: 5, borderWidth: 1, borderColor: (item.CantidadProducto <= 1 ? '#E6E6E6' : Styles.colors.gris) }}
                                        onPress={() => { add(item, true); }}
                                        disabled={item.CantidadProducto <= 1}
                                    >
                                        <Icon name='minus' type='material-community' size={10} color={item.CantidadProducto <= 1 ? '#E6E6E6' : Styles.colors.gris} />
                                    </Pressable>
                                    <Text style={[Styles.textOpaque, { fontSize: 12, textAlign: "center" }]}>{item.CantidadProducto}</Text>
                                    <Pressable
                                        activeOpacity={.8}
                                        style={{ margin: 5, padding: 5, borderWidth: 1, borderColor: (item.CantidadProducto >= item.PR_Stock ? '#E6E6E6' : Styles.colors.gris) }}
                                        onPress={() => { add(item); }}
                                        disabled={item.CantidadProducto >= item.PR_Stock}
                                    >
                                        <Icon name='plus' type='material-community' size={10} color={item.CantidadProducto >= item.PR_Stock ? '#E6E6E6' : Styles.colors.gris} />
                                    </Pressable>
                                </View>
                            </View>
                            <Text style={[Styles.textLightGrey, { fontSize: 12, height: 45, width: Constant.DEVICE.WIDTH - 30 }]}>{item.PR_Descripcion}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Pressable
                                activeOpacity={.8}
                                onPress={() => { remove(item); }}
                            >
                                <Text style={[Styles.textOpaque, { fontSize: 12, color: Styles.colors.secondary }]}>Borrar</Text>
                            </Pressable>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 12 }]}>S/{(item.PR_MontoTotal * item.CantidadProducto).toFixed(2)}</Text>
                        </View>
                        <Divider />
                    </View>
                }
            />
        );
    }

    const PickUp = (props) => {
        let vet = props.item;
        const [mobility, setMobility] = useState();
        const [mobilities, setMobilities] = useState([]);
        const [amountTmp, setAmountTmp] = useState(vet.montoSubTotal);

        useEffect(() => {
            // console.log('PickUp ' + JSON.stringify(vet));
            const ac = new AbortController();
            /* Idcliente */
            /* aqui */
            fetchPOST(Constant.URI.MOBILITY, {
                "i_ccl_idcliente": userRoot.CCL_IdCliente,
                "i_vta_idveterinaria": vet.VTA_IdVeterinaria
            }, function (response) {
                if (response.CodigoMensaje == 100) {
                    if (response.Data.length > 0) {
                        MOBILITY[vet.VTA_IdVeterinaria] = response.Data[0];
                        setMobility(0);
                    } else {
                        setMobility(-1);
                    }
                    _loadIndex(vet.VTA_IdVeterinaria);
                    // console.log('GENE: ' + JSON.stringify(MOBILITY));
                    setMobilities(response.Data);
                } else {
                    Alert.alert('', response.RespuestaMensaje);
                }
            })
            return () => ac.abort(); // Abort both fetches on unmount

        }, []);


        const _loadIndex = async (idVeterinaria) => {
            let _index = await AsyncStorage.getItem('@INDEX_MOBILITY'.concat(idVeterinaria));
            if (_index != null) {
                setMobility(_index);
                if (_index == "-1") {
                    delete MOBILITY[idVeterinaria];
                } else {
                    setAmountTmp(MOBILITY[idVeterinaria].PR_MontoTotal + amountTmp);
                }
            }
            console.log('_loadIndex: ' + _index + " vet: " + JSON.stringify(MOBILITY[idVeterinaria]));
        };
        const _saveIndex = async (idVeterinaria, index) => {
            try {
                setMobility(index);
                await AsyncStorage.setItem('@INDEX_MOBILITY'.concat(idVeterinaria), index.toString());
                let list = listVetsPurcharse(ITEMS);
                setVetPurcharse(list);
            } catch (error) {
                console.error('Error: ' + error);
            }
        };

        const deleteMobility = (value, index) => {
            delete MOBILITY[value];
            _saveIndex(value, index);
            // console.log('GENE2: ' + JSON.stringify(MOBILITY[value]))
        }

        return (
            <View>
                <View style={{ margin: 10 }}>
                    <Text style={[Styles.textBoldOpaque, { fontSize: 14, marginBottom: 5 }]}>Movilidad</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", height: 30 }}>
                        <RadioForm formHorizontal={true} animation={true} >
                            {mobilities.map((obj, i) => {
                                // console.log('MOVIL: ' + JSON.stringify(obj) + ' - ' + i)
                                var onPress = (value, index) => {
                                    MOBILITY[value.VTA_IdVeterinaria] = value;
                                    _saveIndex(value.VTA_IdVeterinaria, index);
                                    // console.log('Onpress: ' + JSON.stringify(MOBILITY[value.VTA_IdVeterinaria]))
                                }
                                return (
                                    <RadioButton labelHorizontal={true} key={i} >
                                        <RadioButtonInput
                                            obj={{ label: 'S/.' + obj.PR_MontoTotal.toFixed(2), value: obj }}
                                            index={i}
                                            isSelected={mobility == i}
                                            onPress={onPress}
                                            buttonSize={7}
                                            buttonOuterSize={15}
                                            buttonStyle={{ marginLeft: 10 }}
                                        />
                                        <RadioButtonLabel
                                            obj={{ label: 'Ss/.' + obj.PR_MontoTotal.toFixed(2), value: obj }}
                                            labelStyle={{ fontSize: 12 }}
                                            index={i}
                                            labelHorizontal={true}
                                            onPress={onPress}
                                        />
                                    </RadioButton>
                                )
                            })}
                            <RadioButtonInput
                                obj={{ label: "Yo llevo a mi mascota", value: vet.VTA_IdVeterinaria }}
                                index={-1}
                                isSelected={mobility == -1}
                                onPress={deleteMobility}
                                buttonSize={7}
                                buttonOuterSize={15}
                                buttonStyle={{ marginLeft: 10 }}
                            />
                            <RadioButtonLabel
                                obj={{ label: "Yo llevo a mi mascota", value: vet.VTA_IdVeterinaria }}
                                index={-1}
                                labelHorizontal={true}
                                onPress={deleteMobility}
                            />
                        </RadioForm>
                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
                    <Text style={[Styles.textBoldOpaque, { fontSize: 14, color: Styles.colors.secondary }]}>SUB-TOTAL</Text>
                    <Text style={[Styles.textBoldOpaque, { fontSize: 14, color: Styles.colors.secondary }]}>S/{amountTmp.toFixed(2)}</Text>
                </View>
            </View>
        );
    }

    const toggleOverlay = () => {
        setVetPurcharse([]);
        backdropPress();
        setLoading(false);
    }

    const toggleOverlayAddress = () => {
        console.log('presionado')
        setVisibleOverlayAddress(!visibleOverlayAddress);
    }

    const setAddressUserRoot = (prop) => {
        userRoot.UB_Direccion = prop;
        setAddress(prop);
    }

    return (
        <>
            <OverlayAddress visible={visibleOverlayAddress} backdropPress={toggleOverlayAddress} userRoot={userRoot} setAddress={setAddressUserRoot} />
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ padding: 0 }}  >
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        data={vetPurcharse}
                        ListHeaderComponent={
                            <View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <TouchableOpacity
                                        activeOpacity={.8}
                                        style={{ width: 30, height: 30, backgroundColor: Styles.colors.secondary, alignItems: "center", justifyContent: "center" }}
                                        onPress={toggleOverlay}
                                    >
                                        <Text style={{ color: Styles.colors.tertiary, fontSize: 13, bottom: 1 }}>x</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                                    <Image
                                        style={{ width: 25, height: 25, resizeMode: "cover", marginBottom: 10, marginRight: 10 }}
                                        source={Constant.GLOBAL.IMAGES.ICON_CART}
                                    />
                                    <Text style={[Styles.textBoldOpaque, { fontSize: 16, color: Styles.colors.secondary }]}>Mi canasta</Text>
                                </View>
                                <View style={{ margin: 10 }}>
                                    <Text style={[Styles.textBoldOpaque, { fontSize: 14 }]}>Dirección de envío</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={[Styles.textLightGrey, { fontSize: 12 }]}>{address}</Text>
                                        <Pressable onPress={toggleOverlayAddress}>
                                            <Text style={[Styles.textBoldOpaque, { fontSize: 12, color: Styles.colors.cian }]}>CAMBIAR</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        }
                        ListFooterComponent={
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 10, paddingRight: 10, marginTop: 10 }}>
                                    <Text style={[Styles.textBoldOpaque, { fontSize: 16, color: Styles.colors.secondary }]}>TOTAL</Text>
                                    <Text style={[Styles.textBoldOpaque, { fontSize: 16, color: Styles.colors.secondary }]}>S/{getTotalAmount(ITEMS, MOBILITY).toFixed(2)}</Text>
                                </View>
                                <View style={{ flexDirection: "row", margin: 10, backgroundColor: '#F5F5F5' }}>
                                    <Icon name='heart' type='ionicon' size={35} color={'#FF0000'} style={{ margin: 10, marginRight: 15 }} />
                                    <View style={{ justifyContent: "center", width: Constant.DEVICE.WIDTH - 110 }}>
                                        <Text style={[Styles.fontBlinkerRegular, { fontSize: 13, textAlign: "justify", color: Styles.colors.opaque }]}>El 1% del total de tus compras será donado a fundaciones que ayudan a los animales</Text>
                                    </View>
                                </View>
                                <View style={{}} >
                                    <Button
                                        buttonStyle={[Styles.button.primary, { marginLeft: 10, marginRight: 10 }]}
                                        title="realizar pago"
                                        onPress={() => makePayment()}
                                        loading={loading}
                                        disabled={userRoot.UB_Direccion == null}
                                    />
                                    <Button
                                        buttonStyle={[Styles.button.secondary, { marginLeft: 10, marginRight: 10 }]}
                                        title="continuar comprando"
                                        onPress={toggleOverlay}
                                    />
                                </View>
                            </View>
                        }
                        keyExtractor={(item, index) => item + index}
                        extraData={ITEMS + MOBILITY}
                        renderItem={({ item }) =>
                            <View>
                                <View style={{ padding: 10 }}>
                                    <Text style={[Styles.textBoldOpaque, { fontSize: 16, textAlign: "center" }]}>{item.VTA_NombreVeterinaria}</Text>
                                    <Divider />
                                </View>

                                <View style={{ marginTop: -10 }}>
                                    <ProductDetails items={item.vet_prods} />
                                    <PickUp item={item} />
                                </View>
                            </View>
                        }
                    />
                </SafeAreaView>
            </Overlay>
        </>
    );
};

export default memo(OverlayCart);
