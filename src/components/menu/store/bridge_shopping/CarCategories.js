import React, {Component} from 'react';
import { View, Button, Image, Text, TouchableOpacity } from 'react-native';
import {Actions} from 'react-native-router-flux';


class MyCars extends  Component {
	
	state = { carinfoClientLogin:this.props,category:''};

	
	
	render(){


		return (
		<View style={{marginTop: 80}}>
			
		<View style={styles.containerStyle}>
		<TouchableOpacity 
		onPress={ () => {
			Actions.bridge_ticket_to_cart({infoClientLogin:this.props,category:'A',
			categoryID:"1"})
			}}
		style={styles.buttonStyle}>
		<View>
		<Image
		source={require('../../../../../assets/category_A.png')} style={styles.imgStyle} />
		</View>
		<Text style={styles.textStyle} > Categoria A </Text>
		</TouchableOpacity>
			
		<TouchableOpacity
				onPress={ () => {
			Actions.bridge_ticket_to_cart({infoClientLogin:this.props,category:'B',
			categoryID:"8"})
			}}
		style={styles.buttonStyle}>
		<View>
		<Image
		source={require('../../../../../assets/category_B.png')} style={styles.imgStyle} />
		</View>
		<Text style={styles.textStyle}> Categoria H </Text>
		</TouchableOpacity>
		
		</View>


		<View style={styles.containerStyle}>
		<TouchableOpacity 
				onPress={ () => {
			Actions.bridge_ticket_to_cart({infoClientLogin:this.props,category:'C',
			categoryID:"2"})
			}}
		style={styles.buttonStyle}>
		<View>
		<Image
		source={require('../../../../../assets/category_C.png')} style={styles.imgStyle} />
		</View>
		<Text style={styles.textStyle} > Categoria B </Text>
		</TouchableOpacity>
			
		<TouchableOpacity
				onPress={ () => {
			Actions.bridge_ticket_to_cart({infoClientLogin:this.props,category:'D',
			categoryID:"8"})
			}}
		style={styles.buttonStyle}>
		<View>
		<Image
		source={require('../../../../../assets/category_D.png')} style={styles.imgStyle} />
		</View>
		<Text style={styles.textStyle}> Categoria H </Text>
		</TouchableOpacity>
		
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
		width: 60, 
		height: 60,
		resizeMode: 'contain',
	},
	textStyle:{
		paddingTop: -5,
		marginBottom: 15,
		
		
	}
};

export default MyCars;