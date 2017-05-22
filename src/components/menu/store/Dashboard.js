//menu
const SideMenu = require('react-native-side-menu');
const Menu = require('../../common/Menu');
import MenuButton from '../../common/MenuButton';
//!menu!!
import Header from '../../common/Header';
import React, { Component } from 'react';


import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  NetInfo,
  AlertIOS
} from 'react-native';
import { Actions } from 'react-native-router-flux';

class Dashboard extends Component {
  state = {
    isOpen: false,
    selectedItem: 'Dashboard',
    isConnected: null
  };

  componentWillMount() {
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'change',
      this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ isConnected }); }
    );
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected: isConnected,
    });

    if(!isConnected)
    {
      AlertIOS.alert(
				'Network',
				'Your device is offline! Please connect to the Internet');
    }
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'change',
      this._handleConnectivityChange
    );
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

  render() {
    //menu
    const menu = <Menu onItemSelected={this.onMenuItemSelected} currentItem={this.state.selectedItem} responseData={this.props.responseData} />;
    //!!menu!!
    return (
      // Side menu start
      <SideMenu
        menu={menu}
        isOpen={this.state.isOpen}
        onChange={(isOpen) => this.updateMenuState(isOpen)}>

        <View style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}>
          {/*Content start */}

          <Header headerText={'Prima pagină'} />

          <View style={styles.containerRov}>
            <Text style={styles.asideText}> Cumpără roviniete online!  </Text>
            <Text style={styles.smallText}> Plătești cu cardul și primești instant prin SMS și e-mail </Text>


            <TouchableOpacity
              onPress={() => {

                if (!this.state.isConnected) {
                  AlertIOS.alert(
                    'Network',
                    'Your device is offline! Please connect to the Internet');
                }
                else {
                  //..
                  Actions.shop({ responseData: this.props.responseData, location: 'rovignette' });

                }

              }}
              style={styles.buttonStyle}>

              <Text style={styles.welcomeText}> Rovinietă</Text>

            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => { 
                
                  if (!this.state.isConnected) {
                  AlertIOS.alert(
                    'Network',
                    'Your device is offline! Please connect to the Internet');
                }
                else {
                  //..
                  Actions.bridge_shop({ responseData: this.props.responseData, location: 'pod_fetesti' });
                }
                
                 }}
              style={styles.buttonFetestiStyle}>

              <Text style={styles.welcomeText}> Taxă pod Fetești</Text>

            </TouchableOpacity>

            <Text style={styles.smallText}> Serviciu oferit de UNTRR - distribuitor autorizat CNAIR pentru emitere de roviniete și peaj electronic</Text>
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL('https://www.e-rovinieta.ro/ro/contact')}
            >www.e-rovinieta.ro</Text>

          </View>
          <View style={{ flex: 0.2, paddingBottom: 20, marginLeft: -15 }}>
            <Image source={require('../../../../assets/untr.jpg')} style={styles.imgStyle} />
          </View>

          {/*!!!Content end!!! */}
        </View>
        <MenuButton onPress={() => this.toggle()} />
      </SideMenu>
      // !!!Side menu end!!!
    );
  }
}
const window = Dimensions.get('window');

const styles = {
  containerRov: {
    paddingTop: window.height * 0.06,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    flex: 1,
  },
  containerBridge: {
    justifyContent: 'center',
    flex: 0.5,
  },
  asideText: {
    fontSize: 28,
    textAlign: 'center',
    color: '#000000',
    fontWeight: '600',

  },
  smallText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#000000',
    fontWeight: '600',
    paddingTop: 5,
    paddingBottom: 10

  }
  ,
  linkText: {
    fontSize: 20,
    paddingTop: window.height * 0.03,
    textAlign: 'center',
    fontWeight: '600',

    color: '#337ab7',

  },
  welcomeText: {
    fontSize: 33,

    alignSelf: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    paddingTop: 5,
    paddingBottom: 10

  },
  instructions: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 28,
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  buttonStyle: {
    alignSelf: 'stretch',
    backgroundColor: '#ed2124',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5

  },
  buttonFetestiStyle: {
    alignSelf: 'stretch',
    backgroundColor: '#ed2124',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10

  },
  imgStyle: {
    flex: 1,
    width: null,
    resizeMode: 'contain',
    height: null,
  }
};

export default Dashboard;