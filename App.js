import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect, useMemo, useReducer } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { AuthContext } from './src/components/authContext';
import {
  InitialScreen,
  LoginScreen,
  ForgotPasswordScreen,
  RegisterScreen,
  RegisterPetScreen
} from './src/screens';
import TabScreen from './src/screens/main/TabScreen';
import { initialState, reducer, stateConditionString } from './src/utils/helpers';
import { Styles } from './src/assets/css/Styles';
import { fcmService } from './src/components/notifications/FCMService'
import { localNotificationService } from './src/components/notifications/LocalNotificationService'
import { fetchPOST } from './src/utils/functions';
import Constant from './src/utils/functions';
import { getDataUser } from './src/screens/login/LoginScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';



let DEVICE_TOKEN = "";
const Stack = createStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    delay: 1000
  },
};

const createLoginStack = () => {
  return (
    <Stack.Screen name="Login" component={LoginScreen}
      initialParams={{ deviceToken: DEVICE_TOKEN }} options={{
        // initialParams={{ deviceToken: 'holaaa' }} options={{
        headerShown: false,
        // transitionSpec: {
        //   open: config,
        //   close: config,
        // }
      }} />
  )
};

export default App = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const { signIn} = useContext(AuthContext);

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    const bootstrapAsync = async () => {
      // const usuario = await AsyncStorage.getItem('usuario');
      // const password = await AsyncStorage.getItem('password'); 
      // const { signIn } = useContext(AuthContext);

      /* if(!usuario && !password){
      }  */
      setTimeout(() => {
        dispatch({ type: 'RESTORE_TOKEN' });
      }, 2000);


      /*   fetchPOST(constants.URI.LOGIN, {
        "i_usu_usuario": '12312312',
        "i_usu_contrasena": 'Carlos123',
        "i_usu_devicetoken": 'hola'
        }, function (response) {
          if (response.CodigoMensaje == 100) {
            const _storeData = async () => {
              try {
                console.log('data traida: ', response.Data[0]);
                dispatch({ type: 'SIGN_IN', userRoot: response.Data[0] });
              } catch (error) {
                console.error('Error: ' + error);
              }
            };
            _storeData();
          } else {
            Alert.alert('', response.RespuestaMensaje);
          }
        }) */

      /*  setTimeout(() => {
       fetchPOST('http://desarrollo2.laprotectora.com.pe:8090/veterinaria/Operations/UsuarioLoguear', {
         "i_usu_usuario": '12312312',
         "i_usu_contrasena": 'Carlos123',
         "i_usu_devicetoken": 'hola'
         }, function (response) {
         if (response.CodigoMensaje == 100) {
             const _storeData = async () => {
             try {
               dispatch({ type: 'SIGN_IN', userRoot: response.Data[0] });
               // signIn({ data: response.Data[0] });
             } catch (error) {
                 console.error('Error: ' + error);
             }
             };
             _storeData();
         } else {
             Alert.alert('', response.RespuestaMensaje);
         }
         })

   }, 2000); */

      // setTimeout(() => {
      // dispatch({ type: 'RESTORE_TOKEN' })
      // const data = getDataUser();
      // dispatch({ type: 'SIGN_IN', userRoot: {"CCL_ApeMaterno": "Test", "CCL_ApePaterno": "Prueba", "CCL_Celular": "946199591", "CCL_Documento": "12312312", "CCL_Email": "carlos.castilla009@gmail.com", "CCL_IdCliente": 1019, "CCL_Nombre": "Carlos", "CodigoMensaje": 100, "PF_IdPerfil": 2, "PF_NombrePerfil": "USUARIO", "RespuestaMensaje": "Encontro usuario", "SE_NombreCortoSexo": null, "SE_NombreSexo": null, "TAR_IdTarjeta": null, "TAR_NroTarjeta": null, "TAR_Token": null, "UB_Direccion": "Avenida El Sol", "USU_Contrasena": "Carlos123", "USU_Estado": 1, "USU_IdUsuario": 1018, "USU_Usuario": "12312312", "VTA_IdVeterinaria": null, "VTA_Nombre": null} });

      // }, 2000);
    };

    bootstrapAsync();

    function onRegister(token) {
      console.log("[App] onRegister: ", token)
      DEVICE_TOKEN = token;
    }

    function onNotification(notify) {
      console.log("[App] onNotification: ", notify)
      const options = {
        soundName: 'default',
        playSound: true,
        foreground: true
        // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
        // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
      }
      localNotificationService.showNotification(
        1,
        notify.title,
        notify.body,
        notify,
        options
      )
    }

    function onOpenNotification(notify) {
      console.log("[App] onOpenNotification: ", notify)
      // alert("Open Notification: " + notify.body)
    }

    return () => {
      console.log("[App] unRegister")
      fcmService.unRegister()
      localNotificationService.unregister()
    }

  }, []);

  const authContextValue = useMemo(
    () => ({
      signIn: async (data) => {
        if (data !== undefined) {
          // localNotificationService.cancelAllLocalNotifications();
          dispatch({ type: 'SIGN_IN', userRoot: data });
          // console.log('data: ', data);
          // console.log('data: ', data.data.CCL_Documento);
          // console.log('data: ', data.data);
          await AsyncStorage.setItem('dniStorage', data.data.USU_Usuario);
          await AsyncStorage.setItem('passwordStorage', data.data.USU_Contrasena);
        } else {
          dispatch({ type: 'TO_SIGNIN_PAGE' });
        }
      },
      signOut: async (data) => {
        dispatch({ type: 'SIGN_OUT' });
        await AsyncStorage.clear(); //TODO: Verificar ya que borra la canasta que esta en memoria

        // await AsyncStorage.setItem('usuario','');
        // await AsyncStorage.setItem('password','');

        // await AsyncStorage.removeItem('dniStorage');
        // await AsyncStorage.removeItem('passwordStorage');
      },
      forgotPassword: async () => { dispatch({ type: 'TO_FORGOT_PASS_PAGE' }) },
      signUp: async (data) => { dispatch({ type: 'TO_SIGNUP_PAGE' }) },
      signUpPet: async (data) => {
        // console.log('signUpPet: ' + JSON.stringify(data));
        // if (data !== undefined && data.isFinishedRegistryPet) {
        //   dispatch({ type: 'SIGN_IN', userRoot: data });
        // } else {
        dispatch({ type: 'TO_SIGNUP_PET_PAGE', userRoot: data });
        // }
      }
    }),
    [],
  );

  const chooseScreen = (state) => {
    let navigateTo = stateConditionString(state);
    let arr = [];

    // console.log(JSON.stringify(navigateTo) + ' - ' + JSON.stringify(state));
    switch (navigateTo) {
      case 'LOAD_LOADING':
        arr.push(<Stack.Screen name="InitialScreen" component={InitialScreen} options={{
          headerShown: false,
          transitionSpec: {
            open: config,
            close: config,
          }
        }} />);
        break;
      case 'LOAD_FORGOT_PASSWORD':
        arr.push(
          <Stack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />,
        );
        break;
      case 'LOAD_SIGNUP':
        arr.push(
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            initialParams={{ deviceToken: DEVICE_TOKEN }}
            options={{ headerShown: false }}
          />,
        );
        break;
      case 'LOAD_SIGNUP_PET':
        arr.push(
          <Stack.Screen
            name="RegisterPetScreen"
            component={RegisterPetScreen}
            initialParams={{ userRoot: state.userRoot }}
            options={{ headerShown: false }}
          />,
        );
        break;
      case 'LOAD_SIGNIN':
        // arr.push(createLoginStack());
        arr.push(
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            initialParams={{ deviceToken: DEVICE_TOKEN }}
            options={{ headerShown: false }}
          />
        );
        break;
      case 'LOAD_APP':
        arr.push(
          <Stack.Screen
            name="TabScreen"
            component={TabScreen}
            initialParams={{ userRoot: state.userRoot }}
          />);
        break;
      default:
        arr.push(createLoginStack());
        break;
    }
    return arr[0];
  };

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Styles.colors.primary,
      backgroundColor: Styles.colors.background,

    },
  };

  // const insets = useSafeAreaInsets();
  return (
    // <SafeAreaView  style={{ flex: 1, backgroundColor: Styles.colors.primary }}  >
    <>
      <StatusBar barStyle="dark-content" />
      <AuthContext.Provider value={authContextValue}>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator>{chooseScreen(state)}</Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </>
    // </SafeAreaView>
  );
};
