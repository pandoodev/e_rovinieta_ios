import React, { Component } from 'react';
import { View, Button, Image, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import CarCategories from './CarCategories';
import Header from '../../../common/Header';
import Cart from './Cart';
import History from './History';
//menu
const SideMenu = require('react-native-side-menu');
const Menu = require('../../../common/Menu');
import MenuButton from '../../../common/MenuButton';
//menu

import { Actions } from 'react-native-router-flux';
import { WebView } from 'react-native';

class PaymentConfirmation extends Component {

  state = { noRedirects: 0, uri: "" };

  //initiate state items with constructor
  constructor(props) {
    super(props);
    this.state = {
      uri:this.props.linkToAccess
    };
  }

  // Start side-menu functions
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen, });
  }

  onMenuItemSelected = (item) => {
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
  }
  // !!!End side-menu functions!!!

  onLoadEndFunction() {

    this.state.noRedirects++;

    if (this.state.noRedirects > 1) {
      console.log(this.props.responseData);
      Actions.shop({
        componentToDisplay: 'history',
        responseData: this.props.responseData
      });
    }
  }

  _onNavigationStateChange(webViewState) {

    if(webViewState.url.indexOf("/apps/success") >= 0 ||
    webViewState.url.indexOf("/apps/pending") >= 0 ||
    webViewState.url.indexOf("/apps/failed") >= 0)
    {
      console.log("Redirecting...");  
      Actions.shop({
        componentToDisplay: 'history',
        responseData: this.props.responseData
      });
    }
  }


  render() {

    return (
      <WebView
        source={{ uri: this.state.uri }}
        onLoadEnd={this.onLoadEndFunction.bind(this)}
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
      />
    );
  }
};


export default PaymentConfirmation;
