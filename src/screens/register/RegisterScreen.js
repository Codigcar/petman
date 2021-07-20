import React, { useContext, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Linking, Text, Pressable, View, Image, ScrollView, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { Background, Button, Input } from '../../components';
import Constant from '../../utils/constants';
import { Styles } from '../../assets/css/Styles';
import { AuthContext } from '../../components/authContext';
import CheckBox from '@react-native-community/checkbox';
import { validateAll } from 'indicative/validator';
import { fetchPOST } from '../../utils/functions';


const RegisterScreen = ({ navigation, route }) => {
  console.log('RegisterScreen: ' + JSON.stringify(route))

  const [dni, setDni] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [motherLastname, setMotherLastname] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [SignUpErrors, setSignUpErrors] = useState({});

  const [policies, setPolicies] = useState('');

  const [acceptTerms, setAcceptTerms] = useState(false);

  const { signUpPet, signIn } = useContext(AuthContext);

  useEffect(() => {
    fetchPOST(Constant.URI.PRIVACITY_POLICIES, {}, function (response) {
      setPolicies(response.Data[0].RutaPolitica)
    })
  }, []);

  const handleSignUp = () => {
    const rules = {
      dni: 'required',
      name: 'required',
      lastname: 'required',
      motherLastname: 'required',
      cellphone: 'required',
      email: 'required|email',
      password: 'required|string|min:6'
    };

    const data = {
      dni: dni,
      name: name,
      lastname: lastname,
      motherLastname: motherLastname,
      cellphone: cellphone,
      email: email,
      password: password
    };

    const messages = {
      required: 'Campo requerido',
      'email.email': 'Email no válido',
      'min': 'Valor demasiado corto'
    };

    validateAll(data, rules, messages)
      .then(() => {

        fetchPOST(Constant.URI.USER_REGISTRY, {
          "i_usu_usuario": dni,
          "i_usu_contrasena": password,
          "i_ccl_documento": dni,
          "i_ccl_nombre": name,
          "i_ccl_apepaterno": lastname,
          "i_ccl_apematerno": motherLastname,
          "i_ccl_email": email,
          "i_ccl_celular": cellphone
        }, function (response) {
          if (response.CodigoMensaje == 100) {
            console.log("DATA: " + JSON.stringify(data) + "-" + acceptTerms);
            data.CCL_IdCliente = response.Data[0].Usu_CCL_IdCliente;
            data.Usu_IdUsuario = response.Data[0].Usu_IdUsuario;
            signUpPet(data);
          } else {
            Alert.alert("", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
          }
        })

      })
      .catch(err => {
        const formatError = {};
        err.forEach(err => {
          formatError[err.field] = err.message;
        });
        setSignUpErrors(formatError);
      });
  };

  return (
    <KeyboardAvoidingView behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR}>
      <ScrollView>
        <ImageBackground
          source={Constant.GLOBAL.IMAGES.BACKGROUND}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
          imageStyle={{ width: Constant.DEVICE.WIDTH, height: 150 }}
        >
          <View style={{ height: 200 }}>
            <View style={{ height: 90 }}>
              <Image
                style={{ width: Constant.DEVICE.WIDTH, height: 50, justifyContent: "center", margin: 10 }}
                source={Constant.GLOBAL.IMAGES.LOGO}
                resizeMode="contain"
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", width: Constant.DEVICE.WIDTH, height: 100 }}>
              <Image
                style={{ width: 90, height: 90, alignItems: "center", marginTop: 20, marginBottom: 20, marginRight: 10 }}
                source={Constant.GLOBAL.IMAGES.FACE_MAN}
                resizeMode="contain"
              />
              <Image
                style={{ width: 90, height: 90, alignItems: "center", marginTop: 20, marginBottom: 20, marginLeft: 10 }}
                source={Constant.GLOBAL.IMAGES.FACE_WOMEN}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={{ width: Constant.DEVICE.WIDTH, marginTop: 10 }}>

            <View style={{ borderWidth: 0 }}>
              <Text style={Styles.title}>¡Hola Humano!</Text>
              <Text style={Styles.subTitle}>Necesitamos tus datos para empezar</Text>

              <View style={{ marginLeft: 10, marginRight: 10 }}>
                <Input
                  label="DNI"
                  value={dni}
                  onChangeText={setDni}
                  maxLength={8}
                  keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_NUMERIC}
                  errorMessage={SignUpErrors ? SignUpErrors.dni : null}
                />
                <Input
                  label="Nombre"
                  value={name}
                  onChangeText={setName}
                  errorMessage={SignUpErrors ? SignUpErrors.name : null}
                />
                <Input
                  label="Apellido paterno"
                  value={lastname}
                  onChangeText={setLastname}
                  errorMessage={SignUpErrors ? SignUpErrors.lastname : null}
                />
                <Input
                  label="Apellido materno"
                  value={motherLastname}
                  onChangeText={setMotherLastname}
                  errorMessage={SignUpErrors ? SignUpErrors.motherLastname : null}
                />
                <Input
                  label="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_EMAIL}
                  errorMessage={SignUpErrors ? SignUpErrors.email : null}
                />
                <Input
                  label="Celular"
                  value={cellphone}
                  onChangeText={setCellphone}
                  keyboardType={Constant.GLOBAL.KEYBOARD_TYPE_NUMERIC}
                  errorMessage={SignUpErrors ? SignUpErrors.cellphone : null}
                />
                <Input
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  errorMessage={SignUpErrors ? SignUpErrors.password : null}
                />
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, marginLeft: 5, margin: 10 }}>
                  <CheckBox
                    disabled={false}
                    value={acceptTerms}
                    onValueChange={(newValue) => setAcceptTerms(newValue)}
                  />
                  <Text style={[Styles.textOpaque, { fontSize: 14 }]}>He leído y acepto la </Text>
                  <Pressable
                    onPress={() => {
                      Linking.openURL(policies).then().catch(() => {
                        Alert.alert('Error', 'No se puede abrir la URL.');
                      });
                    }}>
                    <Text style={[Styles.textOpaque, { fontSize: 14, color: Styles.colors.secondary }]}>Política de privacidad</Text>
                  </Pressable>
                </View>

                <View style={{ borderWidth: 0 }}>
                  <Button
                    buttonStyle={Styles.button.primary}
                    disabled={!(dni != "" && name != "" && email != "" && cellphone != "" && password != "" && acceptTerms)}
                    title="siguiente"
                    onPress={() => handleSignUp()}
                  />
                  
                  <TouchableOpacity onPress={() => signIn()}>
                    <Text style={[Styles.textOpaque, { textAlign: 'center', fontSize: 14, marginBottom: 15 }]} >Iniciar sesión</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;