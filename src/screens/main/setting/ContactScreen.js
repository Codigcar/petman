import React, { useLayoutEffect, useState, useEffect, useReducer } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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
    Linking
} from 'react-native';
import { Icon, Input, AirbnbRating, SearchBar, Avatar, ListItem } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Button, HeaderBackLeft, HeaderRight, Divider, InputText } from '../../../components';
import { fetchPOST } from '../../../utils/functions';
import qs from 'qs';

export default function ContactScreen({ navigation, route }) {
    console.log('ContactScreen: ' + JSON.stringify(route))
    const [item, setItem] = useState({});

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Contacto',
            headerStyle: Styles.headerBarStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerLeft: () => (
                <HeaderBackLeft navigation={navigation} />
            ),
            headerRight: () => (
                <HeaderRight navigation={navigation} userRoot={route.params.userRoot} />
            )
        });
    }, [navigation]);

    useEffect(() => {
        fetchPOST(Constant.URI.CONTACT_GET, null, function (response) {
            if (response.CodigoMensaje == 100) {
                setItem(response.Data[0]);
            } else {
                Alert.alert('', response.RespuestaMensaje);
            }
        })
    }, []);

    const callPhone = cellphone => {
        let url = '';
        let postalCode = '01';
        if (Platform.OS === 'android') {
            url = `tel:${postalCode}${cellphone}`;
        } else {
            url = `telprompt:${postalCode}${cellphone}`;
        }
        Linking.openURL(url).then().catch(() => {
            Alert.alert('Error', 'No se pudo abrir la aplicación.');
        });
    }

    const sendWhatsapp = cellphone => {
        let countryCode = '+51';
        let message = '';
        Linking.openURL('whatsapp://send?text=' + message + '&phone=' + countryCode + cellphone).then().catch(() => {
            Alert.alert('Error', 'No tiene la aplicación WhatsApp instalada.');
        });
    }

    const sendEmail = email => {
        let url = `mailto:${email}`;
        let subject = '';
        let body = '';

        const query = qs.stringify({
            subject: subject,
            body: body
        });

        if (query.length) {
            url += `?${query}`;
        }

        Linking.openURL(url).then().catch(() => {
            Alert.alert('Error', 'No tiene instalada ninguna aplicación de correo electrónico.');
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Styles.colors.background }}>
            <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
                <View style={styles.cardHeader } >
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <Text style={styles.textHeader}>{item.TituloMensaje}</Text>
                        </View>
                    </View>
                </View>
                <Divider />

                <ScrollView>
                    <View>
                        <View style={styles.cardImageContainer}>
                            <Image
                                style={styles.cardImage}
                                source={{ uri: item.FotoMensaje }}
                                resizeMode="contain"
                                >
                            </Image>
                        </View>
                        <View>
                            <View style={styles.cardContactDetail}>
                                <View style={styles.cardCellphoneText}>
                                    <Text style={{ fontSize: 18, fontFamily: Styles.fontBlinkerBold }}>{item.Celular1}</Text>
                                </View>
                                <Divider />
                                <View style={styles.cardAvatar}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 5, width: 110 }}>
                                        <Avatar
                                            size={43}
                                            rounded
                                            overlayContainerStyle={{ borderWidth: 1, borderColor: Styles.colors.opaque }}
                                            icon={{ name: 'cellphone', type: 'material-community', color: '#000' }}
                                            onPress={() => callPhone(item.Celular1)}
                                            activeOpacity={0.7}
                                        />
                                        <TouchableOpacity onPress={() => sendWhatsapp(item.Celular1)} activeOpacity={0.7}>
                                            <Icon name='whatsapp' type='font-awesome' color={Styles.colors.opaque} size={43} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.cardContactDetail}>
                                <View style={styles.cardCellphoneText}>
                                    <Text style={{ fontSize: 18, fontFamily: Styles.fontBlinkerBold }}>{item.Celular2}</Text>
                                </View>
                                <Divider />
                                <View style={styles.cardAvatar}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingLeft: 5, width: 110 }}>
                                        <Avatar
                                            size={43}
                                            rounded
                                            overlayContainerStyle={{ borderWidth: 1, borderColor: Styles.colors.opaque }}
                                            icon={{ name: 'cellphone', type: 'material-community', color: '#000' }}
                                            onPress={() => callPhone(item.Celular2)}
                                            activeOpacity={0.7}
                                        />
                                        <TouchableOpacity onPress={() => sendWhatsapp(item.Celular2)} activeOpacity={0.7}>
                                            <Icon name='whatsapp' type='font-awesome' color={Styles.colors.opaque} size={43} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.cardContactDetail}>
                                <View style={styles.cardCellphoneText}>
                                    <Text style={{ fontSize: 14, fontFamily: Styles.fontBlinkerBold }}>{item.Email}</Text>
                                </View>
                                <Divider />
                                <View style={styles.cardAvatar}>
                                    <Avatar size={43} rounded
                                        overlayContainerStyle={{ borderWidth: 1, borderColor: Styles.colors.opaque }}
                                        icon={{ name: 'email', type: 'material-community', color: '#000' }}
                                        onPress={() => sendEmail(item.Email)}
                                        activeOpacity={0.7}
                                    />
                                </View>
                            </View >
                            <View style={{ height: 80, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                <Text style={{ fontSize: 20, fontFamily: Styles.fontBlinkerBold, color: Styles.colors.opaque }}>{item.pieMensaje}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const Stack = createStackNavigator();


const styles = StyleSheet.create({
    cardHeader: {
        backgroundColor: "#FFF",
        height: 70,
        paddingLeft: 20,
        justifyContent: "center",
        marginBottom: 0,
        borderColor: Styles.colors.opaque,
        ...Platform.select({
            android: {
                elevation: 2,
            },
            default: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: { height: 0, width: 0 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
        })
    },
    textHeader: {
        fontSize: 22,
        fontFamily: Styles.fontBlinkerBold
    },
    cardImageContainer: {
        backgroundColor: 'white',
        borderWidth: 0,
        margin: 15,
        borderRadius: 20,
        ...Platform.select({
            android: {
                elevation: 1,
            },
            default: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: { height: 1, width: 1 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
        }),
    },
    cardImage: {
        width: null,
        height: 150,
        borderRadius: 20
    },
    cardContactDetail: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingRight: 20,
        backgroundColor: 'white',
        margin: 10,
        marginTop: 5,
        borderColor: Styles.colors.opaque,
        borderWidth: .1,
        borderRadius: 10,
        ...Platform.select({
            android: {
                elevation: 2,
            },
            default: {
                shadowColor: 'rgba(0,0,0, .2)',
                shadowOffset: { height: 1, width: 1 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
        }),
    },
    cardAvatar: {
        width: 110,
        alignItems: "flex-end"
    },
    cardCellphoneText: {
        width: 210
    }
});