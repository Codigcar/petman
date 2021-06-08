import React, { memo } from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { Avatar, Divider, Icon, Rating, Overlay } from 'react-native-elements';
import { Styles } from '../../assets/css/Styles';

const HeaderBackLeft = ({ navigation, children, onPress }) => (
    <View>
        <Avatar
            size="medium"
            rounded
            icon={{
                name: Platform.OS == "android" ? "arrow-left" : "keyboard-arrow-left",
                type: Platform.OS == "android" ? "material-community" : "material",
                color: Styles.colors.black
            }}
            onPress={() => typeof onPress === "undefined" ? navigation.goBack() : onPress() }
            activeOpacity={.7}
        />
        {children}
    </View>
);

const styles = StyleSheet.create({
    iconBack: {
        backgroundColor: Styles.colors.primary,
        borderRadius: 25 / 2,
        marginLeft: 10,
        padding: 5
    },
});

export default memo(HeaderBackLeft);
