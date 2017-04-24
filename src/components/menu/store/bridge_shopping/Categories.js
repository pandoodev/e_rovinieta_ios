import React, { Component } from 'react';
import { View, Text, Picker } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from '../../../common';
import DatePicker from 'react-native-datepicker'
var dateFormat = require('dateformat');
import Header from '../../../common/Header';
import axios from 'axios';
import querystring from 'query-string';



class Categories extends Component {
	state = { userType: '', profileID: '', vehicleNo: '', chasisNo: '', startDate: '1', loading: true, country: 1, nrDays: 95, error: '', countries: [] };
	constructor(props) {
		super(props)
		this.state = { date: this.getCurerntDate() }
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
					console.log("unsuccess");
				}
			});

	}
	getCurerntDate() {
		let currentDate = new Date();
		let date = dateFormat(currentDate, "dd-mm-yyyy").toString();

		return date;
	}

	componentWillMount() {
		this.setState({ startDate: this.getCurerntDate(), country: "1", nrDays: "95", error: "" });
		this.getCountries();
		this.getProfileID();

	}
	renderCountries() {
		if (this.state.loading || this.state.loading == undefined) {
			return <Spinner size='small' />;
		}
		return (
			<Picker
				style={styles.pickerStyle}
				selectedValue={this.state.country}
				onValueChange={(loc) => this.setState({ country: loc })}>
				{this.state.countries.map(function (o, i) {

					return <Picker.Item value={i} label={o} key={i} />
				})}</Picker>
		);
	}
	renderButton() {
		if (this.state.loading) {
			return <Spinner size='small' />;
		}

		return (
			//	<Button onPress = {this.onButtonPress.bind(this)}> 
			<Button >
				Cumpara
		</Button>
		);

	}

	getProfileID() {
		var self = this;
		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'profile',
				device: 'android',
				token: this.props.infoClientLogin.infoClientLogin.token
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				if (response.data.success) {

					self.setState({ profileID: response.data.profiles[0]['id'] });

					// console.log(response.data.profiles[0]['id']);
					// console.log(response.data.profiles[0]['type']);
					// console.log(response.data.profiles[0]['firstName']);
					// console.log(response.data.profiles[0]['lastName']);
					// console.log(response.data.profiles[0]['personalID']);
				}
				if (response.data.success === 0) {
					response.data.error_msg;
					//	console.log("unsuccess");
				}
			});
	}


getOrderHistory()
{
		console.log("--getProfileID--");
		var self = this;
		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'orders',
				device: 'android',
				token: this.props.infoClientLogin.infoClientLogin.token
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				if (response.data.success) {

					
				}
				if (response.data.success === 0) {
					response.data.error_msg;
					//	console.log("unsuccess");
				}
			});
}
	buyRovignette() {

		if (this.validateInputs() == 1) {
			console.log("test");
			this.initiateRovignette(this.props.infoClientLogin.infoClientLogin.token,
				this.state.profileID,
				this.props.categoryID,
				this.state.nrDays,
				this.state.startDate,
				this.state.vehicleNo,
				this.state.chasisNo,
				this.state.country);
		}
		else {
			this.setState({ error: this.validateInputs() });
		}
	}


	validateInputs() {

		if (this.state.vehicleNo === undefined) {
			return "Numarul de inmatriculare nu este valid !";
		}
		if (this.state.chasisNo === undefined) {
			return "Numarul sasiului nu este valid !";
		}
		return 1;

	}

	initiateRovignette(argToken, argProfileID, argCategoryID, argPriceID,
		argStartDate, argVehicleNo, argChasisNo, argVehicleCountry) {
		var self = this;

		// console.log(argToken+"argToken");
		// console.log(argProfileID+"argProfileID");
		// console.log(argCategoryID+"argCategoryID");
		// console.log(argPriceID+"argPriceID");
		// console.log(argStartDate+"argStartDate");
		// console.log(argVehicleNo+"argVehicleNo");
		// console.log(argChasisNo+"argChasisNo");
		// console.log(argVehicleCountry+"argVehicleCountry");


		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'initiate',
				device: 'android',
				token: argToken,
				profileID: argProfileID,
				categoryID: argCategoryID,
				priceID: argPriceID,
				startDate: argStartDate,
				vehicleNo: argVehicleNo,
				chasisNo: argChasisNo,
				vehicleCountry: argVehicleCountry
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {



				//console.log(response.data);

				if (response.data.success) {
					console.log(response.data);

				}
				if (response.data.success === 0) {
					self.setState({ error: response.data.error_msg });
					if (response.data.error_msg === undefined) {
						self.setState({ error: response.data.errors[0] });
					}
					//	console.log(response.data);
				}
			});
	}

	render() {
		if (this.state.loading == false) {
			//console.log(this.state.countries);
		}
		console.log("rendering");
		return (

			<View>

				<Header headerText="Introduceti Datele" />
				<Card >
					<CardSection >
						<Input
							placeholder="SM79BET"
							label="Numar Inm:"
							value={this.state.vehicleNo}
							onChangeText={vehicleNo => this.setState({ vehicleNo })}
						/>
					</CardSection>
					<CardSection >
						<Input
							placeholder="WAULC68E92A140677"
							label="Serie Sasiu:"
							value={this.state.chasisNo}
							onChangeText={chasisNo => this.setState({ chasisNo })}
						/>
					</CardSection>
					<CardSection >
						<Text style={styles.textStyle}> De la: </Text>
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
					</CardSection>

				
					
					<CardSection >
						<Text style={styles.errorTextStyle}>
							{this.state.error}
						</Text>
					</CardSection>
					<CardSection >
						{this.renderButton()}
					</CardSection>
				</Card>
			</View>

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
		width: 200,

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
		marginBottom: 15,
		marginLeft: 15,


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
};

export default Categories;