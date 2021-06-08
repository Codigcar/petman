import React, { Component } from 'react';
import {
  StyleSheet,
  UIManager,
  findNodeHandle,
  Alert,
  LogBox,
} from 'react-native';
import SynapPayView from './SynapPayView';

export default class PaymentView extends Component {
  onSuccess: (response: string) => void;
  onFailed: (response: string) => void;
  environmentName: string;
  themeName: string;

  identifier: string;
  signature: string;
  onBehalf: string;

  constructor(props) {
    super(props);
    this.environmentName = props.environmentName;
    this.themeName = props.themeName;
    this.onSuccess = (response: string) => { };
    this.onFailed = (response: string) => { };
  }

  startPayment(options: {
    identifier: string,
    signature: string,
    transaction: string,
    onSuccess: (response: string) => void,
    onFailed: (response: string) => void,
  }) {
    this.identifier = options.identifier;
    this.signature = options.signature;
    this.transaction = options.transaction;

    this.onSuccess = options.onSuccess;
    this.onFailed = options.onFailed;
    UIManager.getViewManagerConfig;
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.synapPayView),
      UIManager.SynapPayView.Commands.create,
      [this.themeName || '', this.environmentName || ''],
    );
  }

  _onCreateEnd() {
    console.log('create end, call configure');
    this.configure();
  }

  _onConfigureEnd() {
    console.log('configure end...');
  }

  _onPaySuccess(event: Event) {
    const response = event.nativeEvent.response;
    console.log('response: ' + response);
    this.onSuccess(response);
  }

  _onPayFailed(event: Event) {
    const response = event.nativeEvent.response;
    console.log('response: ' + response);
    this.onFailed(response);
  }

  _onError(event: Event) {
    console.log('error: ' + event.nativeEvent.message);
    throw new Error(event.nativeEvent.message);
  }

  _onLog(event: Event) {
    console.log('onLog: ' + event.nativeEvent.message);
  }

  configure() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.synapPayView),
      UIManager.SynapPayView.Commands.configure,
      [
        this.identifier || '',
        this.onBehalf || '',
        this.signature || '',
        this.transaction || '',
      ],
    );
  }

  pay() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.refs.synapPayView),
      UIManager.SynapPayView.Commands.pay,
      [],
    );
  }

  render() {
    return (
      <SynapPayView
        ref="synapPayView"
        style={[{ flex: 1, width: '100%', height: '100%' }]}
        onCreateCompleted={() => {
          this._onCreateEnd();
        }}
        onConfigureCompleted={() => {
          this._onConfigureEnd();
        }}
        onPaySuccess={(event: Event) => {
          this._onPaySuccess(event);
        }}
        onPayFail={(event: Event) => {
          this._onPayFailed(event);
        }}
        onLog={(event: Event) => {
          this._onLog(event);
        }}
        onError={this._onError}></SynapPayView>
    );
  }
}
