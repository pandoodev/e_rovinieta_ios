import React, { Component } from 'react';
import { View, Text, Picker, Alert, AsyncStorage, ScrollView } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from '../../../common';
import DatePicker from 'react-native-datepicker'
var dateFormat = require('dateformat');
import Header from '../../../common/Header';
import axios from 'axios';
import querystring from 'query-string';
import { Actions } from 'react-native-router-flux';


//menu
const SideMenu = require('react-native-side-menu');
const Menu = require('../../../common/Menu');
import MenuButton from '../../../common/MenuButton';
//menu



inCartRovignetteKey = null;

class AddtoCart extends Component {
	state = {
		userType: '',
		profileID: '',
		vehicleNo: '',
		chasisNo: '',
		startDate: '1',
		loading: true,
		loadingPrices: true,
		country: 1,
		nrDays: 1,
		pricesAndValabilities: [],
		error: '',
		countries: [], isOpen: false,
		buttonLoading: false,
		selectedItem: 'Dashboard',
	};
	constructor(props) {
		super(props)
		this.state = { date: this.getCurerntDate(), buttonLoading: true, vehicleNo:this.getVehicleNo(),chasisNo:this.getChasisNo()  }
		inCartRovignetteKey = this.props.responseData.user.token;

	}
getVehicleNo()
{
	console.log("getVehicleNo")
	
	if(this.props.plateNo!=undefined&&this.props.plateNo!='')
	{
		console.log("getVehicleNo"+this.props.plateNo)
		return this.props.plateNo
	}
	return '';
}
getChasisNo()
{
	if(this.props.chasisNo!=undefined&&this.props.chasisNo!='')
	{
		return this.props.chasisNo
	}
	return '';
}

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


