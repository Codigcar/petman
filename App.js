import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useMemo, useReducer } from 'react';
import { SafeAreaView } from 'react-native';
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

  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    const bootstrapAsync = async () => {
      setTimeout(() => {
        dispatch({ type: 'RESTORE_TOKEN' });
      }, 3000);
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
        } else {
          dispatch({ type: 'TO_SIGNIN_PAGE' });
        }
      },
      signOut: async (data) => {
        dispatch({ type: 'SIGN_OUT' });
        // await AsyncStorage.clear(); //TODO: Verificar ya que borra la canasta que esta en memoria
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
        arr.push(createLoginStack());
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
      backgroundColor: Styles.colors.background
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Styles.colors.background }}>
      <AuthContext.Provider value={authContextValue}>
        <NavigationContainer theme={MyTheme}>
          <Stack.Navigator>{chooseScreen(state)}</Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaView>
  );
};
