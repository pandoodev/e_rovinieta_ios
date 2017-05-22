import React, { Component } from 'react';
import { View, Text, Picker, Alert, AsyncStorage, ScrollView , NetInfo, AlertIOS} from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from '../../common';
import DatePicker from 'react-native-datepicker'
var dateFormat = require('dateformat');
import Header from '../../common/Header';
import axios from 'axios';
import querystring from 'query-string';
import { Actions } from 'react-native-router-flux';
import SimplePicker from 'react-native-simple-picker';


//menu
const SideMenu = require('react-native-side-menu');
const Menu = require('../../common/Menu');
import MenuButton from '../../common/MenuButton';
//menu
const profileTypes=["Persoană Juridică","Persoană Fizică" ];
const profileTypesId=[0,1];
class AddProfile extends Component {
    state = {
        profileType: 1, 
        country: 1, 
        county: 1, 
        counties: [], 
        countries: [], 
        firstName: '', 
        lastName: '', 
        city: '',
         street: '',
          CNP: null,
           error: "",
            loading: false,
             buttonLoading: false,
        companyName: '',
         companyCity: '',
          cuiCode: null,
           jCode: null, 
           companyAddress: '',
             arrCountriesValues: [],
        arrCountriesLabels: [],
        arrCountiesValues: [],
        arrCountiesLabels: [],
        selectedCountryLabel: 'ROMANIA',
        selectedCountyLabel: 'Iasi'

    };
    constructor(props) {
        super(props)
        this.state = {
            profileType: 1, 
            country: 1,
             county: 1,
              counties: [], 
              countries: [], 
              firstName: '', 
              lastName: '', 
              city: '', 
              street: '',
              CNP: null, 
              error: "", 
              loading: false, 
              buttonLoading: false,
            companyName: '',
             companyCity: '', 
             cuiCode: null, 
             jCode: null, 
             companyAddress: '',
               arrCountriesValues: [],
        arrCountriesLabels: [],
        arrCountiesValues: [],
        arrCountiesLabels: [],
        selectedCountryLabel: 'ROMANIA',
        selectedCountyLabel: 'Iasi'
        }
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




    componentWillMount() {

        this.getCountries();
        this.getCounties();
    }
  componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'change',
            this._handleConnectivityChange
        );
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected }); }
        );
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
    }
    renderButton() {

        if (this.state.buttonLoading) {
            return <Spinner size='small' />;
        }

        return (
            //	<Button onPress = {this.onButtonPress.bind(this)}> 
            <Button onPress={this.submitChangesButton.bind(this)}>
                Crează Profil
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
                device: 'ios',
                token: this.props.responseData.user.token
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (response) {
                if (response.data.success) {

                    self.setState({ profileID: response.data.profiles[0]['id'] });


                }
                if (response.data.success === 0) {
                    console.log("unsuccess while getting profile id");
                    console.log(response.data);
                }
            });
    }

    submitChangesButton() {

        if (!this.state.isConnected) {
            AlertIOS.alert(
                'Network',
                'Your device is offline! Please connect to the Internet');
        }
        else {
        this.setState({ buttonLoading: true });
        if (this.state.profileType === 1) {

            console.log("fizic")
            this.createPhysProfile();
        }
        else {
            console.log("juridic")
            this.createJurProfile();
        }
        }

    }
    createPhysProfile() {

        // @type = 1
        // @firstname
        // @lastname
        // @address
        // @city
        // @county(din api-ul de Counties)
        // @country(din api-ul de Countries)
        // @cnp

        // Daca userul este de tip persoana fizica:
        console.log("-createProfile--")
        var self = this;
        console.log(self.state.firstName + self.state.lastName + self.state.street + self.state.city + 'Country' + self.state.country + 'County' + self.state.county + 'CnP' + self.state.CNP);
        axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
            querystring.stringify({
                tag: 'profile_new',
                device: 'ios',
                token: self.props.responseData.user.token,
                type: 1,
                firstName: self.state.firstName,
                lastName: self.state.lastName,
                address: self.state.street,
                city: self.state.city,
                country: self.state.country,
                county: self.state.county,
                //personalCode: self.state.CNP,


            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (response) {
                self.setState({ loading: false, buttonLoading: false });

                if (response.data.success) {

                    console.log(response.data);
                    Actions.profiles({ responseData: self.props.responseData, headerTitle: 'Profilele mele' });


                }
                if (response.data.success === 0) {
                    if (response.data.error_msg != undefined && response.data.error_msg != '') {
                        self.message('Eroare', response.data.error_msg);
                    }
                    else {
                        selfmessage('Eroare', 'Vă rugăm să verificați corectitudinea datelor introduse');
                    }
                    console.log(response.data);

                }

            });


    }
    createJurProfile() {

        // @type = 0
        // @company
        // @address
        // @city
        // @county(din api-ul de Counties)
        // @country(din api-ul de Countries)
        // @fiscalcode(Cod fiscal)
        // @jcode(Registru comert)
        //         @tag = ‘profile_new’
        // @device (‘android’ sau ‘ios’)
        // @token (Tokenul returnat prin metoda de login)


        // Daca userul este de tip persoana juridica:
        console.log("-createProfile--")
        var self = this;
        console.log(self.state.companyName + self.state.address + self.state.companyCity + self.state.jCode + 'sss' + self.state.country + self.state.county + 'ss' + self.state.cuiCode);
        axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
            querystring.stringify({
                tag: 'profile_new',
                device: 'ios',
                token: self.props.responseData.user.token,
                type: 0,
                companyName: self.state.companyName,
                address: self.state.address,
                city: self.state.companyCity,
                county: self.state.county,
                country: self.state.country,
                fiscalCode: self.state.cuiCode,
                regCom: self.state.jCode,


            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (response) {
                self.setState({ loading: false, buttonLoading: false });
                console.log("juridic resoinse");
                console.log(response.data);
                console.log("1");

                if (response.data.success) {
                    console.log("success");
                    console.log(response.data);
                    Actions.profiles({ responseData: self.props.responseData, headerTitle: 'Profilele mele' });
                    console.log("!success");

                }
                else {
                    console.log("else");
                    console.log(response.data);
                    if (response.data.success != undefined && response.data.success === 0) {
                        if (response.data.error_msg != undefined && response.data.error_msg != '') {
                            self.message('Eroare', response.data.error_msg);
                            console.log("error if");

                        }

                        console.log("!else");

                    }
                    else {
                        
                      
                        if (self.state.cuiCode == undefined || self.state.cuiCode == '') {
                            self.message('Eroare', "Vă rugam să completați CUI");

                         cuiOK=false;
                         return
                        }
                        else{
                        var cuiOK=true;
                            
                        }

                        if (self.state.jCode == undefined || self.state.jCode == '') {
                            self.message('Eroare', "Vă rugam să completați R.Comerț");
                         jCode=false;
                         return

                        }
                        else
                        {
                              var jCode=true;
                        }
                        if(jCode===true && cuiOK===true ){
                        console.log("all ok");
                             Actions.profiles({ responseData: self.props.responseData, headerTitle: 'Profilele mele' });
                        }
                        


                    }

                }
                console.log("juridic resoinse end");

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
                var arrCountriesLabels = [];
                var arrCountriesValues = [];
                response.data.countries.forEach(function (countrieInfo) {
                    arrCountriesLabels.push(countrieInfo['name']);
                    arrCountriesValues.push(countrieInfo['id']);
                }, this);
                self.setState({ arrCountriesLabels: arrCountriesLabels });
                self.setState({ arrCountriesValues: arrCountriesValues });
                if (self.props.profileToModify != undefined && self.props.profileToModify != '' && self.props.profileToModify.country != undefined && self.props.profileToModify.country != '') {
                    self.setState({ selectedCountryLabel: arrCountriesLabels[arrCountriesValues.indexOf(self.props.profileToModify.country)] })
                    console.log(self.props.profileToModify.country)
                    console.log(self.state.selectedCountryLabel)
                }
                self.setState({ error: '', loading: false });
            }
            if (response.data.success === 0) {
                console.log("unsuccess from getCountries");
            }
        });
        
    }
    getCounties() {
        var self = this;
        self.setState({ loading: true });
        
        axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
        querystring.stringify({
            tag: 'counties',
            device: 'android'
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            if (response.data.success) {
                var arrCountiesLabels = [];
				var arrCountiesValues = [];
                response.data.counties.forEach(function (countieInfo) {
                    arrCountiesLabels.push(countieInfo['name']);
					arrCountiesValues.push(countieInfo['id']);
                }, this);
                 if (self.props.profileToModify != undefined && self.props.profileToModify != '' && self.props.profileToModify.county != undefined && self.props.profileToModify.county != '') {
                    self.setState({ selectedCountyLabel: arrCountiesLabels[arrCountiesValues.indexOf(self.props.profileToModify.county)] })
                    console.log(self.props.profileToModify.county)
                    console.log(self.state.selectedCountyLabel)
                    console.log(self.state.selectedCountyLabel)
                    
                }
                self.setState({ arrCountiesLabels: arrCountiesLabels });
				self.setState({ arrCountiesValues: arrCountiesValues });
                self.setState({ error: '', loading: false, buttonLoading: false });
               
            }
            if (response.data.success === 0) {
                console.log("unsuccess from getCounties");
            }
        });
        
    }
    
    
    renderCountries() {
        if (this.state.loading || this.state.loading == undefined) {
            return (
            <Spinner size='small' />);
        }
        return (
        <View style={styles.pickerContainerStyle}>
        
        
        <Text
        style={styles.textStyle}
        onPress={() => {
            this.refs.countries.show();
        }}
        >
        {this.state.selectedCountryLabel}
        </Text>
        
        <SimplePicker
        ref={'countries'}
        options={this.state.arrCountriesValues}
        labels={this.state.arrCountriesLabels}
        onSubmit={(loc) => this.setState({ country: loc, selectedCountryLabel: this.state.arrCountriesLabels[this.state.arrCountriesValues.indexOf(loc)] })}
        itemStyle={{
            fontSize: 25,
            color: 'black',
            textAlign: 'center',
            fontWeight: 'bold',
        }}
        />
        </View>
        );
    }


   
    renderCounties() {
        if (this.state.loading || this.state.loading == undefined) 
        {
            return <Spinner size='small' />;
        }
        return (
        <View style={styles.pickerContainerStyle}>
        
        
        <Text
        style={styles.textStyle}
        onPress={() => {
            this.refs.counties.show();
        }}
        >
        {this.state.selectedCountyLabel}
        </Text>
        
        <SimplePicker
        ref={'counties'}
        options={this.state.arrCountiesValues}
        labels={this.state.arrCountiesLabels}
        onSubmit={(loc) => this.setState({ county: loc, selectedCountyLabel: this.state.arrCountiesLabels[this.state.arrCountiesValues.indexOf(loc)] })}
        itemStyle={{
            fontSize: 25,
            color: 'black',
            textAlign: 'center',
            fontWeight: 'bold',
        }}
        />
        </View>
        );
    }

    showForm() {

        if (this.state.profileType == 0) {
            return (
                <View>
                    <CardSection >
                        <Input
                            label="Denumire"
                            value={this.state.companyName}
                            onChangeText={companyName => this.setState({ companyName })}
                        />
                    </CardSection>

                    <CardSection>
                        <Text style={styles.textStyle} > Țara </Text>
                        {this.renderCountries()}

                    </CardSection>
                    <CardSection>
                        <Text style={styles.textStyle} > Județ </Text>
                        {this.renderCounties()}

                    </CardSection>
                    <CardSection >
                        <Input
                            label="Oraș"
                            value={this.state.companyCity}
                            onChangeText={companyCity => this.setState({ companyCity })}
                        />
                    </CardSection>
                    <CardSection >
                        <Input
                            label="Adresă"
                            value={this.state.address}
                            onChangeText={address => this.setState({ address })}
                        />
                    </CardSection>
                    <CardSection >
                        <Input
                            label="CUI"
                            value={this.state.cuiCode}
                            onChangeText={cuiCode => this.setState({ cuiCode })}
                        />
                    </CardSection>
                    <CardSection >
                        <Input
                            label="R. Comerț"
                            value={this.state.jCode}
                            onChangeText={jCode => this.setState({ jCode })}
                        />
                    </CardSection>

                    {this.renderButton()}
                </View>

            );
        }



        else {
            return (
                <View>
                    <CardSection >
                        <Input
                            label="Prenume"
                            value={this.state.firstName}
                            onChangeText={firstName => this.setState({ firstName })}
                        />
                    </CardSection>
                    <CardSection >
                        <Input
                            label="Nume"
                            value={this.state.lastName}
                            onChangeText={lastName => this.setState({ lastName })}
                        />
                    </CardSection>

                    <CardSection>
                        <Text style={styles.textStyle} > Țara </Text>
                        {this.renderCountries()}

                    </CardSection>
                    <CardSection>
                        <Text style={styles.textStyle} > Județ </Text>
                        {this.renderCounties()}


                    </CardSection>
                    <CardSection >
                        <Input
                            label="Oraș"
                            value={this.state.city}
                            onChangeText={city => this.setState({ city })}
                        />
                    </CardSection>
                    <CardSection >
                        <Input
                            label="Adresă"
                            value={this.state.street}
                            onChangeText={street => this.setState({ street })}
                        />
                    </CardSection>
                    {/*<CardSection >
                        <Input
                            label="CNP"
                            value={this.state.CNP}
                            onChangeText={CNP => this.setState({ CNP })}
                        />
                    </CardSection>*/}


                    {this.renderButton()}

                </View>
            );
        }
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
                    <Header headerText={this.props.headerTitle} />
                    <ScrollView >

                        <Card >
                            <CardSection>
                                <Text style={styles.textStyle}> Tip Profil </Text>
                                <View style={styles.pickerContainerStyle}>
                                          <Text
        style={styles.textStyle}
        onPress={() => {
            this.refs.profile.show();
        }}
        >
        {profileTypes[this.state.profileType]}
        </Text>
        
        <SimplePicker
        ref={'profile'}
        labels={profileTypes}
        options={profileTypesId}
        onSubmit={(type) => this.setState({ profileType: type })}
        itemStyle={{
            fontSize: 25,
            color: 'black',
            textAlign: 'center',
            fontWeight: 'bold',
        }}
        />
                                    
                                </View>
                            </CardSection>
                            {this.showForm()}
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
const inCartRovignetteKey = '@inCartRovignetteKey:key';
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
};

export default AddProfile;


