import React, { Component } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View, ImageBackground, Image, Dimensions } from 'react-native';
import Constant from '../utils/constants';

let width = 250;
let height = 150;
let width_background = Dimensions.get('window').width;
let height_background = Dimensions.get('window').height;

export default class InitialScreen extends Component {

    constructor() {
        super();
        this._init();
    }

    _init = async () => {
        // const userToken = await AsyncStorage.getItem('userToken');
        // this.props.navigation.navigate(userToken ? 'TabScreen' : 'Login');
    }

    render() {
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
}