import React, { Component } from 'react';
import { View, Button, Image, Text, TouchableOpacity } from 'react-native';
import CarCategories from './CarCategories';
import Header from '../../../common/Header';
import Cart from './Cart';
import History from './History';

class BuyBridgeTicket extends Component {

	state = { selected: 'categories', };
	displayModule() {
		switch (this.state.selected) {
			case 'categories':
				return (<CarCategories infoClientLogin={this.props.infoClientLogin} />);
			case 'cart':
				return (<Cart />);
			case 'history':
				return (<History />);
		}
	}

	render() {
		return (
			<View>
				<Header headerText={'Achita Taxa Pod'}/>
				<View style={styles.containerStyle}>
					<View style={styles.headerStyle}>
						<TouchableOpacity
							onPress={() => { this.setState({ selected: 'categories', }) }}
							style={styles.buttonStyle}>
							<View>
															<Text > {'\n'}</Text>

								<Image
									source={require('../../../../../assets/categories.png')} style={styles.imgStyle} />
							</View>
														<Text style={styles.textStyle} > Categorii{'\n'} </Text>

						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => { this.setState({ selected: 'history' }) }}

							style={styles.buttonStyle}>
							<View >
									<Text > {'\n'}</Text>
								<Image
									source={require('../../../../../assets/history.png')} style={styles.imgStyle} />
							</View>
										<Text style={styles.textStyle}> Istoric comenzi  {'\n'}</Text>
						</TouchableOpacity>
					</View>
				</View>
								<Text > {'\n'}</Text>
				{this.displayModule()}
			</View>

		);
	}
};

const styles = {
	containerStyle: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginLeft: 5,
		marginRight: 5,
		marginTop: 10,
	}
	,
	headerStyle: {
		flex: 1,
		height:80,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		borderWidth: 1,
		borderRadius: 2,
		borderColor: '#ddd',
		borderBottomWidth: 0,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 1,
		marginLeft: 5,
		marginRight: 5,
	},
	buttonStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 70,
	},
	imgStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: 40,
		height: 35,
		resizeMode: 'contain',
	},
	textStyle: {
		marginBottom: 15,
	}
};

export default BuyBridgeTicket;
