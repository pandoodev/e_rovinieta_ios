// Import libraries for making a component
import React, {Component} from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';


// Make a component
class Header extends Component{


  render(){

    return (
      <View style={styles.viewStyle}>

        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={styles.textStyle}>{this.props.headerText}</Text>

          {<TouchableOpacity underlayColor={'rgba(255, 255, 255, 0.2)'}
            onPress={() => { this.goBackFunction(); }}
            style={styles.backArrowStyle}>
            <Image style={{width:24,height:24}} source={require('../../../assets/back_arrow_blue.png')} />
          </TouchableOpacity>}


        </View>

      </View>
    );

  }


  goBackFunction() {
    Actions.pop();
  }

};

const styles = {

  backArrowStyle: {

    justifyContent: 'flex-end',     
    marginRight:5,
    width: 25,
    height: 25,    
    
  },
  viewStyle: {
    marginTop:19,
    flexDirection:'row',
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  textStyle: {       
    flex:1,
    marginLeft:30,
    fontSize: 20,
    flexDirection:'row',
    color: 'white',
    textAlign:'center',
  }
};

// Make the component available to other parts of the app
export default Header;
