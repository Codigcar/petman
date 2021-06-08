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
    FlatList, Pressable, Dimensions
} from 'react-native';
import { Icon, Rating, AirbnbRating, SearchBar, Avatar, Accessory, Overlay } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Carousel, Button, HeaderBackLeft, HeaderRight, DropDownPicker, Input, InputMask, Divider } from '../../../components';
import { fetchPOST, convertDateDDMMYYYY } from '../../../utils/functions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from "react-native-modal-datetime-picker";

let size_face = 40;
let size_pet = 30;

export default function PetProfileScreen({ navigation, route }) {
    // console.log('PetProfileScreen: ' + JSON.stringify(route));
    const [races, setRaces] = useState([]);

    const type = route.params.pet.TM_IdtipoMascota;
    const [name, setName] = useState(route.params.pet.MS_NombreMascota);
    const [lastname, setLastname] = useState(route.params.pet.MS_ApellidoMascota);
    const [race, setRace] = useState(route.params.pet.RZ_IdRaza);
    const [sex, setSex] = useState(route.params.pet.SE_IdSexoMascota);
    const [size, setSize] = useState(route.params.pet.TM_IdTamanoMascota);
    const [birthday, setBirthday] = useState(new Date(route.params.pet.MS_FechaNacimiento));
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [showGameOver, setShowGameOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [SignUpErrors, setSignUpErrors] = useState({});

    useEffect(() => {
        fetchPOST(Constant.URI.PARAMS, {
            "i_op": 3, "i_var1": Number(type), "i_var2": ""
        }, function (response) {
            const list = response.Data.map((e) => {
                return { label: e['RZ_NombreRaza'], value: e['RZ_IdRaza'], color: e['RZ_Color'] || Styles.colors.black }
            });
            setRace('');
            setRaces(list);
        })
    }, [type]);

    const handleSignUp = (die = false) => {
        setLoading(true);
        const rules = {
            I_MS_NombreMascota: 'required',
            I_ApellidoMascota: 'required',
            I_MS_FechaNacimiento: 'required'
        };

        const data = {
            I_MS_IdMascota: route.params.pet.MS_IdMascota,
            I_MS_NombreMascota: name,
            I_ApellidoMascota: lastname,
            I_GTB_Sexo: sex,
            I_MS_FechaNacimiento: birthday,
            I_RZ_IdRaza: race,
            I_GTB_IdTamano: size,
            I_MS_Foto: route.params.pet.MS_Foto,
            I_MS_Estado: die ? 0 : 1,
            I_USU_IdUsuario: route.params.userRoot.USU_IdUsuario
        };

        const messages = {
            required: 'Campo requerido'
        };

        validateAll(data, rules, messages)
            .then(() => {
                fetchPOST(Constant.URI.PET_UPDATE, data,
                    function (response) {
                        console.log('json response: ' + JSON.stringify(response));

                        Alert.alert('', response.RespuestaMensaje);
                        setLoading(false);
                        if (die) {
                            setShowGameOver(false);
                            navigation.goBack();
                        }
                    });
            })
            .catch(err => {
                setLoading(false);
                const formatError = {};
                err.forEach(err => {
                    formatError[err.field] = err.message;
                });
                setSignUpErrors(formatError);
            });
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (value) => {
        console.log("A date has been picked: ", value);
        console.log("A date has been picked: ", convertDateDDMMYYYY(value));
        setBirthday(value)
        hideDatePicker();
    };


    return (
        <ScrollView style={{ flex: 1, backgroundColor: Styles.colors.background }}>
            <Overlay isVisible={showGameOver} onBackdropPress={() => setShowGameOver(!showGameOver)} overlayStyle={{ padding: 0 }}  >
                <View style={{ width: Constant.DEVICE.WIDTH - 20, height: Constant.DEVICE.HEIGHT - 140, justifyContent: "space-between" }}>
                    <View>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableOpacity
                                activeOpacity={.8}
                                style={{ width: 30, height: 30, backgroundColor: Styles.colors.secondary, alignItems: "center", justifyContent: "center" }}
                                onPress={() => { setShowGameOver(false) }}
                            >
                                <Text style={{ color: Styles.colors.tertiary, fontSize: 13, bottom: 1 }}>x</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                            <Text style={[Styles.textBoldOpaque, { fontSize: 18, color: Styles.colors.secondary }]}>Game Over</Text>
                        </View>
                        <Divider />
                    </View>
                    <View style={{ height: 300, justifyContent: "flex-start", padding: 40, paddingTop: 10 }}>
                        <Text style={[Styles.fontBlinkerRegular, { fontSize: 14, color: Styles.colors.opaque }]}>
                            Más que una mascota fue tu mejor amigo, sin importar las dificultades siempre estuvo a tu lado para animarte y hacerte feliz.
                        </Text>
                        <Text style={[Styles.fontBlinkerRegular, { fontSize: 14, color: Styles.colors.opaque }]}>
                            Lamentamos el sensible fallecimiento de tu mascota y agradecemos la confianza depositada para cuidarlo durante todo este tiempo.
                        </Text>
                        <Text style={[Styles.fontBlinkerRegular, { fontSize: 14, color: Styles.colors.opaque }]}>
                            Atte. Petman
                        </Text>
                    </View>
                    <View style={{}}>
                        <Divider />
                        <Button
                            buttonStyle={[Styles.button.primary, { margin: 10, marginTop: 5, marginBottom: 5 }]}
                            title="aceptar"
                            onPress={() => {
                                handleSignUp(true);
                            }}
                            loading={loading}
                        />
                        <Button
                            buttonStyle={[Styles.button.primary, { margin: 10, marginTop: 5, marginBottom: 30 }]}
                            title="cancelar"
                            onPress={() => setShowGameOver(false)}
                            loading={loading}
                        />
                    </View>
                </View>
            </Overlay>
            <View style={{ margin: 20 }}>
                <View style={{ height: 160 }}>
                    <Input
                        label="Nombre"
                        value={name}
                        onChangeText={setName}
                        errorMessage={SignUpErrors ? SignUpErrors.name : null}
                    />
                    <Input
                        label="Apellido"
                        value={lastname}
                        onChangeText={setLastname}
                        errorMessage={SignUpErrors ? SignUpErrors.lastname : null}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 150 }}>
                    <View style={{ width: (Constant.DEVICE.WIDTH / 2) - 30, marginLeft: 10 }}>
                        <Text style={[Styles.textOpaque, { fontSize: 12 }]}>Raza</Text>
                        {races.length == 0
                            ? <></>
                            : <DropDownPicker
                                key={race}
                                placeholder={{}}
                                items={races}
                                onValueChange={setRace}
                                value={race}
                                style={{
                                    inputAndroid: { backgroundColor: 'transparent', margin: -1 },
                                    iconContainer: { top: 5 }
                                }}
                                useNativeAndroidPickerStyle={false}
                                textInputProps={{ underlineColorAndroid: Styles.colors.gris }}
                                Icon={() => {
                                    return <Icon name='keyboard-arrow-down' type='material' size={30} color={Styles.colors.gris} />;
                                }}
                            />}
                        <View style={{ width: (Constant.DEVICE.WIDTH / 2) - 15, alignItems: "flex-end" }}>
                            <Text style={[Styles.textOpaque, { margin: -10, fontSize: 12, color: Styles.colors.error }]}>{SignUpErrors ? SignUpErrors.race : null}</Text>
                        </View>
                    </View>
                    <View style={{ marginRight: 10 }}>
                        <Text style={[Styles.textOpaque, { fontSize: 12 }]}>Sexo</Text>
                        <View style={{ flexDirection: "row", justifyContent: "flex-start", paddingTop: 10 }}>
                            <Pressable
                                activeOpacity={0.8}
                                onPress={() => { setSex(1) }}
                            >
                                <View>
                                    <View style={{ borderWidth: 3, borderRadius: 5, marginRight: 5, borderColor: sex == 1 ? Styles.colors.cian : Styles.colors.gris }}>
                                        <Image
                                            style={{ width: size_face, height: size_face, alignItems: "center", margin: 10, }}
                                            source={Constant.GLOBAL.PET_SEX[sex].male}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={[styles.titleTypePet, { color: sex == 1 ? Styles.colors.cian : Styles.colors.gris }]}>Macho</Text>
                                </View>
                            </Pressable>
                            <Pressable
                                activeOpacity={0.8}
                                onPress={() => { setSex(2) }}
                            >
                                <View>
                                    <View style={{ borderWidth: 3, borderRadius: 5, marginLeft: 5, borderColor: sex == 2 ? Styles.colors.secondary : Styles.colors.gris }}>
                                        <Image
                                            style={{ width: size_face, height: size_face, alignItems: "center", margin: 10, }}
                                            source={Constant.GLOBAL.PET_SEX[sex].female}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={[styles.titleTypePet, { color: sex == 2 ? Styles.colors.secondary : Styles.colors.gris }]}>Hembra</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 100 }}>
                    <Pressable
                        activeOpacity={0.8}
                        onPress={() => { setSize(1) }}
                    >
                        <View style={{ width: size_pet + 60, height: size_pet + 60 }} >
                            <View style={{ width: size_pet + 60, height: size_pet + 20, alignItems: "center", justifyContent: "flex-end" }} >
                                <Image
                                    style={{ width: size_pet, height: size_pet, /* margin: 30, marginBottom: 0 */ }}
                                    source={Constant.GLOBAL.PET_TYPE[type].img_size_pet}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={[Styles.textOpaque, { fontSize: 12, textAlign: "center", color: size == 1 ? Styles.colors.cian : Styles.colors.gris }]}>Pequeño</Text>
                            <Text style={[Styles.textLightGrey, { fontSize: 9, textAlign: "center", color: size == 1 ? Styles.colors.cian : Styles.colors.gris }]}>Hasta 30 cm</Text>
                            <Text style={[Styles.textLightGrey, { fontSize: 9, textAlign: "center", color: size == 1 ? Styles.colors.cian : Styles.colors.gris }]}>Peso: 0-15K</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        activeOpacity={0.8}
                        onPress={() => { setSize(2) }}
                    >
                        <View style={{ width: size_pet + 60, height: size_pet + 60 }} >
                            <View style={{ width: size_pet + 60, height: size_pet + 20, alignItems: "center", justifyContent: "flex-end" }} >
                                <Image
                                    style={{ width: size_pet + 20, height: size_pet + 20, /* margin: 20, marginBottom: 0 */ }}
                                    source={Constant.GLOBAL.PET_TYPE[type].img_size_pet}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={[Styles.textOpaque, { fontSize: 12, textAlign: "center", color: size == 2 ? Styles.colors.cian : Styles.colors.gris }]}>Mediano</Text>
                            <Text style={[Styles.textLightGrey, { fontSize: 9, textAlign: "center", color: size == 2 ? Styles.colors.cian : Styles.colors.gris }]}>30 - 40 cm</Text>
                            <Text style={[Styles.textLightGrey, { fontSize: 9, textAlign: "center", color: size == 2 ? Styles.colors.cian : Styles.colors.gris }]}>Peso: 15-25K</Text>
                        </View>
                    </Pressable>
                    <Pressable
                        activeOpacity={0.8}
                        onPress={() => { setSize(3) }}
                    >
                        <View style={{ width: size_pet + 60, height: size_pet + 60 }} >
                            <View style={{ width: size_pet + 60, height: size_pet + 20, alignItems: "center", justifyContent: "flex-end" }} >
                                <Image
                                    style={{ width: size_pet + 30, height: size_pet + 30, /* margin: 15, marginBottom: 0 */ }}
                                    source={Constant.GLOBAL.PET_TYPE[type].img_size_pet}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={[Styles.textOpaque, { fontSize: 12, textAlign: "center", color: size == 3 ? Styles.colors.cian : Styles.colors.gris }]}>Grande</Text>
                            <Text style={[Styles.textLightGrey, { fontSize: 9, textAlign: "center", color: size == 3 ? Styles.colors.cian : Styles.colors.gris }]}>40 - 60 cm</Text>
                            <Text style={[Styles.textLightGrey, { fontSize: 9, textAlign: "center", color: size == 3 ? Styles.colors.cian : Styles.colors.gris }]}>Peso: 25-45K</Text>
                        </View>
                    </Pressable>

                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between", height: 100 }}>
                    <View style={{ width: (Constant.DEVICE.WIDTH / 2) - 15, paddingTop: 20 }}>
                        <Pressable
                            activeOpacity={0.8}
                            onPress={showDatePicker}
                        >
                            <InputMask
                                label="Cumpleaños"
                                value={convertDateDDMMYYYY(birthday)}
                                onChangeText={setBirthday}
                                placeholder="--/--/----/"
                                rightIcon={
                                    <Icon name='calendar' type='font-awesome' size={20} color={Styles.colors.gris} />
                                }
                                errorMessage={SignUpErrors ? SignUpErrors.birthday : null}
                                type={'datetime'}
                                inputStyle={[Styles.textOpaque, { fontSize: 14, height: 45, right: 4 }]}
                                options={{
                                    format: 'DD/MM/YYYY'
                                }}
                                disabled={true}
                            />
                        </Pressable>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            date={birthday}
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                    <View style={{ justifyContent: "flex-end", alignItems: "flex-end", paddingBottom: 20, marginRight: 5 }}>
                        <Pressable
                            activeOpacity={0.8}
                            onPress={() => { setShowGameOver(true) }}
                        >
                            <Image style={{ width: 120, height: 40, resizeMode: "cover" }}
                                source={Constant.GLOBAL.IMAGES.GAME_OVER}
                            />
                        </Pressable>
                    </View>
                </View>
                <View style={{ height: 100 }}>
                    <Button
                        buttonStyle={[Styles.button.primary, {}]}
                        title="guardar cambios"
                        onPress={() => handleSignUp()}
                        loading={loading}
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    titleTypePet: {
        color: Styles.colors.gris,
        fontFamily: Styles.fontAldrichRegular,
        textAlign: "center",
        fontSize: 10,
        // marginTop: 5,
        // marginBottom: 15
    },
});