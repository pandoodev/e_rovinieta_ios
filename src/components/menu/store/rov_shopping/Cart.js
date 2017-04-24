import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, AsyncStorage, Linking, Alert, ScrollView, Dimensions } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from '../../../common';
import axios from 'axios';
import querystring from 'query-string';
import { Actions } from 'react-native-router-flux';
import { WebView } from 'react-native';


inCartRovignetteKey = null;

class Cart extends Component {

	state = { selected: '', cart: false, history: false, itemsInCart: '' , loadingForRedirect:false};


	//Display pop-up message to the user
	message(title, content) {
		Alert.alert(
			title,
			content,
			[
				{ text: 'OK', onPress: () => { } },
			],
			{ cancelable: false }
		)
	}

	// START Storage Methods
	//Remove an element from storage
	_removeStorage = async (STORAGE_KEY_ARG) => {
		try {
			await AsyncStorage.removeItem(STORAGE_KEY_ARG);
			//console.log('Selection removed from disk.');
		} catch (error) {
			//console.log('AsyncStorage error: ' + error.message);
		}
	};
	//Add new element to storage
	_addToStorage = async (STORAGE_KEY_ARG, objData) => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY_ARG, objData);
			console.log('Saved selection to disk: ' + objData);
		} catch (error) {
			//console.log('AsyncStorage error: ' + error.message);
		}
	};
	// END Storage Methods




	componentWillMount() {
		this.addCartItemsToState();
	}

	//initiate state items with constructor
	constructor(props) {
		super(props);
		this.state = {
			itemsInCart: null,
			loading: true,
			loadingForRedirect:false
		};

		inCartRovignetteKey = this.props.responseData.user.token;
	}

	//Getting data from AsyncStorage into state variable
	addCartItemsToState() {
		var self = this;
		try {
			var itemsInCart = AsyncStorage.getItem(inCartRovignetteKey);
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


	//Checking if data is ready
	waitForData() {
		//In case data is not ready showing th loading spinner
		if (this.state.loading) {
			return <Spinner size='small' />;
		}

		//In case data is ready 
		return (
			this.showItemsToUser()
		);

	}


	deleteElementFromCart(elementPosition) {
		var currentItemsInCart = this.state.itemsInCart;
		currentItemsInCart.splice(elementPosition, 1);
		this.setState({ itemsInCart: currentItemsInCart });
		this._removeStorage(inCartRovignetteKey);
		this._addToStorage(inCartRovignetteKey, JSON.stringify(currentItemsInCart));
		this.props.deleteFromCart();
		

	}
	delelteButton() {
		this.deleteItems();
		
	}

	removeFromCartAfterBuy()
	{
		this.setState({ itemsInCart: '' });
		var currentItemsInCart='';
		this._removeStorage(inCartRovignetteKey);
		this._addToStorage(inCartRovignetteKey, JSON.stringify(currentItemsInCart));
		this.props.deleteFromCart();
		
	}

	//Removes stored cart items from AsyncStorage
	deleteItems() {
		this._removeStorage(inCartRovignetteKey);
		this.setState({ itemsInCart: "" });
		this.setState({ loading: false });
	}


	//Called when buy items from cart button is pressed
	buyItemsButton() {
		this.setState({loadingForRedirect:true});
		this.setState({itemsInCart:''});
		this.removeFromCartAfterBuy();
		this.prepareData(this.state.itemsInCart);
		//console.log("Items in cart state variable");

		//console.log(this.state.itemsInCart);

	}


	prepareData(obj) {
		var preparedRovignettes = [];
		var userInformation = [];
		var self = this;


		console.log("Unprepared rovignetes")
		console.log(obj);
		console.log("Unprepared rovignetes")


		for (var i = 0; i < this.state.itemsInCart.length; i++) {

			preparedRovignettes[i]=
				{
					'categoryID': obj[i]['categoryID'],
					'priceID': obj[i]['priceID'],
					'startDate': obj[i]['startDate'],
					'vehicleNo': obj[i]['vehicleNo'],
					'chasisNo': obj[i]['chasisNo'],
					'vehicleCountry': obj[i]['vehicleCountry']
				};
		}
		if (userInformation === undefined || userInformation.length == 0) {
			userInformation[0] = 'emission';
			userInformation[1] = obj[0]['token'];
			userInformation[2] = obj[0]['device'];
			userInformation[3] = obj[0]['profileID'];
		}
		
		this.generateInvoice(preparedRovignettes, userInformation);

	}

	stringifyPreparedRovignettes(tag,token,device,profileID,preparedRovignettes)
	{

		result = "";

		result += "tag=" + tag + 
		"&token="+token + 
		"&device="+device + 
		"&profileID="+profileID;
	
		for(index in preparedRovignettes)
		{
			var currentRovignette = preparedRovignettes[index];
			for(rovignetteElement in currentRovignette)
			{
				result += "&cart%5B" + index + "%5D%5B"+rovignetteElement+"%5D=" + currentRovignette[rovignetteElement];
			}
		}

		//make a random parameter to avoid caching the accessed link
		result += "&a=" + Math.random();

		return result;
	}

	generateInvoice(preparedRovignettes, userInformation) {
		url = 'https://www.e-rovinieta.ro/ro/apps/payment';

			//this.deleteItems();

		//STUBBED PARAMETERS TO TEST THE API CALL
		//parameters = "tag=emission&token=xGeYMO3sGXXOyJAgVwbwB7dLaif7pOIY&device=android&profileID=39955&cart%5B1%5D%5BcategoryID%5D=1&cart%5B1%5D%5BpriceID%5D=1&cart%5B1%5D%5BstartDate%5D=03-04-2017&cart%5B1%5D%5BvehicleNo%5D=GJ31ATM&cart%5B1%5D%5BchasisNo%5D=gwwfwqdfqw&cart%5B1%5D%5BvehicleCountry%5D=1";
		var self=this;
		stringifyResult = this.stringifyPreparedRovignettes(
		userInformation[0],
		userInformation[1],
		userInformation[2],
		userInformation[3],
		preparedRovignettes);


		
		console.log("payment URL: ");
		console.log(url + stringifyResult);
		console.log("payment URL: ");

		axios.post(
			url,
			stringifyResult,		
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}
		).then(function (response) {
			
			self.deleteItems();


			linkToAccess = "https://www.e-rovinieta.ro/ro/transaction/" + userInformation[3];
			linkToAccess += "?a=" + Math.random();			
			console.log("profileID url");
			console.log(linkToAccess);
			console.log("profileID url");

			
			Actions.payment({
				linkToAccess:linkToAccess, 
				responseData: self.props.responseData
			});	
			

		}).catch(function (error) {
			console.log(error);
		});
	}

	showItemsToUser() {
		var self = this;
		//Displaying empty cart if no items in storage
		if (this.state.itemsInCart.length == 0)
			return (
				<View style={styles.emptyCartContainerStyle}>
					<View style={styles.emptyCartTextStyle} >
						<Text > Coșul este gol.</Text>

					</View>
				</View>
			);
		//Displaying items in cart stored in AsyncStorage
		return (

			
			<View style={styles.pageContainerStyle}>
				<ScrollView >

					<View style={styles.containerStyle}>
						<Text style={styles.nrCrtHeaderStyle}>Nr.</Text>
						<Text style={styles.autonrHeaderStyle}>Nr. auto</Text>
						<Text style={styles.textHeaderStyle}>  Incepe la</Text>
						<Text style={styles.textHeaderStyle}></Text>

					</View>

					{this.state.itemsInCart.map(function (o, i) {
						return (

							<View key={i} style={styles.elementStyle}>
								<Text style={styles.nrCrtStyle} key={0}> {i + 1}.</Text>
								<Text style={styles.autonrStyle} key={1}>{o.vehicleNo}</Text>
								<Text style={styles.textStyle} key={2}>{o.startDate}</Text>
								<TouchableOpacity style={styles.iconContainerStyle} onPress={() => { self.deleteElementFromCart(i) }} key={3}>
									<Image
										style={styles.deleteItemButtonStyle}
										source={require('../../../../../assets/delete.png')}
									/>
								</TouchableOpacity>
							</View>

						);
					})}
					<View style={styles.buttonContainerStyle}>
						<View style={styles.buttonStyle}>

							<Button onPress={this.props.changeParentState}>
								Adaugă rovinieta
	  </Button>

						</View>
						<View style={styles.buttonStyle}>
							{this.renderButton()}
						
						</View>
					</View>
				</ScrollView >

		
			</View>
		
		

		);

	}

		renderButton() {
		if (this.state.loadingForRedirect) {
			return <Spinner size='small' />;
		}

		return (
				<Button onPress={this.buyItemsButton.bind(this)}>
								Plasează Comanda
		  </Button>
		);

	}
	render() {
		return (

			this.waitForData()

		);
	}


};
const window = Dimensions.get('window');
// AsyncStorage key to in cart rovignetts

