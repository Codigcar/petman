import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import { HeaderLeft, HeaderRight, Divider } from '../../../components';
import Constant from '../../../utils/constants';
import { fetchPOST } from '../../../utils/functions';

const Stack = createStackNavigator();

export default function PetSelectScreen({ navigation, route }) {
    // console.log('PetSelectScreen: ' + JSON.stringify(navigation) + ' || ' + JSON.stringify(route))
    let SIZE = 80;
    const [items, setItems] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: null,
            headerStyle: Styles.headerBarStyle,
            headerLeft: () => (
                <HeaderLeft navigation={navigation} userRoot={route.params.userRoot} />
            ),
            headerRight: () => (
                <HeaderRight navigation={navigation} userRoot={route.params.userRoot} />
            ),
        });
    }, [navigation]);

    useEffect(() => {
        if (items.length === 0) {
            console.log('Servicio ITEMS')
            fetchPOST(Constant.URI.PET_LIST, {
                "i_ccl_idcliente": route.params.userRoot.CCL_IdCliente
            }, function (response) {
                if (response.CodigoMensaje == 100 || response.CodigoMensaje == 0) {
                    setItems(response.Data);
                    if (response.Data.length <= 0) {
                      navigation.navigate('PetsHomeScreen', { userRoot: route.params.userRoot });
                    }
                } else {
                    Alert.alert('', response.RespuestaMensaje);
                }
            })
        }
    }, []);

    return (
        <FlatList
            data={items}
            ListHeaderComponent={
                <View>
                    <View style={{ margin: 20, marginLeft: 70, marginRight: 70 }}>
                        <Text style={[Styles.textSecondary, { fontSize: 26, textAlign: "center" }]}>
                            ¿A quién engreirás hoy?
                    </Text>
                    </View>
                    <Divider />
                </View>
            }
            style={{ backgroundColor: Styles.colors.background }}
            keyExtractor={(item, index) => String.valueOf(item.VTA_IdVeterinaria) + `${index}`}
            renderItem={({ item, index }) =>
                <TouchableOpacity
                    activeOpacity={.8}
                    onPress={() => {
                        console.log(item);
                        Constant.GLOBAL.PET.ID = item.MS_IdMascota;
                        Constant.GLOBAL.PET.PHOTO = item.MS_Foto;
                        navigation.navigate('StartHomeScreen', { userRoot: route.params.userRoot });
                    }}
                >
                    <View style={{ flexDirection: "row", margin: 10 }}>
                        <View style={{ justifyContent: "center", alignItems: "center", width: SIZE + 10 }} >
                            <Avatar
                                rounded
                                size={SIZE}
                                source={{ uri: item.MS_Foto }}
                            />
                        </View>
                        <View style={{ justifyContent: "center", width: Constant.DEVICE.WIDTH - (SIZE + 30), paddingLeft: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text style={[Styles.textOpaque, { fontSize: 24 }]}>{item.MS_NombreMascota}</Text>
                                <Image style={{ width: 30, height: 30, resizeMode: "cover", marginRight: 10 }}
                                    source={{ uri: item.SE_RutaSexoMascota }}
                                />
                            </View>
                            <View style={{ marginTop: 10, marginBottom: 10 }}>
                                <Text style={[Styles.textLightGrey, { fontSize: 13 }]}>{item.MS_Descripcion1}</Text>
                                <Text style={[Styles.textLightGrey, { fontSize: 13 }]}>{item.MS_Descripcion2}</Text>
                            </View>
                        </View>
                    </View>
                    <Divider />
                </TouchableOpacity>
            }
        />
    );
}


const styles = StyleSheet.create({
});