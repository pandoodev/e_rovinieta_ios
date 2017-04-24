import React, {Component}from 'react';
import { View, Button, Image, Text, TouchableOpacity } from 'react-native';


class Cart extends  Component {

state = { selected:'', cart:false, history:false };

	render(){
		return (
			<View style={styles.containerStyle}>
			<View style={styles.buttonStyle} >
		<Text style={styles.textStyle} >Cosul de cumparaturi este gol</Text>
			</View>
			</View>
			);
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
	buttonStyle:{
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
	imgStyle:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: 50, 
		height: 50,
		resizeMode: 'contain',
	},
	textStyle:{
		paddingTop: -5,
		marginBottom: 15,


	}
};

export default Cart;
