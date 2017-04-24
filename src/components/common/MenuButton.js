
import React, {Component} from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet  } from 'react-native';



class MenuButton extends Component {
  handlePress(e) {
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={styles.button}>
        <View>
              <Image
            source={require('../../../assets/menu.png')} style={{width: 44, height: 44}} />

        </View>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    padding: 8,
    

  },
});

export default MenuButton;

