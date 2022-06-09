import React, { Component, useContext, useEffect, useReducer } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View, ImageBackground, Image, Dimensions } from 'react-native';
import { AuthContext } from '../components/authContext';
import Constant from '../utils/constants';
import { fetchPOST } from '../utils/functions';



// export default class InitialScreen extends Component {

//     constructor() {
//         super();
//         this._init();
//     }

//     _init = async () => {
//         // const userToken = await AsyncStorage.getItem('userToken');
//         // this.props.navigation.navigate(userToken ? 'TabScreen' : 'Login');
//         const { signIn} = useContext(AuthContext);
      
//         fetchPOST(Constant.URI.LOGIN, {
//             "i_usu_usuario": '12312312',
//             "i_usu_contrasena": 'Carlos123',
//             "i_usu_devicetoken": 'hola'
//           }, function (response) {
//             if (response.CodigoMensaje == 100) {
//               const _storeData = async () => {
//                 try {
//                   signIn({ data: response.Data[0] });
//                 } catch (error) {
//                   console.error('Error: ' + error);
//                 }
//               };
//               _storeData();
//             } else {
//               Alert.alert('', response.RespuestaMensaje);
//             }
//           })
//     }

//     render() {
//         return (
//             <ImageBackground
//                 source={Constant.GLOBAL.IMAGES.BACKGROUND_INIT}
//                 resizeMode="cover"
//                 style={{ width:width_background , height: height_background }}
//                 imageStyle={{ flex: 1 }}
//             >
//                 <View style={{ width: width_background, height: height_background, alignItems: "center", justifyContent: "center" }}>
//                     <Image
//                         style={{ width: width, height: height }}
//                         source={Constant.GLOBAL.IMAGES.LOGO_INIT}
//                     />
//                 </View>
//             </ImageBackground>
//         )
//     }
// }


 const InitialScreen = () => {
    let width = 250;
    let height = 150;
    let width_background = Dimensions.get('window').width;
    let height_background = Dimensions.get('window').height;

    // const { signIn} = useContext(AuthContext);

   /*  useEffect(() => {
        setTimeout(() => {
            fetchPOST(Constant.URI.LOGIN, {
                "i_usu_usuario": '12312312',
                "i_usu_contrasena": 'Carlos123',
                "i_usu_devicetoken": 'hola'
                }, function (response) {
                if (response.CodigoMensaje == 100) {
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
        }, 2000);
    },[] ) */

    return (
        <ImageBackground
            source={Constant.GLOBAL.IMAGES.BACKGROUND_INIT}
            resizeMode="cover"
            style={{ width:width_background , height: height_background }}
            imageStyle={{ flex: 1 }}
        >
            <View style={{ width: width_background, height: height_background, alignItems: "center", justifyContent: "center" }}>
                <Image
                    style={{ width: width, height: height }}
                    source={Constant.GLOBAL.IMAGES.LOGO_INIT}
                />
            </View>
        </ImageBackground>
    )
}

export default InitialScreen;