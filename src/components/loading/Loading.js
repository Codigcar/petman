import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { Styles } from '../../assets/css/Styles';
import Constant from '../../utils/constants';

const transparent = 'transparent';
const ANIMATION = ['none', 'slide', 'fade'];

export default class Loading extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            text: this.props.text
        };
    }

    static propTypes = {
        cancelable: PropTypes.bool,
        animation: PropTypes.oneOf(ANIMATION),
        overlayColor: PropTypes.string,
        text: PropTypes.string,
        textStyle: PropTypes.object,
        visible: PropTypes.bool,
        indicatorStyle: PropTypes.object,
        customIndicator: PropTypes.element,
        children: PropTypes.element,
        loadingKey: PropTypes.string
    };

    static defaultProps = {
        visible: false,
        cancelable: false,
        text: '',
        animation: 'none',
        overlayColor: 'rgba(0, 0, 0, 0.25)'
    };

    close() {
        this.setState({ visible: false });
    }

    static getDerivedStateFromProps(props, state) {
        const newState = {};
        if (state.visible !== props.visible) newState.visible = props.visible;
        if (state.text !== props.text)
            newState.text = props.text;
        return newState;
    }

    _handleOnRequestClose() {
        if (this.props.cancelable) {
            this.close();
        }
    }

    _renderDefaultContent() {
        return (
            <View style={styles.background}>
                {this.props.customIndicator ? (
                    this.props.customIndicator
                ) : (
                        <Image
                            style={{ width: 180, height: 150, resizeMode: "contain" }}
                            source={Constant.GLOBAL.IMAGES.LOADING}
                        />
                    )}
                <View style={[styles.textContainer, { ...this.props.indicatorStyle }]}>
                    <Text style={[styles.textContent, Styles.textBoldOpaque, this.props.textStyle]}>
                        {this.state.text || 'Cargando...'}
                    </Text>
                </View>
            </View>
        );
    }

    _renderLoading() {
        const loading = (
            <View
                style={[styles.container, { backgroundColor: this.props.overlayColor }]}
                key={
                    this.props.loadingKey
                        ? this.props.loadingKey
                        : `loading_${Date.now()}`
                }
            >
                {this.props.children
                    ? this.props.children
                    : this._renderDefaultContent()}
            </View>
        );

        return (
            <Modal
                animationType={this.props.animation}
                onRequestClose={() => this._handleOnRequestClose()}
                supportedOrientations={['landscape', 'portrait']}
                transparent
                visible={this.state.visible}
                // statusBarTranslucent={true}
            >
                {loading}
            </Modal>
        );
    }

    render() {
        return this._renderLoading();
    }
}

const styles = StyleSheet.create({
    activityIndicator: {
        flex: 1
    },
    background: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },
    container: {
        backgroundColor: transparent,
        bottom: 0,
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },
    textContainer: {
        alignItems: 'center',
        bottom: 0,
        flex: 1,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },
    textContent: {
        fontSize: 20,
        height: 50,
        top: 80
    }
});