const styles = {

	pageContainerStyle: {
		height: window.height * 0.7,
	},
	elementStyle: {
	   flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 10,
    marginRight: 10,
	},
	containerStyle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginLeft: 10,
		marginRight: 10,
	}
	, buttonContainerStyle: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',

	}
	,
	buttonStyle: {
		flex: 1,

	},
	deleteItemButton: {
		flex: 1,
		width: null,
		height: null,
		resizeMode: 'contain',
		justifyContent: 'center',
	},
	imgStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		resizeMode: 'contain',
	},
	deleteItemButtonContainerStyle: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
		width: 5,
	},
	textStyle: {
		  flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    color: 'black',
    height: 30,
    paddingTop: 6,
    borderColor: '#bbb',
    borderWidth: 1,

	},
	nrCrtStyle: {
	flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    color: 'black',
    height: 30,
    paddingTop: 6,
    borderColor: '#bbb',
    borderWidth: 1,

	},
	emptyCartContainerStyle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginLeft: 10,
		marginRight: 10,
	}
	,
	emptyCartTextStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 80,
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
	  autonrHeaderStyle: {
    flex: 5,
    paddingTop: 3,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    color: 'white',
    height: 30,
    fontSize: 16,
  },
  textHeaderStyle: {
    flex: 5,
    paddingTop: 3,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    color: 'white',
    height: 30,
    fontSize: 16,


  },
  nrCrtHeaderStyle: {
    flex: 1.6,
    paddingTop: 3,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    color: 'white',
    height: 30,
    fontSize: 16,

  },autonrStyle: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    color: 'black',
    height: 30,
    paddingTop: 6,

    borderColor: '#bbb',
    borderWidth: 1,
  },	iconContainerStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 5,
		height: 30,
		borderColor: '#bbb',
		borderWidth: 1,


	},
};

export default Cart;