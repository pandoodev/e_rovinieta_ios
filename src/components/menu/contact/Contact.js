import React, { Component } from 'react';
import { View, Button, Image, Text, TouchableOpacity, Dimensions, Linking } from 'react-native';
//menu
const SideMenu = require('react-native-side-menu');
const Menu = require('../../common/Menu');
import MenuButton from '../../common/MenuButton';
import Header from '../../common/Header';

import { Spinner } from '../../common';

//!menu!!

class Contact extends Component {

    state = { loading: true };
    constructor(props) {
        super(props)
        this.state = { loading: true }
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


    state = {
        selected: '', cart: false, history: false, isOpen: false,
        selectedItem: 'Dashboard',
    };

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
                    <Header headerText={'Contact'} />



                    <View style={styles.containerStyle}>
                        <View style={styles.buttonStyle} >

                             

                            <Text style={styles.textStyle} >
                                <Text style={styles.textTitleStyle} >
                               UNTRR Bucuresti{'\n'}
                                </Text>
                                Str. Ienăchiţă Văcărescu Nr. 60{'\n'}
                                Bucureşti, Sector 4, 040157{'\n'}
                                Email: office@untrr.ro{'\n'}
                            </Text>

                            
                            <Text style={styles.textStyle} >
                                <Text style={styles.textTitleStyle} >
                                Emitere roviniete{'\n'}
                                </Text>
                                Dna. Florina Sburlan{'\n'}
                                Telefon: 021-337.47.42{'\n'}
                                Fax: 021-337.47.41{'\n'}
                                Email: florina.sburlan@untrr.ro
                            </Text>
                            <View style={styles.insideStyle} >
                                <Text
                                    style={{ color: '#337ab7', paddingBottom: 10 }}
                                    onPress={() => Linking.openURL('https://www.e-rovinieta.ro/ro/contact')}
                                >www.e-rovinieta.ro/contact</Text>
                            </View>
                        </View>

                    </View>




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
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginLeft: 40,
        marginRight: 40,
    }
    ,
    insideStyle: {
        paddingTop: 10,
        justifyContent: 'space-around',
        flexDirection: 'row',
        position: 'relative',
        alignSelf: 'center',
    },
    buttonStyle: {
        marginTop:- window.height * 0.16,
        height: window.height * 0.35,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
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
        marginTop: 7,


    },
    textTitleStyle: {
        marginTop: 10,
        fontWeight: 'bold'

    }

};

export default Contact;
