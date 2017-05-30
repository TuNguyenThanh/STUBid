import React, { PropTypes } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Animated, Easing, Dimensions, ActivityIndicator, Alert } from 'react-native'
import { connect } from 'react-redux'
import LoginActions from '../Redux/LoginRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import md5 from 'blueimp-md5'

//styles
import styles from './Styles/LoginScreenStyles'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

const { width, height } =  Dimensions.get('window');
const MARGIN = 40;

class LoginScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      isLoading: false,
    };
    this.buttonAnimated = new Animated.Value(0);
		this.growAnimated = new Animated.Value(0);
		this._onPress = this._onPress.bind(this);
  }

  check(text) {
    var textRegex = /^[a-z0-9]+$/;
    return textRegex.test(text);
  }

  _onPress() {
		if (this.state.isLoading) return;
    const { username, password } = this.state;
    console.log(md5(password));
    if (!username) {
      this.message('Bạn chưa điền tên đăng nhập');
    } else {
      if(!this.check(username)) {
        this.message('Tên đăng nhập chỉ được sử dụng a-z 0-9');
      } else {
        if(username.length < 6) {
          this.message('Tên đăng nhập ít nhất 6 ký tự');
        } else {
          if(username.length >= 18) {
            this.message('Tên đăng nhập tối đa 18 ký tự');
          } else {
            if (!password) {
              this.message('Bạn chưa điền mật khẩu');
            } else {
              if (password.length < 6) {
                this.message('Mật khẩu ít nhất 6 ký tự');
              } else {
                if(password.length >= 18) {
                  this.message('Mật khẩu tối đa 18 ký tự');
                } else {
                  //check oke

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
              		  NavigationActions.pop(); //chuyen man hinh
              		 	this.setState({ isLoading: false });
              		 	this.buttonAnimated.setValue(0);
              		 	this.growAnimated.setValue(0);
              		}, 2300);
                }
              }
            }
          }
        }
      }
    }
	}

  message(mess) {
    Alert.alert(
      'Thong bao',
      mess,
      [
        {text: 'OK', onPress: () => {}},
      ],
      { cancelable: false }
    );
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
    const { language } = this.props;
    return(
      <KeyboardAwareScrollView scrollEnabled={false} resetScrollToCoords={{ x: 0, y: 0 }} >
        <Image style={styles.container} source={Images.background} >
          <TouchableOpacity style={styles.backButton} onPress={() => NavigationActions.pop()}>
            <Icon name="chevron-circle-left" size={35} color={Colors.primary}  />
          </TouchableOpacity>
          {/*Form login*/}
          <View style={styles.form}>
            {/*logo*/}
            <Image style={styles.logo} source={Images.logo} resizeMode="contain" />
            <Text style={styles.textForm}>{I18n.t('login', {locale: language})}</Text>

            {/*input-logo*/}
            <View style={styles.viewInput}>
              <TextInput
                style={styles.inputStyle}
                placeholder={I18n.t('username', {locale: language})}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='next'
                value={this.state.username}
                onChangeText={(username) => this.setState({ username })}
                onSubmitEditing={() => this.password.focus()}
              />
              <View style={styles.line} />
              <TextInput
                ref={(input) => this.password = input}
                style={styles.inputStyle}
                placeholder={I18n.t('password', {locale: language})}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                secureTextEntry
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='go'
                value={this.state.password}
                onChangeText={(password) => this.setState({ password })}
                onSubmitEditing={() => this._onPress()}
              />
            </View>
            <View style={styles.viewForgotPass}>
              <TouchableOpacity onPress={() => NavigationActions.forgotPasswordScreen()}>
                <Text style={styles.title}>{I18n.t('forgotPassword', {locale: language})}</Text>
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
      							<Text style={styles.text}>{I18n.t('login', {locale: language})}</Text>
      						}
      				</TouchableOpacity>
      				<Animated.View style={[ styles.circle, {transform: [{scale: changeScale}]} ]} />
      			</Animated.View>
          </View>
        </Image>

        {/*footer-login*/}
        <View style={styles.footer}>
          <Text style={styles.title}>{I18n.t('notAccount', {locale: language})}</Text>
          <TouchableOpacity onPress={() => NavigationActions.creactAccountScreen()}>
            <Text style={styles.createAccount}>{I18n.t('creatAccount', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching,
    language: state.settings.language,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
