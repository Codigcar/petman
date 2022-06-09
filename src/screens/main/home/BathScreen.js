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
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from 'react-native';
import { Icon, Input, Rating, AirbnbRating, SearchBar, Avatar } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { fetchPOST } from '../../../utils/functions';
import _ from "lodash";
import { Divider, Carousel, Button, HeaderLeft, HeaderRight, RadioForm, RadioButtonInput, RadioButtonLabel, HeaderBackLeft } from '../../../components';

let SIZE = 105;

export default function BathScreen({ navigation, route }) {
    // console.log('Baño: ' + JSON.stringify(route));
    const [value, setValue] = useState("");
    const [items, setItems] = useState([]);
    const [arrayholder, setArrayholder] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.SV_NombreServicio,
            headerStyle: Styles.headerBarStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerLeft: () => (
                <HeaderBackLeft navigation={navigation} >
                </HeaderBackLeft>
            ),
            headerRight: () => (
                <HeaderRight navigation={navigation} userRoot={route.params.userRoot} />
            ),
        });
    }, [navigation]);

    useEffect(() => {
        fetchPOST(Constant.URI.PROD_LIST, {
            "CCL_IdCliente": route.params.userRoot.CCL_IdCliente,
            "I_SV_IdServicio": route.params.SV_IdServicio
        }, function (response) {
            setItems(response.Data);
            setArrayholder(response.Data);
        })
    }, []);

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
        <View style={{ backgroundColor: Styles.colors.background, height: Constant.DEVICE.HEIGHT - 80 }} >
            <View style={{ backgroundColor: Styles.colors.background, margin: 10, marginBottom: -10 }}>
                <Input
                    placeholder='Buscar'
                    leftIcon={{ type: 'ionicon', name: 'search-outline', color: Styles.colors.gris, style: { padding: 10 } }}
                    inputContainerStyle={{ borderWidth: 1, borderColor: Styles.colors.gris, borderRadius: 10 }}
                    inputStyle={Styles.textOpaque}
                    errorStyle={{ height: 0 }}
                    onChangeText={setValue}
                    value={value}
                />
            </View>
            <FlatList
                data={items}
                keyExtractor={(item, index) => String.valueOf(item.PR_IdProducto) + `${index}`}
                renderItem={({ item, index }) =>
                    <>
                        {(value.length == 0 || item.PR_NombreProducto.toUpperCase().indexOf(value.toUpperCase()) > -1)
                            ?
                            <TouchableOpacity
                                activeOpacity={.8}
                                onPress={() => {
                                    console.log('BathScreen item:  ',item);
                                    navigation.navigate('ProductScreen', { userRoot: route.params.userRoot, veterinary: item });
                                }}
                            >
                                <View style={{ flexDirection: "row" /* , height: SIZE, width: Constant.DEVICE.WIDTH, margin: 15, marginBottom: 15 */}}>
                                    <View style={{ width: SIZE + 10, height: SIZE + 30, alignItems: "center", justifyContent: "center", marginLeft:17 }} >
                                        <Image style={{ width: SIZE, height: SIZE, resizeMode: "cover", borderRadius: 10, marginTop: 5 }}
                                            source={{ uri: item.PR_NombreFoto }}
                                        />
                                    </View>
                                    <View style={{ justifyContent: "space-between", margin: 5, width: Constant.DEVICE.WIDTH - (SIZE + 30), paddingRight: 30}}>
                                        <View style={{ marginTop: 10 }}>
                                            <Text style={[Styles.textBoldOpaque, { fontSize: 18, marginBottom: 5 }]}>{item.PR_NombreProducto}</Text>
                                            <Text style={[Styles.textBoldOpaque, { fontSize: 14, color: Styles.colors.secondary }]}>S/ {item.PR_MontoTotal === null ? 0.00 : item.PR_MontoTotal.toFixed(2)}</Text>
                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            <View style={{ marginBottom: 3 }}>
                                                <Text style={[Styles.textOpaque, { fontSize: 14, fontFamily: Styles.fontBlinkerRegular }]}>{item.VTA_NombreVeterinaria}</Text>
                                            </View>
                                            <View style={{ alignItems: "flex-start", marginBottom: 3 }}>
                                                {renderRating(5, 15, parseInt(item.VTA_Ranking))}
                                            </View>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Icon name='clock-time-three-outline' type='material-community' size={15} color={Styles.colors.opaque} style={{ marginRight: 5, marginLeft: 0 }} />
                                                    <Text style={[Styles.textLightGrey, { fontSize: 14 }]}>{item.VTA_Horario}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Icon name='home-outline' type='material-community' size={15} color={Styles.colors.opaque} style={{ marginRight: 5, marginLeft: 0 }} />
                                                    <Text style={[Styles.textLightGrey, { fontSize: 14 }]}>{item.VTA_Distancia} {item.VTA_Distancia_Unidad}</Text>
                                                </View>
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
        </View >
    );
}