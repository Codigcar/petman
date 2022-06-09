import React, { memo, useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input as TextInput } from 'react-native-elements';
import Constant from '../utils/constants';
import { Styles } from '../assets/css/Styles';

const Input = ({ label, ...props }) => {
    const [isFocused, setFocused] = useState(false);

    const onFocusChange = () => {
        setFocused(!isFocused);
    }

    return (
        <View>
            <Label label={label} />
            <TextInput
                inputContainerStyle={[styles.inputContainer, { borderColor: (isFocused) ? Styles.colors.secondary : Styles.colors.opaque }]}
                errorStyle={styles.inputErrorContainer}
                inputStyle={[Styles.textOpaque, { height: 45, right: 4 }]}
                returnKeyType={"done"}
                onFocus={onFocusChange}
                onBlur={onFocusChange}
                {...props}
            />
        </View>
    );
};

const Label = ({ label }) => {
    if (!label) {
        return (
            <></>
        );
    }
    return (
        <Text style={[Styles.textOpaque, { fontSize: 12, color: Styles.colors.lightGrey, marginLeft: 10 }]}>{label}</Text>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: -10,
        ...Platform.select({
            default: {
                shadowColor: Styles.colors.opaque,
                shadowOffset: { height: 0, width: 0 },
                shadowOpacity: 1,
                shadowRadius: 1,
            },
            ios: {
                shadowColor: Styles.colors.opaque,
                shadowOffset: { height: 0, width: 0 },
                shadowOpacity: 0,
                shadowRadius: 1,
            },
        }),
    },
    inputErrorContainer: {
        color: Styles.colors.error,
        textAlign: "right",
        paddingRight: 2
    }
});

export default memo(Input);