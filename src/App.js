import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux';
import LoginForm from './components/login/LoginForm';
import AddToCart from './components/menu/store/rov_shopping/AddToCart';
import AddProfile from './components/menu/profile/AddProfile';
import EditProfile from './components/menu/profile/EditProfile';
import RovignetteShopMain from './components/menu/store/rov_shopping/RovignetteShopMain';
import PaymentConfirmation from './components/menu/store/rov_shopping/PaymentConfirmation';
import BuyBridgeTicket from './components/menu/store/bridge_shopping/BuyBridgeTicket';
import Categories from './components/menu/store/bridge_shopping/Categories';
import Dashboard from './components/menu/store/Dashboard';
import Profile from './components/menu/profile/Profile';
import Cars from './components/menu/mycars/Cars';
import AccountSettings from './components/menu/accountsettings/AccountSettings';


const scenes = Actions.create(
	<Scene key="root">

		<Scene key="auth" hideNavBar initial type={ActionConst.RESET}>
			<Scene key="login" component={LoginForm} title="Please Login" />
		</Scene>

		<Scene key="main" hideNavBar type={ActionConst.RESET}>
			<Scene key="dashboard" component={Dashboard} initial/>
			<Scene key="profiles" component={Profile} />
			<Scene key="add_profile" component={AddProfile} />
			<Scene key="edit_profile" component={EditProfile} />
			<Scene key="cars" component={Cars} />
			<Scene key="account_settings" component={AccountSettings} />
			
			<Scene key="buy" component={AddToCart} />
			<Scene key="shop" component={RovignetteShopMain} />		
			<Scene key="payment"  component={PaymentConfirmation} />		
			<Scene key="bridge_ticket" component={BuyBridgeTicket} />
			<Scene key="bridge_ticket_to_cart" component={Categories} />
			
		</Scene>
		
	</Scene>

);

class App extends Component {
	
	render(){
		
		return(
			
			<Router scenes={scenes}/>

		);
	}
}
export default App;