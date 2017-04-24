import React, { Component } from 'react';
import { View, Button, Image, Text, TouchableOpacity, Dimensions, Linking, ScrollView } from 'react-native';
import axios from 'axios';
import querystring from 'query-string';
import { Spinner } from '../../common';
//menu
const SideMenu = require('react-native-side-menu');
const Menu = require('../../common/Menu');
import MenuButton from '../../common/MenuButton';
import Header from '../../common/Header';
import { Actions } from 'react-native-router-flux';


//!menu!!
class Cars extends Component {

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


  state = {
    selected: '', cart: false, history: false, loading: true, vehicles: [], isOpen: false,
    selectedItem: 'Dashboard',
  };
  constructor(props) {
    super(props)
    this.state = { vehicles: [], loading: true, countries: [], categories: [] }
  }

  getCountryById(countryId) {
    console.log("start getCountryById ")

    for (var key in this.state.countries) {
      if (this.state.countries[key].id == countryId) {
        return (this.state.countries[key].code);
      }
    }
    console.log("end getCountryById ")
  }
  getCategoryById(categoyId) {
    console.log("start getCategoryById ")

    for (var key in this.state.categories) {

      if (this.state.categories[key].id == categoyId) {
        var category = this.state.categories[key].name;
        return (category);
      }
    }
    console.log("end getCategoryById ")
  }
  getCars() {
    var self = this;
    console.log("--getCars--");
    axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
      querystring.stringify({
        tag: 'vehicles',
        device: 'android',
        token: this.props.responseData.user.token
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function (response) {
        if (response.data.success) {
          self.setState({ vehicles: response.data.vehicles });
          console.table(self.state.vehicles);

        }
        if (response.data.success === 0) {
          console.log("Failed ");
        }
      });

  }
  getCountries() {
    var self = this;
    console.log("--getCountries--");
    axios.post('https://api.e-rovinieta.ro/mobile/1.0/get',
      querystring.stringify({
        tag: 'countries',
        device: 'android',
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(function (response) {

        if (response.data.success) {
          self.setState({ countries: response.data.countries });

          console.table(self.state.countries);

        }
        if (response.data.success === 0) {
          console.log("Failed getCountries ");
        }
      });

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
        self.setState({ loading: false });

        if (response.data.success) {
          self.setState({ categories: response.data.categories });

          console.table(self.state.categories);

        }
        if (response.data.success === 0) {
          console.log("Failed getCategories ");
        }
      });

  }
  setPageHeight = function (options) {
    return {

      height: 140 + this.state.vehicles.length * 85
    }
  }
  componentWillMount() {
    this.getCountries();
    this.getCars();
    this.getCategories();
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
          <Header headerText={'Mașinile mele'} />
          <ScrollView >

            <View>
              {this.renderCars()}
            </View>

          </ScrollView >


          {/*!!!Content end!!! */}
        </View>
        <MenuButton onPress={() => this.toggle()} />
      </SideMenu>
      // !!!Side menu end!!!
    );
  }
  renderCars() {
    if (this.state.loading || this.state.loading == undefined) {
      return (<View style={{ marginTop: 50 }} >
        <Spinner size='small' />
      </View>);
    }
    var self = this;
    if (this.state.vehicles == undefined || this.state.vehicles.length == 0)
      return (
        <View>
          <View style={styles.emptyContainerStyle}>
            <View style={styles.buttonStyle}>
              <Text > Nu exista masini inregistrate pe acest cont.</Text>
            </View>

          </View>
          <View style={styles.insideStyle} >
            <Text
              style={{ color: "#337ab7", }}
              onPress={() => Linking.openURL('https://www.e-rovinieta.ro/ro/masini')}
            >Iti poti configura parcul auto de aici</Text>
          </View>
        </View>
      );
    return (
      <View style={this.setPageHeight()}>
        <ScrollView >
          <View key={0} style={styles.containerStyle}>

            <Text style={[styles.textHeaderStyle]}>Informații mașină</Text>
          </View>
          {this.state.vehicles.map(function (o, i) {

            return (
              <View key={i + 1} style={styles.entryContainerStyle}>

                <View key={i + 2} style={styles.leftItemContainerStyle}>
                  <Text style={[styles.vehicleNoStyle]} key={0}>{o.plateNo}</Text>
                  <Text style={[styles.textStyle]} key={1}>{o.chasisNo}</Text>
                  <Text style={[styles.textStyle]} key={2}>Categoria {self.getCategoryById(o.category)}</Text>
                  <Text style={[styles.textStyle]} key={3}>{self.getCountryById(o.country)}</Text>
                </View>
                <View style={styles.rightItemContainerStyle}>

                  <TouchableOpacity
                    onPress={() => {
                      Actions.buy({
                        responseData: self.props.responseData, category: self.getCategoryById(o.category),
                        categoryID: o.category, chasisNo: o.chasisNo, plateNo: o.plateNo
                      })
                    }}
                    key={4}
                    style={{
                      flex: 1, height: 50, width: 50,
                    }}>
                    <Image
                      source={require('../../../../assets/add.png')} style={styles.imgStyle} key={5} />
                  </TouchableOpacity>


                </View>
              </View>

            )
          })}
          <View style={styles.insideStyle} >
            <Text
              style={{ color: "#337ab7", }}
              onPress={() => Linking.openURL('https://www.e-rovinieta.ro/ro/masini')}
            >Iti poti configura parcul auto de aici</Text>
          </View>
        </ScrollView >
      </View>
    );
  }
};
const window = Dimensions.get('window');
const styles = {
  entryContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 85

  },
  containerStyle: {
    paddingTop: 3,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  leftItemContainerStyle: {
    flex: 5,
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
    borderLeftWidth: 0

  },
  imgStyle: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    height: null,
    width: null,
    resizeMode: 'contain',
  },
  textStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    color: 'black',
    paddingTop: 4,
  },
  vehicleNoStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    color: 'black',
    paddingTop: 4,
    fontWeight: 'bold',
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
  insideStyle: {
    marginTop: 30,
    flex: 3,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    position: 'relative',
    alignSelf: 'center',
  },
  emptyContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 80,
    marginLeft: 10,
    marginRight: 10,
  }
  ,
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
};

export default Cars;