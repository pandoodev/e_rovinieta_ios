import React, { Component } from 'react';
var PushNotification = require('react-native-push-notification');

class PushController extends Component {

    componentDidMount() {
        PushNotification.configure({
            onNotification: function (notification) {
            },

        });

    }
    render()
    {
        return null;
    }


}

export default PushController;