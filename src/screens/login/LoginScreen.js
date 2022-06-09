import React, { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, Pressable, View, Image, ScrollView, ImageBackground, Alert } from 'react-native';
import { Background, Button, Input, Loading } from '../../components';
import Constant from '../../utils/constants';
import { Styles } from '../../assets/css/Styles';
import { AuthContext } from '../../components/authContext';
import { validateAll } from 'indicative/validator';
import { fetchPOST } from '../../utils/functions';
import AsyncStorage from '@react-native-community/async-storage';


const LoginScreen = ({ route }) => {
  const [dni, setdni] = useState('32132132');
  const [password, setPassword] = useState('123123');
  const [loading, setLoading] = useState(false);
  const [SignUpErrors, setSignUpErrors] = useState({});
  const [isViewLoading, setIsViewLoading] = useState(true);
  
  const { signIn, signUp, forgotPassword } = useContext(AuthContext);


  const getDataUser = async() => {
    const dniStorage = await AsyncStorage.getItem('dniStorage');
    const passwordStorage = await AsyncStorage.getItem('passwordStorage');
    // console.log('dniStorage ', dniStorage);
    // console.log('passwordStorage ', passwordStorage);

    if(!dniStorage){
      console.log('No hay data en el Storage');
    }  else {
      fetchPOST(Constant.URI.LOGIN, {
        "i_usu_usuario": dniStorage,
        "i_usu_contrasena": passwordStorage,
        "i_usu_devicetoken": route.params.deviceToken
      }, function (response) {
        if (response.CodigoMensaje == 100) {
          console.log('data', response.Data[0]);
          const _storeData = async () => {
            try {
              signIn({ data: response.Data[0] });
            } catch (error) {
              console.error('Error: ' + error);
            }
          };
          _storeData();
        } else {
          Alert.alert('', response.RespuestaMensaje);
        }
      })
      setIsViewLoading(false);
    }
    
  }

  useEffect(() => {
      getDataUser();
  }, [])

  const handleSignIn = () => {
    setLoading(true);
    const rules = {
      dni: 'required|min:8|max:8',
      password: 'required|string|min:6|max:10'
    };

    const data = {
      dni: dni,
      password: password
    };

    const messages = {
      required: 'Campo requerido',
      'min': 'Valor demasiado corto',
      'max': 'Valor demasiado largo',
      'password.min': '¿Olvidó la contraseña?'
    };

    validateAll(data, rules, messages)
      .then(() => {
        fetchPOST(Constant.URI.LOGIN, {
          "i_usu_usuario": dni,
          "i_usu_contrasena": password,
          "i_usu_devicetoken": route.params.deviceToken
        }, function (response) {
          setLoading(false);
          // console.log('route.params.deviceToken: ',route.params.deviceToken);
          if (response.CodigoMensaje == 100) {
            const _storeData = async () => {
              try {
                console.log('Login data: ',response.Data[0]);
                signIn({ data: response.Data[0] });
                console.log(response.Data[0]);
                // await AsyncStorage.setItem('usuario',response.Data[0].USU)
              } catch (error) {
                console.error('Error: ' + error);
              }
            };
            _storeData();
          } else {
            Alert.alert('', response.RespuestaMensaje);
          }
        })

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

  return (  
    (isViewLoading) &&
    <KeyboardAvoidingView behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR}>
      <Loading visible={loading} overlayColor={Styles.colors.background} />
      <ImageBackground
        source={Constant.GLOBAL.IMAGES.BACKGROUND}
        resizeMode="cover"
        style={{ width: Constant.DEVICE.WIDTH, height: Constant.DEVICE.HEIGHT }}
        imageStyle={{ width: Constant.DEVICE.WIDTH, height: 180 }}
      >
        <ScrollView>
          <View style={{ height: 270,  marginTop:40 }}>
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
            <View>
              <Text style={StyleSheet.flatten([Styles.textOpaque, Styles.title])}>¡Bienvenido Humano!</Text>
              <Text style={StyleSheet.flatten([Styles.textOpaque, Styles.subTitle])}>Ingresa tus datos para comenzar</Text>
            </View>
          </View>

          <View style={{ margin: 10, marginBottom: 0 }}>
            <Input
              label="DNI"
              value={dni}
              onChangeText={setdni}
              maxLength={8}
              keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_NUMERIC}
              errorMessage={SignUpErrors ? SignUpErrors.dni : null}
            />
            <Input
              label="Ingresar contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              errorMessage={SignUpErrors ? SignUpErrors.password : null}
            />

            <View style={{ alignItems: "flex-end", paddingRight: 15 }}>
              <Pressable onPress={() => forgotPassword()} >
                <Text style={StyleSheet.flatten([Styles.textSecondary, { fontSize: 12 }])}>Olvidé mi contraseña</Text>
              </Pressable>
            </View>
          </View>

          <View style={{ marginLeft: 20, marginRight: 20 }}>
            <Button
              buttonStyle={Styles.button.primary}
              title="ingresar"
              onPress={() => handleSignIn()}
              disabled={loading}
            />
          </View>
          <View>

            <View style={{ alignItems: 'center' }}>
              <Text style={StyleSheet.flatten([Styles.textOpaque, { fontSize: 14 }])}>¿No tienes una cuenta?</Text>
            </View>
            <Button
              containerStyle={{ marginLeft: 20, marginRight: 20, marginBottom: 30 }}
              buttonStyle={Styles.button.secondary}
              title="crear cuenta"
              onPress={() => signUp()}
              disabled={loading}
            />
          </View>

        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;