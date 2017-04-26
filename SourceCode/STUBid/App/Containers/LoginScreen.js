import React, { PropTypes } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Animated, Easing, Dimensions, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import LoginActions from '../Redux/LoginRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

//styles
import styles from './Styles/LoginScreenStyles'
import { Images } from '../Themes'

const { width, height } =  Dimensions.get('window');
const MARGIN = 40;

class LoginScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: 'reactnative@infinite.red',
      password: 'password',
      isLoading: false,
    };
    this.buttonAnimated = new Animated.Value(0);
		this.growAnimated = new Animated.Value(0);
		this._onPress = this._onPress.bind(this);
  }

  handleChangeUsername = (text) => {
    this.setState({ username: text })
  }

  handleChangePassword = (text) => {
    this.setState({ password: text })
  }

  _onPress() {
		if (this.state.isLoading) return;

		this.setState({ isLoading: true });
		Animated.timing(
			this.buttonAnimated,
			{
				toValue: 1,
				duration: 200,
				easing: Easing.linear
			}
		).start();

		setTimeout(() => {
			this._onGrow();
		}, 2000);

		setTimeout(() => {
		  NavigationActions.launchScreen(); //chuyen man hinh
		 	this.setState({ isLoading: false });
		 	this.buttonAnimated.setValue(0);
		 	this.growAnimated.setValue(0);
		}, 2300);

	}

	_onGrow() {
		Animated.timing(
			this.growAnimated,
			{
				toValue: 1,
				duration: 200,
				easing: Easing.linear
			}
		).start();
	}

  render () {
    const changeWidth = this.buttonAnimated.interpolate({
	    inputRange: [0, 1],
	    outputRange: [width - MARGIN, MARGIN]
	  });
	  const changeScale = this.growAnimated.interpolate({
	    inputRange: [0, 1],
	    outputRange: [1, MARGIN]
	  });

    return(
      <KeyboardAwareScrollView scrollEnabled={false} resetScrollToCoords={{ x: 0, y: 0 }} >
        <Image style={styles.container} source={Images.background} >
          {/*Form login*/}
          <View style={styles.form}>
            {/*logo*/}
            <Image style={styles.logo} source={Images.logo} />
            <Text style={styles.textForm}>ĐĂNG NHẬP</Text>

            {/*input-logo*/}
            <View style={styles.viewInput}>
              <TextInput
                style={styles.inputStyle}
                placeholder="Tên đăng nhập"
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                autoCorrect={false}
              />
              <View style={styles.line} />
              <TextInput
                style={styles.inputStyle}
                placeholder="Mật khẩu"
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                secureTextEntry
                autoCorrect={false}
              />
            </View>
            <View style={styles.viewForgotPass}>
              <TouchableOpacity>
                <Text style={styles.title}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            {/*button-login*/}
            <Animated.View style={{width: changeWidth}}>
      				<TouchableOpacity style={styles.button}
      					onPress={this._onPress}
      					activeOpacity={1} >
      						{this.state.isLoading ?
                    <ActivityIndicator
                      animating={this.state.isLoading}
                      color="white"
                      size="small"
                    />
      							:
      							<Text style={styles.text}>ĐĂNG NHẬP</Text>
      						}
      				</TouchableOpacity>
      				<Animated.View style={[ styles.circle, {transform: [{scale: changeScale}]} ]} />
      			</Animated.View>
          </View>
        </Image>

        {/*footer-login*/}
        <View style={styles.footer}>
          <Text style={styles.title}>Bạn không có tài khoản?</Text>
          <TouchableOpacity>
            <Text style={styles.createAccount}>Tạo tài khoản mới</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
