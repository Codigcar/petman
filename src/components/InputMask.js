import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import BaseTextComponent from './masks/lib/base-text-component';
import Constant from '../utils/constants';
import { Styles } from '../assets/css/Styles';

export default class InputMask extends BaseTextComponent {
    getElement() {
        return this._inputElement
    }

    _onChangeText(text) {
        if (!this._checkText(text)) {
            return
        }

        const { maskedText, rawText } = this.updateValue(text)

        if (this.props.onChangeText) {
            this._trySetNativeProps(maskedText)
            this.props.onChangeText(maskedText, rawText)
        }
    }

    _trySetNativeProps(maskedText) {
        try {
            const element = this.getElement()
            element.setNativeProps && element.setNativeProps({ text: maskedText })
        } catch (error) {
            console.warn(error);
        }
    }

    _checkText(text) {
        if (this.props.checkText) {
            return this.props.checkText(this.props.value, text)
        }

        return true
    }

    _getKeyboardType() {
        return this.props.keyboardType || this._maskHandler.getKeyboardType()
    }

    render() {
        return (
            <Input
                ref={ref => {
                    if (ref) {
                        this._inputElement = ref

                        if (typeof this.props.refInput === 'function') {
                            this.props.refInput(ref)
                        }
                    }
                }}
                keyboardType={this._getKeyboardType()}
                {...this.props}
                onChangeText={text => this._onChangeText(text)}
                onFocus={this.props.onFocus}
                value={
                    this.getDisplayValueFor(
                        this.props.value
                    )
                }
                labelStyle={[Styles.textOpaque, { fontSize: 12, color: Styles.colors.lightGrey }]}
                inputContainerStyle={styles.inputContainer}
                errorStyle={styles.inputErrorContainer}
                inputStyle={[Styles.textOpaque, { height: 45, right: 4, alignItems: "center", marginBottom: -5 }]}
                rightIconContainerStyle={{ height: 30, alignItems: "center" }}
            />
        )
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: -10,
        borderColor: Styles.colors.opaque,
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
