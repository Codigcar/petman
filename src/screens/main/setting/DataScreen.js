import React, { useContext, useState, useLayoutEffect } from 'react';
import { Collapse, CollapseBody, CollapseHeader } from "accordion-collapse-react-native";
import { KeyboardAvoidingView, StyleSheet, Text, SafeAreaView, View, Image, ScrollView, ImageBackground, Alert } from 'react-native';
import Constant from '../../../utils/constants';
import { Styles } from '../../../assets/css/Styles';
import { AuthContext } from '../../../components/authContext';
import CheckBox from '@react-native-community/checkbox';
import { validateAll } from 'indicative/validator';
import { fetchPOST } from '../../../utils/functions';
import { Button, HeaderBackLeft, HeaderRight, Divider, Input } from '../../../components';

const DataScreen = ({ navigation, route }) => {
  // console.log('DataScreen: ' + JSON.stringify(route))

  const [name, setName] = useState(route.params.userRoot.CCL_Nombre);
  const [lastname, setLastname] = useState(route.params.userRoot.CCL_ApePaterno);
  const [motherLastname, setMotherLastname] = useState(route.params.userRoot.CCL_ApeMaterno);
  const [cellphone, setCellphone] = useState(route.params.userRoot.CCL_Celular);
  const [email, setEmail] = useState(route.params.userRoot.CCL_Email);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [SignUpErrors, setSignUpErrors] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Mis datos personales',
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

  const handleSignUp = () => {
    const rules = {
      name: 'required',
      lastname: 'required',
      motherLastname: 'required',
      cellphone: 'required',
      email: 'required|email'
    };

    const data = {
      name: name,
      lastname: lastname,
      motherLastname: motherLastname,
      cellphone: cellphone,
      email: email
    };

    const messages = {
      required: 'Campo requerido',
      'email.email': 'Email no válido',
      'min': 'Valor demasiado corto',
      'same': 'El valor debe ser igual a nueva contraseña'
    };

    if (oldPassword.length > 0 || password.length > 0 || passwordConfirm.length > 0) {
      rules.oldPassword = 'required|string|min:6';
      rules.password = 'required|string|min:6';
      rules.passwordConfirm = 'same:password';
      data.oldPassword = oldPassword;
      data.password = password;
      data.passwordConfirm = passwordConfirm;
    }

    validateAll(data, rules, messages)
      .then(() => {

        fetchPOST(Constant.URI.USER_UPDATE, {
          "i_usu_contrasena_anterior": oldPassword,
          "i_usu_contrasena": password,
          "i_ccl_nombre": name,
          "i_ccl_apepaterno": lastname,
          "i_ccl_apematerno": motherLastname,
          "i_ccl_email": email,
          "i_ccl_celular": cellphone,
          "i_usu_idusuario": route.params.userRoot.USU_IdUsuario,
          "i_ccl_idcliente": route.params.userRoot.CCL_IdCliente
        }, function (response) {
          Alert.alert("", response.RespuestaMensaje, [{ text: "OK" }], { cancelable: false });
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
    <SafeAreaView style={{ backgroundColor: Styles.colors.background }}>
      <ScrollView >
        <View style={{ width: Constant.DEVICE.WIDTH, marginTop: 10 }}>

          <View style={{ borderWidth: 0 }}>
            <Text style={Styles.title}>¡Hola Humano!</Text>
            <Text style={Styles.subTitle}>¿Quieres actualizar tus datos?</Text>
          </View>
          <View style={{ marginLeft: 10, marginRight: 10 }}>
            <Input
              label="DNI"
              value={route.params.userRoot.CCL_Documento}
              disabled={true}
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
              label="Ingresa tu contraseña anterior"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              errorMessage={SignUpErrors ? SignUpErrors.oldPassword : null}
            />
            <Input
              label="Ingresa una nueva contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              errorMessage={SignUpErrors ? SignUpErrors.password : null}
            />
            <Input
              label="Confirma tu nueva contraseña"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry
              errorMessage={SignUpErrors ? SignUpErrors.passwordConfirm : null}
            />
          </View>

          <View style={{ margin: 20 }}>
            <Button
              buttonStyle={Styles.button.primary}
              title="guardar"
              onPress={() => handleSignUp()}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  collapse: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 1,
    backgroundColor: '#FFF'
  },
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    padding: 10,
    backgroundColor: '#FFF',
  }
});

export default DataScreen;