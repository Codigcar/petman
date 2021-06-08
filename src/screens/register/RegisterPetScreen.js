import React, { useContext, useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, Pressable, View, Image, ScrollView, ImageBackground, Alert, Modal } from 'react-native';
import { Background, Button, Input, DropDownPicker, InputMask } from '../../components';
import { Icon, Overlay } from 'react-native-elements';
import Constant from '../../utils/constants';
import { Styles } from '../../assets/css/Styles';
import { AuthContext } from '../../components/authContext';
import { validateAll } from 'indicative/validator';
import { fetchPOST, convertDateDDMMYYYY } from '../../utils/functions';
import DateTimePickerModal from "react-native-modal-datetime-picker";

let size_face = 40;
let size_pet = 30;

const RegisterPetScreen = ({ navigation, route }) => {
  // console.log('RegisterPetScreen: ' + JSON.stringify(route))
  const [races, setRaces] = useState([]);

  const [type, setType] = useState('1');
  const [sex, setSex] = useState(1);
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [birthday, setBirthday] = useState(new Date());
  const [race, setRace] = useState(0);
  const [size, setSize] = useState(2);

  const [modalVisible, setModalVisible] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [SignUpErrors, setSignUpErrors] = useState({});

  const { signUpPet, signIn } = useContext(AuthContext);

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
            setType('1');
            setSex(1);
            setName('');
            setLastname('');
            setBirthday(new Date());
            // setRace(0);
            setSize(2);
            setOverlay(true);
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
    route.params.userRoot.isFinishedRegistryPet = true;
    setOverlay(false);
    setModalVisible(true);
    setTimeout(() => {
      fetchPOST(Constant.URI.LOGIN, {
        "i_usu_usuario": route.params.userRoot.dni,
        "i_usu_contrasena": route.params.userRoot.password
      }, function (response) {
        setModalVisible(false);
        if (response.CodigoMensaje == 100) {
          signIn({ data: response.Data[0] });
        } else {
          Alert.alert('', response.RespuestaMensaje);
        }
      })
    }, 1000);
  };

  const toggleOverlay = () => {
    setOverlay(!overlay);
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
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
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
      <Overlay isVisible={overlay} onBackdropPress={toggleOverlay}>
        <View style={{ justifyContent: "center" }}>
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
          <View style={{ width: Constant.DEVICE.WIDTH, flexDirection: "row", justifyContent: "center", margin: 10 }}>
            <Text style={[Styles.textOpaque, { fontSize: 20, color: Styles.colors.gris, textAlign: "center" }]}>¿Desea agregar una </Text>
            <Text style={[Styles.textOpaque, { fontSize: 20, color: Styles.colors.secondary, textAlign: "center" }]}>nueva mascota</Text>
            <Text style={[Styles.textOpaque, { fontSize: 20, color: Styles.colors.gris, textAlign: "center" }]}>?</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
            <Button
              buttonStyle={[Styles.button.secondary, { width: (Constant.DEVICE.WIDTH / 2) - 20, margin: 5 }]}
              title="no"
              onPress={() => showModal()}
            />
            <Button
              buttonStyle={[Styles.button.primary, { width: (Constant.DEVICE.WIDTH / 2) - 20, margin: 5 }]}
              title="si"
              onPress={() => {
                setOverlay(false);
                signUpPet(route.params.userRoot);
              }}
            />
          </View>
        </View>
      </Overlay>
      <ScrollView>
        <ImageBackground
          source={Constant.GLOBAL.IMAGES.BACKGROUND_SHORT}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
          imageStyle={{ width: Constant.DEVICE.WIDTH, height: 120 }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center", width: Constant.DEVICE.WIDTH }}>
            <Image
              style={{ width: 110, height: 110, alignItems: "center", margin: 10, marginTop: 35, marginBottom: 5 }}
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
                          iconContainer: { top: 5, right: 30 }
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
        </ImageBackground>
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

export default RegisterPetScreen;