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
    FlatList, Pressable, SectionList
} from 'react-native';
import { Icon, Rating, AirbnbRating, SearchBar, Avatar, Accessory, Overlay } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Carousel, Button, HeaderBackLeft, HeaderRight, DropDownPicker, Input, InputMask, Divider } from '../../../components';
import { fetchPOST } from '../../../utils/functions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RNPickerSelect from 'react-native-picker-select';
import * as Progress from 'react-native-progress';


export default function PetEvolutionDetailScreen({ navigation, route }) {
    let SIZE = 100;
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (items.length === 0) {
            fetchPOST(Constant.URI.PET_EVOLUTION_GET, {
                "i_sv_idservicio": route.params.services.SV_IdServicio,
                "i_ms_idmascota": route.params.pet.MS_IdMascota
            }, function (response) {
                if (response.CodigoMensaje == 100) {
                    let data = Object.values(response.Data.reduce((acc, item) => {

                        if (!acc[item.V_FechaEmisionFormat]) acc[item.V_FechaEmisionFormat] = {
                            title: item.V_FechaEmisionFormat,
                            data: []
                        };
                        acc[item.V_FechaEmisionFormat].data.push(item);
                        return acc;

                    }, {}))
                    setItems(data);
                } else {
                    Alert.alert('', response.RespuestaMensaje);
                }
            })
        }
    });

    const renderHeader = ({ section }) => {
        return (
            <View>
                <View style={{ height: 40, paddingLeft: 20, justifyContent: "center" }}>
                    <Text style={[Styles.textBoldOpaque, { fontSize: 14 }]}>{section.title}</Text>
                </View>
                <Divider />
            </View>
        )
    }

    const renderItems = ({ item }) => {
        return (
            <View style={{ backgroundColor: Styles.colors.background }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ justifyContent: "center", alignItems: "center", width: SIZE + 20 }} >
                        <Image style={{ width: SIZE, height: SIZE, resizeMode: "cover", margin: 10 }}
                            source={{ uri: item.VTA_NombreFotoVeterinaria }}
                        />
                    </View>
                    <View style={{ width: Constant.DEVICE.WIDTH - (SIZE + 40), paddingLeft: 10, marginTop: 15 }}>
                        <Text style={[Styles.textBoldOpaque, { fontSize: 18, marginBottom: 10 }]}>{item.VTA_NombreVeterinaria}</Text>
                        <Text style={[Styles.textLightGrey, { fontSize: 14 }]}>{item.PR_NombreProducto}</Text>
                    </View>
                </View>
                <Divider />
            </View>
        )
    }

    return (
        <SectionList
            sections={items}
            keyExtractor={(item, index) => item + index}
            renderItem={renderItems}
            renderSectionHeader={renderHeader}
        />
    );
}