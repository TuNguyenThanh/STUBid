import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import OneSignal from 'react-native-onesignal';

var _this;
class PushController extends Component {
  constructor(props) {
    super(props);
    _this = this;
  }

  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.enableVibrate(true);
    OneSignal.inFocusDisplaying(2);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onRegistered(notifData) {
    console.log("Device had been registered for push notifications!", notifData);
  }

  onIds(device) {
    console.log('Device info: ', device);
    //console.log(device.userId, device.pushToken);
    // const deviceType = (Platform.OS === 'ios') ? 'ios' : 'android';
    // _this.props.pushInfo(deviceType, device.pushToken)
  }

	render() {
		return null;
	}
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapStateToDispatch = dispatch => ({

});
export default connect(mapStateToProps, mapStateToDispatch)(PushController)
