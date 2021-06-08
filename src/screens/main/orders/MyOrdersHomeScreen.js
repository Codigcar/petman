import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
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
    FlatList, SectionList, Linking
} from 'react-native';
import { Icon, Input, Rating, AirbnbRating, SearchBar, Avatar } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Carousel, Button, HeaderBackLeft, HeaderRight, Divider } from '../../../components';
import { fetchPOST } from '../../../utils/functions';
import MyOrderDetailScreen from './MyOrderDetailScreen';

const Stack = createStackNavigator();

export default function MyOrdersHomeScreen({ navigation, route }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ userRoot: route.params.userRoot }}
                options={{
                    title: 'Mis pedidos',
                    headerStyle: Styles.headerBarStyle,
                    headerTitleStyle: Styles.headerTitleStyle,
                    headerTitleAlign: 'center',
                    headerBackTitleVisible: false,
                    headerLeft: () => (
                        <HeaderBackLeft navigation={navigation} />
                    )
                }} />
            <Stack.Screen
                name="MyOrderDetailScreen"
                component={MyOrderDetailScreen} />
        </Stack.Navigator>
    );
}

function HomeScreen({ navigation, route }) {
    let SIZE = 80;
    const [items, setItems] = useState([]);

    useEffect(() => {
    });

    useFocusEffect(
        React.useCallback(() => {
            fetchPOST(Constant.URI.SALE_LIST, {
                "i_ccl_idcliente": route.params.userRoot.CCL_IdCliente
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
        }, [])
    );

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
                        <Avatar
                            rounded
                            size={SIZE}
                            source={{ uri: item.VTA_NombreFotoVeterinaria }}
                        />
                    </View>
                    <View style={{ justifyContent: "space-around", width: Constant.DEVICE.WIDTH - (SIZE + 40), paddingLeft: 10 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: -5 }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={[Styles.textBoldOpaque, { fontSize: 18, marginRight: 5 }]}>{item.VTA_NombreVeterinaria}</Text>
                                <Avatar
                                    size={20}
                                    onPress={() => {
                                        if (item.VTA_Celular !== "") {
                                            Linking.openURL('whatsapp://send?text=' + item.VTA_MensajeCelular + '&phone=' + item.VTA_Celular).then().catch(() => {
                                                Alert.alert('Error', 'No tiene la aplicación WhatsApp instalada.');
                                            });
                                        } else {
                                            navigation.navigate('MyOrderDetailScreen', { userRoot: route.params.userRoot, sale: item });
                                        }
                                    }}
                                    source={{ uri: item.VTA_ImagenCelular }}
                                />
                            </View>
                            <Button
                                buttonStyle={[Styles.button.primary, { width: 60, height: 20, borderWidth: 1 }]}
                                titleStyle={{ fontSize: 13 }}
                                title="ver"
                                onPress={() => {
                                    console.log(item);
                                    navigation.navigate('MyOrderDetailScreen', { userRoot: route.params.userRoot, sale: item });
                                }}
                            />
                        </View>
                        <View>
                            <Text style={[Styles.textLightGrey, { fontSize: 16, marginRight: 5 }]}>{item.V_EstadoPedido}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
                            <Text style={[Styles.textBoldOpaque, { fontSize: 14, color: Styles.colors.secondary }]}>Total:</Text>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 14, color: Styles.colors.secondary }]}>S/ {item.V_MontoTotal}</Text>
                        </View>
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
            ListHeaderComponent={
                <View style={{ height: 40, margin: 20, justifyContent: "space-between" }}>
                    <Text style={[Styles.textOpaque, { fontSize: 16 }]}>
                        Encuentra aquí tus pedidos y servicios anteriores y en curso.
                        </Text>
                </View>
            }
            renderItem={renderItems}
            renderSectionHeader={renderHeader}
        />
    );
}

const styles = StyleSheet.create({
});