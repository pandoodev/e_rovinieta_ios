import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { Spinner, Button, } from '../../common';
import axios from 'axios';
import querystring from 'query-string';
import { Actions } from 'react-native-router-flux';
//menu
const SideMenu = require('react-native-side-menu');
const Menu = require('../../common/Menu');
import MenuButton from '../../common/MenuButton';
import Header from '../../common/Header';
//!menu!!
class Profile extends Component {

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

	state = { selected: '', cart: false, history: false, loading: true, profiles: [] };
	constructor(props) {
		super(props)
		this.state = { profile: [], loading: true }
	}
	renderProfiles() {
		var self = this;

		if (this.state.loading || this.state.loading == undefined) {
			return (

				<View style={{ marginTop: 50 }} >
					<Spinner size='small' />
				</View>
			);
		}
		return (<View style={this.setPageHeight()}>
			<ScrollView >
				<View style={styles.titleContainerStyle}>
					<Text style={styles.nrCrtHeaderStyle}>Activ</Text>
					<Text style={styles.textTitleContainerStyle}>Nume profil</Text>
					<Text style={styles.iconTitleContainerStyle}>Tip</Text>
					<Text style={styles.iconTitleContainerStyle}>  </Text>
					<Text style={styles.iconTitleContainerStyle}></Text>

				</View>
				{this.state.profiles.map(function (o, i) {


					if (o.type == "0") {
						var profileType = "Juridică";
						var profileName = o.companyName;

					} else {
						var profileType = "Fizică";
						var profileName = o.lastName + ' ' + o.firstName;

					}

					return (


						<View key={i} style={styles.itemContainerStyle}>

							<View style={styles.nrCrtStyle} key={0}>
							
								
								{self.displayActiveContent(o)}

							</View>

							<Text style={styles.textStyle} key={1}>{profileName}</Text>
							<Text style={styles.profileTypeStyle} key={2}>{profileType}</Text>

							<TouchableOpacity style={styles.iconContainerStyle} onPress={() => { self.editProfileButton(i) }} key={3}>
								<Image
									style={styles.deleteItemButtonStyle}
									source={require('../../../../assets/edit.png')}
								/>
							</TouchableOpacity>

							<TouchableOpacity style={styles.iconContainerStyle} onPress={() => { self.deleteProfileButton(i) }} key={4}>
								<Image
									style={styles.deleteItemButtonStyle}
									source={require('../../../../assets/delete.png')}
								/>
							</TouchableOpacity>
						</View>
					);

				})}
			</ScrollView >
		</View>);
	}

	displayActiveContent(profile) {
		if (profile.default === "1") {
			return (
				<Image
					style={styles.activityButtonStyle}
					source={require('../../../../assets/online.png')}
				/>
			);
		}
		else {
			return (

				<Image
					style={styles.activityButtonStyle}
					source={require('../../../../assets/offline.png')}
				/>
			);
		}
	}

	addProfileButton(i) {
		console.log('add' + i);
		Actions.add_profile({ responseData: this.props.responseData, headerTitle: 'Creare profil' });

	}
	editProfileButton(i) {
		console.log('edit' + i);
		Actions.edit_profile({ responseData: this.props.responseData, headerTitle: 'Editare profil', profileToModify: this.state.profiles[i] });
	}
	deleteProfileButton(index) {
		// 		@tag = ‘profile_delete’
		// @device (‘android’ sau ‘ios’)
		// @token (Tokenul returnat prin metoda de login)
		// @pid - id-ul profilului
		console.log("--deleteProfileButton--");

		// Works on both iOS and Android
		Alert.alert(
			'Stergere profil',
			'Sigur doriți să stergeți profilul selectat?',
			[
				{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
				{ text: 'OK', onPress: () => { console.log('OK Pressed'); this.confirmDeleteProfile(index) } },
			],
			{ cancelable: false }
		)
	}

	confirmDeleteProfile(index) {
		var self = this;
		axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
			querystring.stringify({
				tag: 'profile_delete',
				device: 'android',
				token: this.props.responseData.user.token,
				pid: this.state.profiles[index].id
			}), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				if (response.data.success) {

					console.log(self.state.profiles)
					self.message('Succes', 'Profilul a fost șters din baza de date.');

					var profilesCurrent = self.state.profiles;
					profilesCurrent.splice(index, 1);
					self.setState({ itemsInCart: profilesCurrent });


					console.log(self.state.profiles)

					console.log(response.data)
				}
				if (response.data.success === 0) {
					console.log(response.data);
					if (response.data.error_msg != undefined && response.data.error_msg != '') {
						self.message('Eroare', response.data.error_msg);
					}
					else {
						self.message('Atentie', 'Eroare la stergerea profilului');
					}
				}
			});
	}


	getProfiles() {

		var self = this;
		console.log("--getProfiles--");
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
					self.state.profiles = response.data.profiles;
					self.setState({ loading: false });

					console.log(response.data)

				}
				if (response.data.success === 0) {
					console.log("Failed ");
				}
			});
	}
	setPageHeight = function (options) {
		return {

			height: 100 + this.state.profiles.length * 30
		}
	}
	componentWillMount() {
		this.getProfiles();
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
					<Header headerText={'Profilurile mele'} />
					<ScrollView>

						<View>
							<View>
								{this.renderProfiles()}

							</View>
						</View>

						<View style={styles.buttonContainerStyle}>
							<View style={styles.buttonStyle}>
								<Button onPress={this.addProfileButton.bind(this)}>
									Adaugă Profil
	 						 </Button>
							</View>
						</View>
					</ScrollView>

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
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 30,
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
	titleContainerStyle: {
		paddingTop: 3,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 30,
		marginLeft: 10,
		marginRight: 10,
	},
	textStyle: {
		color: 'black',
		flex: 4,
		justifyContent: 'center',
		alignItems: 'center',
		width: 10,
		height: 30,
		paddingTop: 5,
		paddingLeft: 5,

		borderColor: '#bbb',
		borderWidth: 1,
	},
	textTitleContainerStyle: {
		flex: 4,
		paddingTop: 3,
		backgroundColor: '#222222',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 5,
		color: 'white',
		height: 30,
		fontSize: 16,
	},
	iconTitleContainerStyle: {
		paddingTop: 4,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 5,
		height: 30,
		fontSize: 16,
		backgroundColor: '#222222',
		color: 'white',

	},
	profileTypeStyle: {
		paddingTop: 5,
		flex: 1.5,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 5,
		color: 'black',
		height: 30,
		borderColor: '#bbb',
		borderWidth: 1,


	},
	iconContainerStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 5,
		height: 30,
		borderColor: '#bbb',
		borderWidth: 1,


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
	deleteItemButtonStyle: {
		flex: 1,
		resizeMode: 'contain',
		justifyContent: 'center',
	},
	activityButtonStyle: {
		 flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    width: 20	,
    resizeMode: 'contain',
	},
	buttonContainerStyle: {
		flex: 1,
		flexDirection: 'row',
		paddingBottom: 10

	}
	,
	buttonStyle: {
		flex: 1,
		height: 50

	},
	nrCrtHeaderStyle: {
		flex: 1.5,
		paddingTop: 3,
		backgroundColor: '#222222',
		justifyContent: 'center',
		alignItems: 'center',
		paddingLeft: 5,
		color: 'white',
		height: 30,
		fontSize: 16,

	}, nrCrtStyle: {
		
		flex: 1.5,
		justifyContent: 'space-around',
		
		alignItems: 'center',
		paddingLeft: 5,
		height: 30,
		borderColor: '#bbb',
		borderWidth: 1,
	},
};

export default Profile;