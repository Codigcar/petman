import React, { useLayoutEffect, useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, Pressable, View, Image, ScrollView, ImageBackground, Alert, Modal } from 'react-native';
import { Background, Button, Input, DropDownPicker, InputMask, HeaderBackLeft } from '../../../components';
import { Icon, Overlay } from 'react-native-elements';
import Constant from '../../../utils/constants';
import { Styles } from '../../../assets/css/Styles';
import { validateAll } from 'indicative/validator';
import { fetchPOST, convertDateDDMMYYYY } from '../../../utils/functions';
import DateTimePickerModal from "react-native-modal-datetime-picker";

let size_face = 40;
let size_pet = 30;

export default function AddPetScreen({ navigation, route }) {
  const [races, setRaces] = useState([]);

  const [type, setType] = useState('1');
  const [sex, setSex] = useState(1);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birthday, setBirthday] = useState(new Date());
  const [race, setRace] = useState(0);
  const [size, setSize] = useState(2);

  const [success, setSuccess] = useState(false);
  const [SignUpErrors, setSignUpErrors] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Nueva mascota',
      headerStyle: Styles.headerBarStyle,
      headerTitleStyle: Styles.headerTitleStyle,
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerLeft: () => (
        <HeaderBackLeft navigation={navigation} />
      )
    });
  }, [navigation]);

  useEffect(() => {
    fetchPOST(Constant.URI.PARAMS, {
      "i_op": 3, "i_var1": Number(type), "i_var2": ""
    }, function (response) {
      const list = response.Data.map((e) => {
        return { label: e['RZ_NombreRaza'], value: e['RZ_IdRaza'], color: e['RZ_Color'] || Styles.colors.gris }
      });
      setRaces(list);
    })
  }, [type]);

  const handleSignUp = () => {
    const rules = {
      name: 'required',
      lastname: 'required',
      birthday: 'required',
      race: 'required'
    };

    const data = {
      name: name,
      lastname: lastname,
      birthday: birthday,
      race: race
    };

    const messages = {
      required: 'Campo requerido'
    };
console.log('raza: ' + race)
    validateAll(data, rules, messages)
      .then(() => {

        fetchPOST(Constant.URI.PET_REGISTRY, {
          "I_CCL_IdCliente": route.params.userRoot.CCL_IdCliente,
          "I_MS_NombreMascota": name,
          "I_ApellidoMascota": lastname,
          "I_MS_IdtipoMascota": type,
          "I_GTB_Sexo": sex,
          "I_MS_FechaNacimiento": birthday,
          "I_RZ_IdRaza": race,
          "I_GTB_IdTamano": size,
          "I_MS_Foto": "",
          "I_USU_IdUsuario_Registro": route.params.userRoot.Usu_IdUsuario
        }, function (response) {
          if (response.CodigoMensaje == 100) {
            showModal();
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

  const showModal = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigation.goBack();
    }, 2000);
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
    <KeyboardAvoidingView behavior={Constant.GLOBAL.KEYBOARD_BEHAVIOR}>
      <Modal
        animationType="slide"
        visible={success}
        onRequestClose={() => {
          navigation.goBack();
        }}
      >
        <View style={{ width: '100%', height: '100%', justifyContent: "center" }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: Constant.DEVICE.WIDTH, height: 100 }}>
            <Image
              style={{ width: 76, height: 72, alignItems: "center", marginTop: 20, marginBottom: 20, marginRight: 10 }}
              source={Constant.GLOBAL.IMAGES.FACE_DOG}
              resizeMode="contain"
            />
            <Image
              style={{ width: 76, height: 72, alignItems: "center", marginTop: 20, marginBottom: 20, marginLeft: 10 }}
              source={Constant.GLOBAL.IMAGES.FACE_CAT}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={[Styles.textOpaque, { fontSize: 26, color: Styles.colors.secondary, textAlign: "center" }]}>¡Gracias por registrar a tu(s) mascota(s)!</Text>
          </View>
        </View>
      </Modal>
      <ScrollView style={{ backgroundColor: Styles.colors.background }}>
        <View style={{ flexDirection: "row", justifyContent: "center", width: Constant.DEVICE.WIDTH }}>
          <Image
            style={{ width: 110, height: 110, alignItems: "center", margin: 10, marginTop: 20, marginBottom: 5 }}
            source={Constant.GLOBAL.PET_TYPE[type].img_upload}
            resizeMode="contain"
          />
        </View>
        <View style={{ width: Constant.DEVICE.WIDTH, paddingLeft: 10, paddingRight: 10 }}>
          <View style={{ borderWidth: 0 }}>
            <View style={{ width: Constant.DEVICE.WIDTH - 20, alignItems: "center" }}>
              <Text style={[Styles.title, { width: 270 }]}>Cuéntanos más sobre tu mascota</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: Constant.DEVICE.WIDTH / 2 }}>
                <Text style={styles.subTitle}>Tipo de mascota</Text>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", paddingLeft: 5 }}>
                  <Pressable
                    activeOpacity={0.8}
                    onPress={() => { setType('1') }}
                  >
                    <View style={{ borderWidth: 3, borderRadius: 5, marginRight: 5, borderColor: type == '1' ? Styles.colors.secondary : Styles.colors.gris }}>
                      <Image
                        style={{ width: size_face, height: size_face, alignItems: "center", margin: 10, paddingLeft: 0 }}
                        source={Constant.GLOBAL.IMAGES.FACE_DOG}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={[styles.titleTypePet, { color: type == '1' ? Styles.colors.secondary : Styles.colors.gris }]} >Perro</Text>
                  </Pressable>
                  <Pressable
                    activeOpacity={0.8}
                    onPress={() => { setType('2') }}
                  >
                    <View style={{ borderWidth: 3, borderRadius: 5, marginLeft: 5, borderColor: type == '2' ? Styles.colors.secondary : Styles.colors.gris }}>
                      <Image
                        style={{ width: size_face, height: size_face, alignItems: "center", margin: 10 }}
                        source={Constant.GLOBAL.IMAGES.FACE_CAT}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={[styles.titleTypePet, { color: type == '2' ? Styles.colors.secondary : Styles.colors.gris }]} >Gato</Text>
                  </Pressable>
                </View>
              </View>
              <View style={{ width: Constant.DEVICE.WIDTH / 2 }}>
                <Text style={styles.subTitle}>Sexo</Text>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", paddingLeft: 5 }}>
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

            <View>
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
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: Constant.DEVICE.WIDTH / 2 }}>
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
                    isDarkModeEnabled={true}
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </View>
                <View style={{ width: Constant.DEVICE.WIDTH / 2 }}>
                  <Text style={{ color: Styles.colors.lightGrey, fontSize: 12 }} >Raza</Text>
                  {races.length === 0
                    ? <></>
                    :
                    <DropDownPicker
                      placeholder={{}}
                      items={races}
                      onValueChange={setRace}
                      value={race}
                      style={{
                        inputAndroid: { backgroundColor: 'transparent', width: (Constant.DEVICE.WIDTH / 2) - 30, margin: -1 },
                        inputIOS: { backgroundColor: 'transparent', top: 10 },
                        iconContainer: { top: 5, right: 30 }
                      }}
                      touchableWrapperProps={{
                        style: { justifyContent: 'center' }
                      }}
                      useNativeAndroidPickerStyle={false}
                      textInputProps={{ underlineColorAndroid: Styles.colors.gris }}
                      Icon={() => {
                        return <Icon name='keyboard-arrow-down' type='material' size={30} color={Styles.colors.gris} />;
                      }}
                    />
                  }
                  <View style={{ width: (Constant.DEVICE.WIDTH / 2) - 45, alignItems: "flex-end" }}>
                    <Text style={{ margin: -10, fontSize: 12, color: Styles.colors.error }}>{SignUpErrors ? SignUpErrors.race : null}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Pressable
                activeOpacity={0.8}
                onPress={() => { setSize(1) }}
              >
                <View style={{ width: size_pet + 60, height: size_pet + 60 }} >
                  <View style={{ width: size_pet + 60, height: size_pet + 20, alignItems: "center", justifyContent: "flex-end" }} >
                    <Image
                      style={{ width: size_pet, height: size_pet, margin: 30, marginBottom: 0 }}
                      source={Constant.GLOBAL.PET_TYPE[type].img_size_pet}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.textSizePet, { color: size == 1 ? Styles.colors.cian : Styles.colors.gris }]}>Pequeño</Text>
                  <Text style={[styles.textSizePetContent, { color: size == 1 ? Styles.colors.cian : Styles.colors.gris }]}>Hasta 30 cm</Text>
                  <Text style={[styles.textSizePetContent, { color: size == 1 ? Styles.colors.cian : Styles.colors.gris }]}>Peso: 0-15K</Text>
                </View>
              </Pressable>
              <Pressable
                activeOpacity={0.8}
                onPress={() => { setSize(2) }}
              >
                <View style={{ width: size_pet + 60, height: size_pet + 60 }} >
                  <View style={{ width: size_pet + 60, height: size_pet + 20, alignItems: "center", justifyContent: "flex-end" }} >
                    <Image
                      style={{ width: size_pet + 20, height: size_pet + 20, margin: 20, marginBottom: 0 }}
                      source={Constant.GLOBAL.PET_TYPE[type].img_size_pet}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.textSizePet, { color: size == 2 ? Styles.colors.cian : Styles.colors.gris }]}>Mediano</Text>
                  <Text style={[styles.textSizePetContent, { color: size == 2 ? Styles.colors.cian : Styles.colors.gris }]}>30 - 40 cm</Text>
                  <Text style={[styles.textSizePetContent, { color: size == 2 ? Styles.colors.cian : Styles.colors.gris }]}>Peso: 15-25K</Text>
                </View>
              </Pressable>
              <Pressable
                activeOpacity={0.8}
                onPress={() => { setSize(3) }}
              >
                <View style={{ width: size_pet + 60, height: size_pet + 60 }} >
                  <View style={{ width: size_pet + 60, height: size_pet + 20, alignItems: "center", justifyContent: "flex-end" }} >
                    <Image
                      style={{ width: size_pet + 30, height: size_pet + 30, margin: 15, marginBottom: 0 }}
                      source={Constant.GLOBAL.PET_TYPE[type].img_size_pet}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.textSizePet, { color: size == 3 ? Styles.colors.cian : Styles.colors.gris }]}>Grande</Text>
                  <Text style={[styles.textSizePetContent, { color: size == 3 ? Styles.colors.cian : Styles.colors.gris }]}>40 - 60 cm</Text>
                  <Text style={[styles.textSizePetContent, { color: size == 3 ? Styles.colors.cian : Styles.colors.gris }]}>Peso: 25-45K</Text>
                </View>
              </Pressable>

            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Button
                buttonStyle={[Styles.button.primary, { width: Constant.DEVICE.WIDTH - 20, margin: 5 }]}
                title="guardar"
                onPress={() => handleSignUp()}
              // loading={loading}
              />
            </View>


          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView >
  );
};

const styles = StyleSheet.create({
  subTitle: {
    color: Styles.colors.gris,
    fontFamily: Styles.fontAldrichRegular,
    textAlign: "left",
    fontSize: 11,
    marginTop: 5,
    marginBottom: 10,
    paddingLeft: 5
  },
  titleTypePet: {
    color: Styles.colors.gris,
    fontFamily: Styles.fontAldrichRegular,
    textAlign: "center",
    fontSize: 10,
    marginTop: 5,
    marginBottom: 15
  },
  titleTypeSex: {
    color: Styles.colors.gris,
    fontFamily: Styles.fontAldrichRegular,
    textAlign: "left",
    fontSize: 11,
    marginTop: 5,
    marginBottom: 15
  },
  textSizePet: {
    color: Styles.colors.gris,
    fontFamily: Styles.fontAldrichRegular,
    textAlign: "center",
    fontSize: 12,
  },
  textSizePetContent: {
    color: Styles.colors.gris,
    fontFamily: Styles.fontAldrichRegular,
    textAlign: "center",
    fontSize: 9,
  }
});