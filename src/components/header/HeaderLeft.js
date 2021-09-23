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
import OverlayAddress from './OverlayAddress';

let SIZE = 35;

const HeaderLeft = ({ navigation, userRoot, setUpdateAddress }) => {
    const [visible, setVisible] = useState(false);
    const [input, setInput] = useState();
    const [address, setAddress] = useState(userRoot.UB_Direccion);

    useEffect(() => {
        console.log('header: '+ address + ' - ' + userRoot.UB_Direccion);
        setAddress(userRoot.UB_Direccion);
    },);


    const toggleOverlay = () => {
        setVisible(!visible);
        setUpdateAddress(!visible);
    }

    const getCoordsFromName = (obj) => {
        console.log('getCoordsFromName: ' + JSON.stringify(obj))
        setInput(obj)
    }

    return (
        <View style={{ flexDirection: "row" }}>
            <View>
                <Pressable
                    onPress={() => { navigation.navigate('SettingsHomeScreen', { userRoot: userRoot }); }}
                >
                    <Image
                        style={{ width: SIZE, height: SIZE, resizeMode: "cover", margin: 10, marginRight: 13 }}
                        source={Constant.GLOBAL.IMAGES.ICON_USER}
                    />
                </Pressable>
            </View>
            <Pressable
                style={{ justifyContent: "center" }}
                onPress={toggleOverlay}
            >
                <View>
                    <Text style={{ color: 'black', fontFamily: Styles.fontAldrichRegular, fontSize: 15, fontWeight: "bold" }}>Hola {userRoot.CCL_Nombre != null ? userRoot.CCL_Nombre.split(" ")[0] : ""}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ color: Styles.colors.black, fontFamily: Styles.fontAldrichRegular, fontSize: 10, marginRight: 1 }}>{address != null ? address : 'Ingresa tu dirección'}</Text>
                        <Icon name='menu-down' type='material-community' size={20} />
                    </View>
                    <OverlayAddress visible={visible} backdropPress={toggleOverlay} userRoot={userRoot} setAddress={setAddress}  />
                </View>
            </Pressable>
        </View>
    );
};

export default (HeaderLeft);