	getValabilities() {
		var self = this;
		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'valabilities',
				device: 'android'
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				if (response.data.success) {

					var valabilities = [];
					response.data.valabilities.forEach(function (valability) {
						valabilities.push(valability);
					}, this);

					axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
						querystring.stringify({
							tag: 'prices',
							device: 'android'
						}), {
							headers: {
								"Content-Type": "application/x-www-form-urlencoded"
							}
						}).then(function (response) {
							if (response.data.success) {

								var valabilitiesWithPrices = [];

								for (x in valabilities) {
									valab = valabilities[x];
									for (idx in response.data.prices) {
										var element = response.data.prices[idx];

										if (element.valability_id == valab.id &&
											element.vehicle_id == self.props.categoryID) {
											valabilityElement = new Object();
											valabilityElement.priceID = element.id;
											valabilityElement.description = valab.description + " - " + element.value + " " + element.currency;
											valabilitiesWithPrices.push(valabilityElement);
											break;
										}
									}
								}

								self.state.pricesAndValabilities = valabilitiesWithPrices;
								self.setState({ priceID: valabilitiesWithPrices[0].priceID });
								self.setState({ error: '', loadingPrices: false, buttonLoading: false });

							}
							if (response.data.success === 0) {
								console.log("unsuccess");
							}
						});

				}
				if (response.data.success === 0) {
					console.log("unsuccess");
				}
			});

	}

	renderValabilitiesAndPrices() {

		if (this.state.loadingPrices || this.state.loadingPrices == undefined) {
			return <Spinner size='small' />;
		}

		else {


			return (
				<View style={styles.pickerContainerStyle}>

					<Picker
						style={styles.pickerStyle}
						selectedValue={this.state.priceID}
						onValueChange={(days) => this.setState({ priceID: days })}>

						{this.state.pricesAndValabilities.map(function (o, i) {

							return <Picker.Item value={o.priceID} label={o.description} key={o.priceID} />
						})}

					</Picker>
				</View>
			);

		}

	}

	getPrices() {
		var self = this;
		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'prices',
				device: 'android'
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				if (response.data.success) {
					console.log("Prices:");
					console.log(response.data);
				}
				if (response.data.success === 0) {
					console.log("unsuccess");
				}
			});

	}



	getCountries() {
		var self = this;
		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'countries',
				device: 'android'
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				if (response.data.success) {
					var arrCountries = [];
					response.data.countries.forEach(function (countrieInfo) {
						arrCountries.push(countrieInfo['name']);
					}, this);
					self.state.countries = arrCountries;
					self.setState({ error: '', loading: false });
				}
				if (response.data.success === 0) {
					console.log("unsuccess from getCountries");
				}
			});
	}


	getCurerntDate() {
		let currentDate = new Date();
		let date = dateFormat(currentDate, "dd-mm-yyyy").toString();

		return date;
	}

	componentWillMount() {
		this.setState({ startDate: this.getCurerntDate(), country: "1", nrDays: "1", error: "" });
		this.getCountries();
		this.getProfileID();
		this.getValabilities();


		//this.getCategories();

		//this.getPrices();
		///	console.log("add to cart");

		//console.log(this.props.responseData);
	}
	renderCountries() {
		if (this.state.loading || this.state.loading == undefined) {
			return <Spinner size='small' />;
		}
		return (
			<View style={styles.pickerContainerStyle}>

				<Picker
					style={styles.pickerStyle}
					selectedValue={this.state.country}
					onValueChange={(loc) => this.setState({ country: loc })}>
					{this.state.countries.map(function (o, i) {

						return <Picker.Item value={i} label={o} key={i} />
					})}</Picker>
			</View>
		);
	}
	renderButton() {
		if (this.state.buttonLoading) {
			return <Spinner size='small' />;
		}

		return (
			//	<Button onPress = {this.onButtonPress.bind(this)}> 
			<Button onPress={this.addToCartButton.bind(this)}>
				Adaugă în coș
		</Button>
		);

	}

	redirectToCart() {
		Actions.shop({ responseData: this.props.responseData, componentToDisplay: 'cart' })
	}
	getProfileID() {
		console.log("this.props.responseData")
		var self = this;
		console.log(this.props.responseData)
		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'profile',
				device: 'android',
				token: this.props.responseData.user.token
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				if (response.data.success) {

					if (response.data.profiles.length > 0) {
						var activeProfile = response.data.profiles[0];

						for (profileidx in response.data.profiles) {
							var currentProfile = response.data.profiles[profileidx];
							if (currentProfile.default === "1") {
								activeProfile = currentProfile;
							}
						}

						self.setState({ profileID: activeProfile['id'] });
					}
				}
				if (response.data.success === 0) {
					console.log("unsuccess while getting profile id");
					console.log(response.data);
				}
			});
	}

	addToCartButton() {
		this.setState({ buttonLoading: true });

		if (this.checkIfNotEmpty() == 1) {
			this.validateRovignette(
				this.props.responseData.user.token,
				this.state.profileID,
				this.props.categoryID,
				this.state.nrDays,
				this.state.startDate,
				this.state.vehicleNo,
				this.state.chasisNo,
				this.state.country);
		}
		else {
			this.setState({ buttonLoading: false });
			Alert.alert(
				'Eroare',
				this.checkIfNotEmpty(),
				[
					{ text: 'OK', onPress: () => { } },
				],
				{ cancelable: false }
			)
		}
	}


	checkIfNotEmpty() {
		//Vehicle number validation
		if (this.state.vehicleNo === undefined
			|| this.state.vehicleNo == ""
		) {
			return "Vă rugăm să introduceți numărul de înmatriculare al vehiculului !";
		}

		// //Chasis number validation
		// if (this.state.chasisNo === undefined
		// 	|| this.state.chasisNo == ""

		// ) {
		// 	return "Vă rugăm să introduceți numărul șasiului vehiculului !";
		// }


		return 1;

	}

	validateRovignette(argToken, argProfileID, argCategoryID, argPriceID,
		argStartDate, argVehicleNo, argChasisNo, argVehicleCountry) {

		let rovignetteInfo = [
			{
				'token': this.props.responseData.user.token,
				'tag': 'initiate',
				'device': 'android',
				'token': argToken,
				'profileID': argProfileID,
				'categoryID': argCategoryID,
				'priceID': argPriceID,
				'startDate': argStartDate,
				'vehicleNo': argVehicleNo,
				'chasisNo': argChasisNo,
				'vehicleCountry': argVehicleCountry
			}
		];
		var self = this;
		var aux = rovignetteInfo;

		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify(
				rovignetteInfo[0]),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}

		).then(function (response) {

			self.setState({ buttonLoading: false });

			if (response.data.success) {
				self.appendIfNotEmpty(inCartRovignetteKey, rovignetteInfo);
				return 1;
			}

			if (response.data.success === 0) {
				if (response.data.errors != undefined && response.data.errors != '') {
					if (response.data.errors[0] != undefined && response.data.errors[0] != '') {
						self.message('Eroare', response.data.errors[0]);
						return 0;
					}
				}

				if (response.data.error_msg != undefined && response.data.error_msg != '') {
					self.message('Eroare', response.data.error_msg);
				}
				else {
					console.log(response.data);
					self.message('Eroare', 'Vă rugăm să verificați corectitudinea datelor introduse.');
				}
				return 0;

			}

		});
	}

	// START Storage Methods
	_removeStorage = async (STORAGE_KEY_ARG) => {
		try {
			await AsyncStorage.removeItem(STORAGE_KEY_ARG);
			console.log('Selection removed from disk.');
		} catch (error) {
			//console.log('AsyncStorage error: ' + error.message);
		}
	};
	_addToStorage = async (STORAGE_KEY_ARG, objData) => {
		var self = this;
		try {
			var x = await AsyncStorage.setItem(STORAGE_KEY_ARG, objData).then((token) => {
				//	console.log('The object has been added to storage:');
				//console.log(objData);
				self.redirectToCart();
			});




		} catch (error) {
			//console.log('AsyncStorage error: ' + error.message);
		}
	};
	// END Storage Methods
	appendIfNotEmpty(STORAGE_KEY_ARG, newItem) {
		var self = this;
		try {
			var itemsInCart = AsyncStorage.getItem(inCartRovignetteKey);
			if (itemsInCart !== null) {
				itemsInCart.then(function (value) {
					if (value != null || value != undefined) {
						var itemsInCartJson = JSON.parse(value);

						if (itemsInCartJson.length >= 9) {
							console.log(itemsInCartJson.length + "can't add more than 8 items to cart");
							self.message("Atenție", "Nu pot fi adăugate mai mult de 8 roviniete în coș!")
							self.setState({ loading: false });
						}
						else {
							itemsInCartJson.push(newItem[0]);
							self._addToStorage(STORAGE_KEY_ARG, JSON.stringify(itemsInCartJson))
							self.setState({ loading: false });

						}


					}
					else {
						self._addToStorage(STORAGE_KEY_ARG, JSON.stringify(newItem))
						self.setState({ loading: false });

					}

				});
			}
		} catch (error) {

			console.log(error);

		}

	}

	getCategories() {

		var self = this;
		console.log("--getCategories--");
		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'categories',
				device: 'android',				
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				if (response.data.success) {	

					console.log("categories");			
					console.log(response.data);
					console.log("categories");

				}
				if (response.data.success === 0) {
					console.log("Failed ");
				}
			});
	}



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
					<Header headerText={this.props.category} />
					<ScrollView >
					
						<Card >
							<Text style={styles.pageTitleStyle}> {this.props.categoryDescription}</Text>
							<CardSection >
								<Input
									label="Număr auto"
									value={this.state.vehicleNo}
									onChangeText={vehicleNo => this.setState({ vehicleNo })}
								/>
							</CardSection>
							<CardSection >
								<Input
									label="Serie șasiu"
									value={this.state.chasisNo}
									onChangeText={chasisNo => this.setState({ chasisNo })}
								/>
							</CardSection>
							<CardSection >
								<Text style={styles.textStyle}> De la </Text>
								<View style={styles.pickerContainerStyle}>

									<DatePicker
										style={{ width: 200 }}
										date={this.state.date}
										mode="date"
										format="DD-MM-YYYY"
										minDate={this.getCurerntDate()}
										confirmBtnText="Confirm"
										cancelBtnText="Cancel"
										customStyles={{
											dateIcon: {
												position: 'absolute',
												left: 0,
												top: 4,
												marginLeft: 0
											},
											dateInput: {
												marginLeft: 36
											}
										}}
										onDateChange={(date) => { this.setState({ startDate: date }) }}
									/>
								</View>
							</CardSection>

							<CardSection>
								<Text style={styles.textStyle} > Țara </Text>
								{this.renderCountries()}

							</CardSection>
							<CardSection>
								<Text style={styles.textStyle}> Valabilitate </Text>
								{this.renderValabilitiesAndPrices()}

							</CardSection>

							{this.renderButton()}
						</Card>
					</ScrollView >

					{/*!!!Content end!!! */}
				</View>
				<MenuButton onPress={() => this.toggle()} />

			</SideMenu>
			// !!!Side menu end!!!

		)
	}
};

const styles = {
	containerStyle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 80,
		marginLeft: 10,
		marginRight: 10,
	}
	,
	pickerStyle: {
		color: 'black',
		marginLeft: -7,
	},
	pickerContainerStyle: {
		borderBottomColor: '#808080',
		borderBottomWidth: 1,
		marginLeft: 5,
		flex: 2
	},
	buttonStyle: {
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
	imgStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		resizeMode: 'contain',
	},
	textStyle: {
		flex: 1,
		paddingTop: 10,
		fontSize: 18,
		marginBottom: 8,
		marginLeft: 15,
		color: 'black',
	},
	errorTextStyle: {
		flex: 1,
		fontSize: 20,
		justifyContent: 'center',
		color: 'red',
		alignItems: 'center',
		marginLeft: 30,
		marginRight: 30,
	}
	,
	pageTitleStyle: {
		fontSize: 17,
		textAlign: 'center',
		color: '#000000',
		fontWeight: '600',
		paddingLeft: 10,
		marginBottom: -8,
		paddingRight: 10,
		
	}
};

export default AddtoCart;

