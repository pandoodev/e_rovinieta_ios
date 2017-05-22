import React, { Component } from 'react';
import { View, Button, Image, Text, TouchableOpacity, ScrollView, Dimensions, AsyncStorage , NetInfo, AlertIOS} from 'react-native';
import BridgeCarCategories from './BridgeCarCategories';
import Header from '../../../common/Header';
import BridgeCart from './BridgeCart';
import BridgeHistory from './BridgeHistory';


//menu
const SideMenu = require('react-native-side-menu');
const Menu = require('../../../common/Menu');
import MenuButton from '../../../common/MenuButton';
//menu


inCartRovignetteKeyBridge = null;
class BridgeShopMain extends Component {
	state = { selected: 'categories', componentToDisplay: '', itemsInCart: {} };

	//Getting data from AsyncStorage into state variable
	addCartItemsToState() {
		console.log(inCartRovignetteKeyBridge );

		var self = this;
		try {
			var itemsInCart = AsyncStorage.getItem(inCartRovignetteKeyBridge );
			if (itemsInCart !== null) {
				itemsInCart.then(function (value) {
					if (value != null || value != undefined) {
						var itemsInCartJson = JSON.parse(value);
						self.setState({ itemsInCart: itemsInCartJson });
						self.setState({ loading: false });
					}
					else {
						self.setState({ itemsInCart: '' });
						self.setState({ loading: false });
					}
				});
			}
		} catch (error) {
			console.log(error);

			self.setState({ loading: false });
		}

	}
	itemsInCart() {
		if (this.state.itemsInCart.length > 0) {
			return ('(' + this.state.itemsInCart.length + ')');
		}

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

	itemsInCartMenuFormated() {
		if (this.state.itemsInCart.length > 0) {
			return ('(' + this.state.itemsInCart.length + ')');
		}
		else{
			return '';
		}
	}
	displayModule() {

		switch (this.state.selected) {
			case 'categories':
				return (<BridgeCarCategories responseData={this.props.responseData} />);
			case 'cart':
				return (<BridgeCart responseData={this.props.responseData} 
				changeParentState={this.changeStateFromCart.bind(this)} 
				deleteFromCart={this.deleteFromCart.bind(this)} />);
			case 'history':
				return (<BridgeHistory responseData={this.props.responseData} />);
		}
	}
	componentWillMount() {
		inCartRovignetteKeyBridge  = this.props.responseData.user.token+"bridge";
		if (this.props.componentToDisplay != undefined) {
			this.setState({ selected: this.props.componentToDisplay });
		}
		if (this.state.componentToDisplay != '') {
			this.setState({ selected: this.state.componentToDisplay })
		}
		this.addCartItemsToState();

	}
	changeStateFromCart(event) {
		this.setState({ selected: 'categories' })
	}
	deleteFromCart(event) {
		this.addCartItemsToState();
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
	imageType(category) {
		switch (category) {
			case 'categories':
				if (this.state.selected != category) {
					return (<Image source={require('../../../../../assets/categories_inactive.png')} style={styles.imgStyle} />);
				}
				else {
					return (<Image source={require('../../../../../assets/categories.png')} style={styles.imgStyle} />);
				}
			case 'cart':

				if (this.state.selected != category) {
					return (<Image source={require('../../../../../assets/cart_inactive.png')} style={styles.imgStyle} />);
				}
				else {
					return (<Image source={require('../../../../../assets/cart.png')} style={styles.imgStyle} />);
				}
			case 'history':

				if (this.state.selected != category) {
					return (<Image source={require('../../../../../assets/history_inactive.png')} style={styles.imgStyle} />);
				}
				else {
					return (<Image source={require('../../../../../assets/history.png')} style={styles.imgStyle} />);
				}
		}
	}
showCart(){
	
        if (!this.state.isConnected) {
            AlertIOS.alert(
                'Network',
                'Your device is offline! Please connect to the Internet');
        }
        else {
         this.setState({ selected: 'cart' })
        }

}
showCategories(){
	
        if (!this.state.isConnected) {
            AlertIOS.alert(
                'Network',
                'Your device is offline! Please connect to the Internet');
        }
        else {
         this.setState({ selected: 'categories' })
        }

}
showHistory(){
	
        if (!this.state.isConnected) {
            AlertIOS.alert(
                'Network',
                'Your device is offline! Please connect to the Internet');
        }
        else {
         this.setState({ selected: 'history' })
        }

}

	render() {

		//menu
		const menu = <Menu onItemSelected={this.onMenuItemSelected} currentItem={this.state.selectedItem} responseData={this.props.responseData}   bridgePassesInCart={this.itemsInCartMenuFormated()}/>;
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
					<Header headerText={'Taxa pod Fetesti'} />
					<View>
						<View style={styles.containerStyle}>
							<View style={styles.headerStyle}>


								<TouchableOpacity underlayColor={'rgba(255, 255, 255, 0.2)'}
									onPress={() => { this.showCategories() }}
									style={styles.buttonStyle}>

									<View >
										<Text > {'\n'}</Text>
										{this.imageType('categories')}
									</View>

									<Text style={styles.textStyle}>Cumpără  {'\n'}</Text>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => { this.showCart() }}
									style={styles.buttonStyle}>

									<View >
										<Text > {'\n'}</Text>
										{this.imageType('cart')}
									</View>

									<Text style={styles.textStyle}>Coș {this.itemsInCart()} {'\n'}</Text>
								</TouchableOpacity>


								<TouchableOpacity
									onPress={() => { this.showHistory()  }}

									style={styles.buttonStyle}>
									<View >
										<Text > {'\n'}</Text>
										{this.imageType('history')}

									</View>
									<Text style={styles.textStyle}>Comenzi {'\n'}</Text>

								</TouchableOpacity>

							</View>
						</View>
						<ScrollView >
							<Text > {'\n'}</Text>
							{this.displayModule()}
						</ScrollView >

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
		flexDirection: 'row',
		marginLeft: 5,
		marginRight: 5,
		marginTop: 10,

	}
	,
	headerStyle: {
		height: window.height * 0.13,

		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 3,
		borderColor: '#ddd',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		marginLeft: 5,
		marginRight: 5,

	},
	buttonStyle: {
 backgroundColor: 'rgba(0,0,0,0)',		
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 15,
	},
	imgStyle: {
		
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		resizeMode: 'contain',
	},
	textStyle: {

		marginBottom: 15,
		marginLeft: 7

	}
};


export default BridgeShopMain;
