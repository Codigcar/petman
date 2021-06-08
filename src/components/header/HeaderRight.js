import React, { memo, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
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
import { Avatar, Badge, Icon, Input, Rating, AirbnbRating, Divider, SearchBar, Overlay } from 'react-native-elements';
import Button from '../../components/Button';
import { Styles } from '../../assets/css/Styles';
import Constant from '../../utils/constants';
import { fetchPOST, addToCart, listVetsPurcharse, removeToCart } from '../../utils/functions';
import OverlayCart from './OverlayCart';

let SIZE = 30;
let ITEMS_BUYED_HEADER = {};

const HeaderRight = ({ navigation, userRoot, hideCount }) => {
    const [value, setValue] = useState(-1);
    const [visible, setVisible] = useState(false);

    const _loadStorage = async () => {
        let count = 0;
        let _itemsBuyed = await AsyncStorage.getItem('@ITEMS_BUYED');
        if (_itemsBuyed != null) {
            ITEMS_BUYED_HEADER = JSON.parse(_itemsBuyed);
        } else {
            ITEMS_BUYED_HEADER = {};
        }
        Object.keys(ITEMS_BUYED_HEADER).map((key) => {
            count += ITEMS_BUYED_HEADER[key]['CantidadProducto'];
            return count;
        });
        setValue(count);
    };

    useEffect(() => {
        _loadStorage();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            _loadStorage();
        })
    );

    const showCart = () => {
        setVisible(true);
    }

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            {Constant.GLOBAL.PET.ID == 0
                ? <></>
                :
                <View style={{ marginRight: 10 }} >
                    <Avatar
                        rounded
                        size={SIZE}
                        onPress={() => {
                            Constant.GLOBAL.PET.ID = 0;
                            Constant.GLOBAL.PET.PHOTO = null;
                            navigation.navigate('StartHomeScreen', { userRoot: userRoot });
                        }}
                        source={{ uri: Constant.GLOBAL.PET.PHOTO }}
                        containerStyle={{ borderWidth: 2, borderColor: Styles.colors.secondary }}
                    />
                </View>
            }
            {value <= 0 || hideCount
                ? <></>
                :
                <View style={{ marginRight: 10 }} >
                    <Avatar
                        size={SIZE}
                        source={Constant.GLOBAL.IMAGES.ICON_CART}
                        onPress={() => showCart()}
                    />
                    <Badge
                        badgeStyle={{ backgroundColor: Styles.colors.background, minWidth: 14, height: 14, borderRadius: 7 }}
                        value={value}
                        textStyle={[Styles.textOpaque, { fontSize: 8, color: Styles.colors.secondary }]}
                        containerStyle={{ position: 'absolute', top: -2, right: -2 }}
                    />
                </View>
            }
            <OverlayCart navigation={navigation} visible={visible} backdropPress={() => { setVisible(false); _loadStorage(); }} userRoot={userRoot} />
        </View>
    );
};

export default memo(HeaderRight);
