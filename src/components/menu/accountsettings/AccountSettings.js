import React, { Component } from 'react';
import { View, Button, Image, Text, TouchableOpacity, Dimensions,Linking} from 'react-native';
//menu
const SideMenu = require('react-native-side-menu');
const Menu = require('../../common/Menu');
import MenuButton from '../../common/MenuButton';
import Header from '../../common/Header';

import { Spinner } from '../../common';

//!menu!!

class AccountSettings extends Component {

		state = { loading: true  };
	constructor(props) {
		super(props)
		this.state = {  loading: true }
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


	state = { selected: '', cart: false, history: false,isOpen: false,
    selectedItem: 'Dashboard',};

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
		  <Header headerText={'Setări cont'} />


			<View style={styles.containerStyle}>
				<View style={styles.buttonStyle} >
						<Text style={styles.textStyle} >Email: {this.props.responseData.user.email}</Text>
						<Text style={styles.textStyle} >Telefon:  - </Text>
				</View>
						 <View style={styles.insideStyle} >
              <Text
                style={{ color: '#337ab7', paddingBottom: 10 }}
                onPress={() => Linking.openURL('https://www.e-rovinieta.ro/ro/masini')}
              >Modifică datele contului</Text>
            </View>
			</View>
	



			      {/*!!!Content end!!! */}
        </View>
         <MenuButton onPress={() => this.toggle()} />
      </SideMenu>
      // !!!Side menu end!!!
		);
	}
};
const window = Dimensions.get('window');

const styles = {
	containerStyle: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		marginLeft: 10,
		marginRight: 10,
		paddingTop:window.height*0.35,
		paddingBottom:window.height*0.35,
	}
	,
  insideStyle: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    position: 'relative',
    alignSelf: 'center',
  },
	buttonStyle: {
		flex: 1,
		flexDirection: 'column',
		height:window.height*0.1,
		justifyContent: 'space-around',
		alignItems: 'center',
		elevation: 1,
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	imgStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		resizeMode: 'contain',
	},
	textStyle: {
		marginBottom: 15,


	}
};

export default AccountSettings;
