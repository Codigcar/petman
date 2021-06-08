import { createStackNavigator } from '@react-navigation/stack';
import { validateAll } from 'indicative/validator';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    ImageBackground,
    TouchableOpacity, TouchableHighlight,
    FlatList
} from 'react-native';
import { Icon, Input, Rating, AirbnbRating, Divider, SearchBar, Avatar } from 'react-native-elements';
import 'react-native-gesture-handler';
import { Styles } from '../../../assets/css/Styles';
import Constant from '../../../utils/constants';
import { Carousel, Button, HeaderBackLeft, HeaderRight } from '../../../components';
import { fetchPOST } from '../../../utils/functions';

const Stack = createStackNavigator();

export default function ChatHomeScreen({ navigation, route }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ userRoot: route.params.userRoot }}
                options={{
                    title: 'Mis pedidos',
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
                }} />
        </Stack.Navigator>
    );
}

function HomeScreen({ navigation, route }) {

    return (
        <></>
    );
}

const styles = StyleSheet.create({
});