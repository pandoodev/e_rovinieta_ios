import React, { Component } from 'react';
import { View, Button, Image, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Spinner } from '../../../common';

import axios from 'axios';
import querystring from 'query-string';
import Moment from 'moment'

class History extends Component {

	state = { selected: '', history: '', loading: true };

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			history: ''
		};

	}
	componentDidMount() {
		this.getOrderHistory();
	}
	getOrderHistory() {
		console.log("--getOrderHistory--")
		var self = this;



		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'orders',
				device: 'android',
				token: this.props.responseData.user.token
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {

				if (response.data.success) {

					response.data.orders.sort(function (a, b) {
						var keyA = Moment(a.startDate),
							keyB = Moment(b.startDate);
						// Compare the 2 dates
						if (keyA < keyB) return 1;
						if (keyA > keyB) return -1;
						return 0;
					});

					self.setState({ history: response.data.orders });
					self.setState({ loading: false });
				}
				if (response.data.success === 0) {
					console.log("unsuccess while getting orders");
					console.log(response.data);
				}
			});
	}
	setPageHeight = function (options) {
		console.log(window.height)
		return {

			height: 200 + this.state.history.length * 80.5
		}
	}
	renderHistory() {
		if (this.state.loading || this.state.loading == undefined) {
			return (
				<View style={{ marginTop: 50 }} >
					<Spinner size='small' />
				</View>);
		}
		else {
			return (
				this.showOrderHistory()
			);
		}
	}

	displayOrderStatus(order) {

		switch (order.orderStatus) {
			case "1": return ("Neplătită");
			case "2": return ("În procesare");
			case "3": return ("Respinsă");
			case "4": return ("Anulată");
			case "5": return ("Încasată");
			case "6": return ("Aprobată");
			case "7": return ("Fraudă");
			case "8": return ("V.Manuală");
			case "9": return ("Eșuată");
			case "10": return ("Validă");
			case "11": return ("Neinițiată");
			case "12": return ("Validare");
			case "13": return ("Salvată");
			case "14": return ("Emitere");
			case "15": return ("Finalizată");
			case "16": return ("Rambursată");
			case "17": return ("Parţial Emisă");
			case "18": return ("Re - Emitere");
			case "19": return ("I.Emitere");
		}
	}

	showOrderHistory() {

		if (this.state.history.length >= 1) {
			console.log('ok');
			console.table(this.state.history);

			var self = this;

			return (
				<View style={this.setPageHeight()}>
					<ScrollView >

						<View style={styles.containerStyle}>

							<Text style={styles.textHeaderStyle}>Comanda</Text>
							<Text style={styles.textHeaderStyle}>Rovinieta</Text>
						</View>

						{this.state.history.map(function (o, i) {
							return (

								<View key={i + 1} style={styles.entryContainerStyle}>
									<View key={i + 2} style={styles.leftItemContainerStyle}>
										<Text style={styles.textStyle} key={1}>#{o.orderID}</Text>
										<Text style={styles.textStyle} key={2}>{o.price} lei</Text>
										<Text style={styles.textStyle} key={3}>{self.displayOrderStatus(o)}</Text>

									</View>

									<View style={styles.rightItemContainerStyle}>
										<Text style={styles.vehicleNoStyle} key={4}>{o.vehicleNo}</Text>
										<Text style={styles.textStyle} key={5}>{o.endDate}</Text>
										<Text style={styles.textStyle} key={6}>{o.startDate}</Text>

									</View>

								</View>

							);
						})}
					</ScrollView >


				</View>
			);
		}
		else {
			return (
				<View style={styles.containerStyle}>
					<View style={styles.buttonStyle} >
						<Text>Nu aveți comenzi anterioare </Text>
					</View>
				</View>
			);
		}
	}

	render() {
		return (

			<View>
				{this.renderHistory()}
			</View>



		);
	}
};
const window = Dimensions.get('window');

const styles = {
	containerStyle: {
		paddingTop: 3,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 5,
		marginLeft: 10,
		marginRight: 10,
	},
	itemContainerStyle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginLeft: 10,
		marginRight: 10,
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
	textStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 5,
		color: 'black',
		paddingTop: 4,
	},
	vehicleNoStyle: {
		fontWeight: 'bold',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 5,
		color: 'black',
		paddingTop: 4,
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
	entryContainerStyle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		height: 80
	},
	leftItemContainerStyle: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		marginLeft: 10,
		borderColor: '#bbb',
		borderWidth: 1,
		paddingLeft: 5,
		borderRightWidth: 0
	},
	rightItemContainerStyle: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		marginRight: 10,
		borderColor: '#bbb',
		borderWidth: 1,

	},
};

export default History;
