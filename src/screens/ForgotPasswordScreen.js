import { validateAll } from 'indicative/validator';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Styles } from '../assets/css/Styles';
import { Input, Button, Loading } from '../components';
import { AuthContext } from '../components/authContext';
import Constant from '../utils/constants';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [SignUpErrors, setSignUpErrors] = useState({});

    const { signIn } = useContext(AuthContext);

    const handleSignIn = () => {
        setLoading(true);
        const rules = {
            email: 'required|email'
        };

        const data = {
            email: email
        };

        const messages = {
            required: 'Campo requerido',
            'email.email': 'Email no válido'
        };

        validateAll(data, rules, messages)
            .then(() => {
                setSignUpErrors('');
                fetch(Constant.URI.FORGOT_PASSWORD, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "i_ccl_email": email
                    })
                })
                    .then((response) => response.json())
                    .then((response) => {
                        setLoading(false);
                        Alert.alert("", response.RespuestaMensaje, [{ text: "OK", onPress: () => signIn() }], { cancelable: false });
                    })
                    .catch((error) => console.error(error));
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

    useEffect(() => { }, [SignUpErrors]);

    return (
        <KeyboardAvoidingView behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR} style={{ flex: 1 }}>
            <Loading visible={loading} overlayColor={Styles.colors.background} />
            <ImageBackground
                source={Constant.GLOBAL.IMAGES.BACKGROUND}
                style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
                imageStyle={{ position: "absolute", width: Constant.DEVICE.WIDTH, height: 150 }}
            >
                <View style={{ flex: 1, justifyContent: "space-between" }}>
                    <View style={{ height: 350 }}>
                        <View style={{ height: 90 }}>
                            <Image
                                style={{ width: Constant.DEVICE.WIDTH, height: 50, justifyContent: "center", margin: 10 }}
                                source={Constant.GLOBAL.IMAGES.LOGO}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "center", width: Constant.DEVICE.WIDTH, height: 90, marginTop: 10 }}>
                            <Image
                                style={{ width: 90, height: 90, alignItems: "center", marginRight: 10 }}
                                source={Constant.GLOBAL.IMAGES.FACE_MAN}
                                resizeMode="contain"
                            />
                            <Image
                                style={{ width: 90, height: 90, alignItems: "center", marginLeft: 10 }}
                                source={Constant.GLOBAL.IMAGES.FACE_WOMEN}
                                resizeMode="contain"
                            />
                        </View>

                        <View style={{ height: 60, alignItems: "center" }}>
                            <Image
                                style={{ width: 60, height: 60, alignItems: "center" }}
                                source={Constant.GLOBAL.IMAGES.SECURE}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text style={StyleSheet.flatten([Styles.textOpaque, Styles.title])}>Ups... no te preocupes</Text>
                            <Text style={StyleSheet.flatten([Styles.textOpaque, Styles.subTitle, { width: Constant.DEVICE.WIDTH - 40 }])}>Ingresa tu correo electrónico y en segundos recuperarás tu cuenta.</Text>
                        </View>
                    </View>
                    <View style={{ margin: 10 }}>
                        <Input
                            label="Correo electrónico"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_EMAIL}
                            leftIcon={
                                <Icon name='account-outline' type='material-community' size={25} color={Styles.colors.opaque} />
                            }
                            errorMessage={SignUpErrors ? SignUpErrors.email : null}
                        />
                    </View>
                    <View style={{ margin: 20 }}>
                        <Button
                            buttonStyle={Styles.button.primary}
                            title="Solicitar contraseña"
                            onPress={() => handleSignIn()}
                            disabled={loading}
                        />

                        <TouchableOpacity onPress={() => signIn()}>
                            <Text style={[Styles.textOpaque, { textAlign: 'center', fontSize: 14 }]} >Iniciar sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    cardTitleContainer: {
        paddingBottom: 20
    },
    cardTitle: {
        fontSize: 14,
        ...Platform.select({
            default: {
                fontWeight: 'bold',
            },
        }),
        textAlign: 'center',
        marginBottom: 15,
    },
    imageCardTitle: {
        marginTop: 15,
    },
    titleStyle: {
        fontSize: 26
    },
    subTitleStyle: {
        color: Styles.colors.opaque,
        textAlign: "center"
    }
});

export default ForgotPasswordScreen;
