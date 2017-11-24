import React, { Component } from 'react';
import { View, Text, Navigaor, Image, Alert, AppState, AsyncStorage, TextInput, Linking, AlertIOS, NetInfo} from 'react-native';
import { LoginButton, Card, CardSection, Input, Spinner } from '../common';
import axios from 'axios';
import querystring from 'query-string';
import md5 from "react-native-md5";
import { Actions } from 'react-native-router-flux';
import Header from '../common/Header';

import PushController from "./PushController";

class LoginForm extends Component {
	
	state = { username: '', password: '', error: '', loading: false, loggedIn: false, appState: null, isConnected: null };
	
	// START Storage Methods
	_removeStorage = async (STORAGE_KEY_ARG) => {
		try {
			await AsyncStorage.removeItem(STORAGE_KEY_ARG);
			//console.log('Selection removed from disk.');
		} catch (error) {
			//console.log('AsyncStorage error: ' + error.message);
		}
	};
	_addToStorage = async (STORAGE_KEY_ARG, objData) => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY_ARG, objData);
			//console.log('Saved selection to disk: ' + objData);
		} catch (error) {
			//console.log('AsyncStorage error: ' + error.message);
		}
	};
	// END Storage Methods
	checkIfUserIsLoged() {
		try {
			var loginData = AsyncStorage.getItem(STORAGE_KEY);
			if (loginData !== null) {
				loginData.then(function (value) {
					if (value != null || value != undefined) {
						var loginDataFromStorage = JSON.parse(value);
						Actions.main({ responseData: loginDataFromStorage });
					}
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
	
	componentWillMount() {
		this.checkIfUserIsLoged();
				
	}

	constructor(props) {
		super(props);
		//this.handleAppStateChange = this.handleAppStateChange.bind(this);
		this.state = {
			seconds: 5,
			username: '',
			password: '',
			appState: null
		};
	}
	
	componentDidMount() {

		NetInfo.isConnected.addEventListener(
			'change',
			this._handleConnectivityChange
		);
		NetInfo.isConnected.fetch().done(
			(isConnected) => { this.setState({ isConnected }); }
		);
		
		if (this.state.appState != null) {
		}
		else {
			AppState.addEventListener('change', this.handleAppStateChange);
		}
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

		AppState.removeEventListener('change', this.handleAppStateChange);
		
	}
	
	handleAppStateChange = (nextAppState) => {
		
		this.setState({ appState: nextAppState });
		console.log("currentState");
		console.log(this.state.appState);
		console.log("currentState");
		
	}
	
		
		onButtonPress() {
			
			
			const { username, password } = this.state;
			
			let hashedPass = md5.hex_md5(password);
			var self = this;


			   	if (!this.state.isConnected) {
			AlertIOS.alert(
				'Network',
				'Your device is offline! Please connect to the Internet');
		}
		else {
            //..
			this.setState({ error: '', loading: true });
			axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'login',
				device: 'ios',
				password: hashedPass,
				username: username
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				console.log(response);
				
				if (response.data.success) {
					self._addToStorage(STORAGE_KEY, JSON.stringify(response.data));
					self.setState({ loggedIn: true });
					self.onLoginSuccess(response);
					
				}
				if (response.data.success === 0) {
					self.onLoginFail(response);
				}
			});
        }
			
		}
		
		renderButton() {
			if (this.state.loading) {
				return <Spinner size='small' />;
			}
			
			return (
			<LoginButton onPress={this.onButtonPress.bind(this)}>
			Login
			</LoginButton>
			);
			
		}
		onLoginFail(response) {
			this.setState({ error: response.data.error_msg, loading: false });
			Alert.alert(
			'Eroare',
			'Utilizator sau parola gresita',
			[
			{ text: 'OK', onPress: () => { } },
			],
			{ cancelable: false }
			)
		}
		
		onLoginSuccess(response) {
			
			this.setState({
				username: '',
				password: '',
				loading: false,
				error: ''
			});
			
			Actions.main({ responseData: response.data });
			
		}
		
		render() {
			
			//this.getPrice();
			
			
			return (
			
			<View style={styles.container}>
			<View style={styles.headerStyle}>
			<Image source={require('../../../assets/erovinieta_red.png')} />
			</View>
			<View style={styles.loginStyle}>
			<View style={styles.insideStyle}>
			<TextInput
			placeholder="utilizator"
			autoCorrect={false}
			style={styles.inputStyle}
			value={this.state.username}
			onChangeText={username => this.setState({ username })}
			/>
			</View>
			<View style={styles.insideStyle}>
			<TextInput
			secureTextEntry
			placeholder="parola"
			autoCorrect={false}
			style={styles.inputStyle}
			value={this.state.password}
			onChangeText={password => this.setState({ password })}
			/>
			</View>
			<View style={styles.insideStyle} >
			
			{this.renderButton()}
			</View>
			</View>
			<View style={styles.footerStyle}>
			<View style={styles.insideStyle} >
			<Text
			style={{ color: '#337ab7' }}
			onPress={() => Linking.openURL('https://www.e-rovinieta.ro/ro/contnou')}
			>
			Crează cont</Text>
			</View>
			
			<View style={styles.insideStyle} >
			<Text
			style={{ color: '#337ab7', paddingBottom: 10 }}
			onPress={() => Linking.openURL('https://www.e-rovinieta.ro/ro/reset')}
			>Resetare parolă</Text>
			</View>
			</View>
			</View>
			);
		}
		
	}
	
	
	
	
	const STORAGE_KEY = '@LgInfStore:key';
	const styles = {
		inputStyle: {
			flex: 1,
			textAlign: 'center',
			height: 40,
		},
		errorTextStyle: {
			fontSize: 20,
			alignSelf: 'center',
			color: 'red'
		},
		container: {
			flex: 1,
			flexDirection: 'column',
			backgroundColor: '#FFFFFF',
		},
		loginStyle: {
			flex: .5,
			justifyContent: 'center',
		},
		footerStyle: {
			flex: .3,
			alignSelf: 'center',
			justifyContent: 'flex-end',
			paddingBottom:15
			
		},
		headerStyle: {
			flex: .25,
			justifyContent: 'flex-end',
			alignSelf: 'center',
		},
		insideStyle: {
			padding: 5,
			justifyContent: 'flex-start',
			flexDirection: 'row',
			position: 'relative',
			alignSelf: 'center',
		}
		
	};
	export default LoginForm;
	
	