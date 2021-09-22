import React, { memo, useState, useEffect } from 'react';
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
    SafeAreaView,
    Pressable
} from 'react-native';
import { Avatar, Divider, Icon, Overlay } from 'react-native-elements';
import { Styles } from '../../assets/css/Styles';
import Constant from '../../utils/constants';
import MapPlaceSearch from '../../screens/main/maps/MapPlaceSearch';
import { fetchPOST } from '../../utils/functions';
import Button from '../../components/Button';

const OverlayAddress = ({ userRoot, visible, backdropPress, setAddress }) => {
    const [input, setInput] = useState();
    const [apiKey, setApiKey] = useState();

  useEffect(() => {
      fetchPOST(Constant.URI.GOOGLE_MAP_API_KEY, { }, function (response) {
        setApiKey(response.Data[0].ApiKeyGoogle);
      })
  }, []);

    const getCoordsFromName = (obj) => {
        console.log('getCoordsFromName: ' + JSON.stringify(obj))
        setInput(obj)
    }

    const toggleOverlay = () => {
        backdropPress();
    }

    return (
        <>
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} fullScreen={false} overlayStyle={{ padding: 0, width:Constant.DEVICE.WIDTH*0.95, height:Constant.DEVICE.HEIGHT*0.85,borderRadius:10 }}  >
                <SafeAreaView style={{ flex: 1, marginVertical:0}}>
                    <View style={{ height: 70, backgroundColor: Styles.colors.primary, padding: 10, borderTopEndRadius:10, borderTopStartRadius:10 }}>
                        <View style={{ alignItems: "flex-end" }}>
                            <Pressable
                                style={{ width: 30, height: 30, alignItems: "center", justifyContent: "center", borderWidth: 1 }}
                                onPress={toggleOverlay}
                            >
                                <Text style={{ color: Styles.colors.black, fontSize: 13, bottom: 1 }}>x</Text>
                            </Pressable>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center", marginBottom: 10 }}>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 16, color: Styles.colors.black }]}>Cambiar de dirección</Text>
                        </View>
                    </View>
                    <View style={{/* backgroundColor:'red', */position:'absolute',top:100, left: 0, right: 0, bottom: 100, justifyContent: "center", alignItems: "center", /* backgroundColor:'red' */}}>
                        <Text style={{/* backgroundColor:'green' */}}>
                            <Icon name='map-outline' type='ionicon' size={60} color={Styles.colors.gris } style={{/* backgroundColor:'blue' */}} />
                        </Text>
                        <Text style={{color:Styles.colors.gris}}>Reaiza tu busqueda...</Text>
                    </View>

                    <MapPlaceSearch notifyChange={(loc) => getCoordsFromName(loc)} apiKey={apiKey} />

                    

                    <View style={{ width: Constant.DEVICE.WIDTH, height: 80, position:'absolute',justifyContent: "center", top: Constant.DEVICE.HEIGHT - Constant.DEVICE.HEIGHT*0.3, padding: 20, paddingRight:40 }}>
                        <Pressable
                            style={[
                                Styles.button.primary, 
                                { height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center"/* , paddingLeft: 20, paddingRight: 20, margin: 20 */ }
                            ]}
                            onPress={() => {
                                let obj = input;
                                obj.i_ccl_idcliente = userRoot.CCL_IdCliente;
                                console.log('OBJ: ' + JSON.stringify(obj))
                                console.log('userRoot.CCL_IdCliente: ' + JSON.stringify(userRoot.CCL_IdCliente))
                                fetchPOST(Constant.URI.USER_ADDRESS_UPDATE, obj, function (response) {
                                    toggleOverlay();
                                    userRoot.UB_Direccion = obj.I_UB_Direccion;
                                    setAddress(obj.I_UB_Direccion);
                                    Alert.alert("", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
                                })
                            }}
                        >
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
                                <Text style={[Styles.textOpaque, { fontSize: 14, color: Styles.colors.black, textAlign: "center" }]}>guardar</Text>
                            </View>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </Overlay>
        </>
    );
};

export default memo(OverlayAddress);
