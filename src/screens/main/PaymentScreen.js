import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from 'react-native';
import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { Icon } from 'react-native-elements';
import { Divider, Carousel, Button, HeaderBackLeft, HeaderRight, RadioForm, RadioButtonInput, RadioButtonLabel } from '../../components';
import { Styles } from '../../assets/css/Styles';
import Constant from '../../utils/constants';
import { fetchPOST } from '../../utils/functions';
import PaymentView from '../../components/payment/PaymentView';

export default class PaymentScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isPaymentStarted: false,
            signature: '',
            isPaying: false
        };
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            title: 'Pago',
            headerStyle: Styles.headerBarStyle,
            headerTitleStyle: Styles.headerTitleStyle,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerLeft: () => (
                <HeaderBackLeft navigation={this.props.navigation} />
            ),
            headerRight: () => (
                <HeaderRight navigation={this.props.navigation} userRoot={this.props.route.params.userRoot} />
            ),
        });
        this.startPayment();
    }

    async startPayment() {
        this.setState({
            isPaymentStarted: true,
        });
        const transactionObject = this.getTransaction();
        const transaction = JSON.stringify(transactionObject);

        let identifier = '';
        let signatureKey = '';

        await fetchPOST(Constant.URI.PAYMENT_KEY, {}, function (response) {
            identifier = response.Data[0].ApiKeyTarjeta;
            signatureKey = response.Data[0].SignatureKeyTarjeta;
        });
        console.log(identifier + ' ---||--- ' + signatureKey)
        const signature = await this.generateSignature(
            transactionObject,
            identifier,
            signatureKey,
        ); //For sample purposes only

        const bodyProducts = this.props.route.params.body;
        console.log(JSON.stringify(bodyProducts))
        await this.refs.paymentView.startPayment({
            identifier,
            signature,
            transaction,
            onSuccess: (response: string) => {
                const jsonResponse = JSON.parse(response);
                console.log('PAGO BIEN: ' + JSON.stringify(jsonResponse));
                // Alert.alert('onSuccess: ' + jsonResponse.message.text);

                bodyProducts.I_V_NroOperacion = jsonResponse.result.processorResult.transactionIdentifier;
                fetchPOST(Constant.URI.SALE_REGISTRY, bodyProducts, function (resp) {
                    const _clearAsyncStore = async () => {
                        await AsyncStorage.clear();
                    }
                    _clearAsyncStore();
                    Alert.alert('', resp.RespuestaMensaje);

                    _goBack();
                });

                const _goBack = () => {
                    this.props.navigation.navigate('MyOrdersHomeScreen', { userRoot: this.props.route.params.userRoot });
                }
            },
            onFailed: (response: string) => {
                const jsonResponse = JSON.parse(response);
                console.log('PAGO ERRO: ' + JSON.stringify(jsonResponse));
                Alert.alert('onFailed: ' + jsonResponse.message.text);
            },
        });
    }

    async generateSignature(
        transaction: any,
        identifier: string,
        signatureKey: string,
    ) {
        const orderNumber = transaction.order.number;
        const currencyCode = transaction.order.currency.code;
        const amount = transaction.order.amount;

        const rawSignature =
            identifier + orderNumber + currencyCode + amount + signatureKey;
        console.log('rawSignature: ' + rawSignature);

        const response = await fetch(
            'https://api.hashify.net/hash/sha512/hex?value=' + encodeURIComponent(rawSignature),
        );

        const json = await response.json();
        const hash = json.Digest;
        console.log('hash:' + hash);
        return hash;
    }

    pay() {
        this.setState({
            isPaying: true,
        });
        this.refs.paymentView.pay();
        this.setState({
            isPaying: false,
        });
    }

    getTransaction() {
        const number = `${Date.now()}`;
        const customer = {
            name: this.props.route.params.userRoot.CCL_Nombre,
            lastName: this.props.route.params.userRoot.CCL_ApePaterno,
            address: {
                country: 'PER',
                levels: ['150000', '150100', '150101'],
                line1: 'Ca Carlos Ferreyros 180',
                zip: '15036',
            },
            email: this.props.route.params.userRoot.CCL_Email,
            phone: this.props.route.params.userRoot.CCL_Celular,
            document: {
                type: 'DNI',
                number: this.props.route.params.userRoot.CCL_Documento,
            },
        };
        const shipping = customer;
        const billing = customer;
        return {
            order: {
                number,
                amount: this.props.route.params.totalAmount,
                country: {
                    code: 'PER',
                },
                currency: {
                    code: 'PEN',
                },
                customer,
                shipping,
                billing,
                products: [
                    {
                        name: 'petman',
                    },
                ],
            },
            features: {
                cardStorage: {
                    userIdentifier: 'javier.perez@synapsolutions.com'
                }
            },
            settings: {
                brands: ['VISA', 'MSCD'],
                language: 'es_PE',
                businessService: 'MOB',
            }
        };
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View>
                    <View style={{ alignItems: "center", marginTop: 10 }}>
                        <Image
                            style={{ width: 250, height: 150 }}
                            source={Constant.GLOBAL.IMAGES.LOGO_INIT}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.paymentContainer} >
                        <PaymentView
                            ref="paymentView"
                            themeName="dark"
                            environmentName="SANDBOX"></PaymentView>
                    </View>
                    <View>
                        <TouchableOpacity
                            activeOpacity={.8}
                            style={[
                                Styles.button.primary,
                                { height: 50, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }
                            ]}
                            onPress={() => { this.pay() }}
                            disabled={this.state.isPaying}
                        >
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }}>
                                <Text style={[Styles.textOpaque, { fontSize: 14, color: Styles.colors.black, textAlign: "center" }]}>Pagar S/{this.props.route.params.totalAmount}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Styles.colors.background
    },
    paymentContainer: {
        height: 230,
        width: 320,
        marginTop: 30
    }
});