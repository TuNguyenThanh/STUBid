import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import md5 from 'blueimp-md5'

// Styles
import styles from './Styles/CreactAccountScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class CreactAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: 'Tu',
      lastName: 'Nguyen',
      email: 'thanhtu.dev@gmail.com',
      phone: '0903016975',
      username: 'thanhtu',
      password: '123456',
      rePassword: '123456',
    };
  }

  componentWillReceiveProps(nextProps){
    const { sceneKey } = nextProps;
    if(sceneKey == 'creactAccountScreen') {
      NavigationActions.pop();
    }
  }

  handleRegister() {
    const { firstName, lastName, email, phone, username, password, rePassword } = this.state;
    console.log(md5(password));
    if (!firstName) {
      this.message('Bạn chưa điền Tên');
    } else {
      if (!lastName) {
        this.message('Bạn chưa điền Họ');
      } else {
        if (!email) {
          this.message('Bạn chưa điền Email');
        } else {
          if (!this.validateEmail(email)) {
            this.message('Địa chỉ email không hợp lệ');
          } else {
            if (!phone) {
              this.message('Bạn chưa điền số điện thoại');
            } else {
              if(phone.length < 10 || phone.length >= 12){
                this.message('Số điện thoại không hợp lệ');
              } else {
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
                              if (!rePassword) {
                                this.message('Bạn chưa điền nhập lại mật khẩu');
                              } else {
                                if (password !== rePassword) {
                                  this.message('Mật khẩu và nhập lại phải giống nhau');
                                } else {
                                  //oke - register
                                  NavigationActions.checkCodeScreen()

                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    //end if
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

  validateEmail(email) {
    const check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return check.test(email);
  }

  check(text) {
    var textRegex = /^[a-z0-9]+$/;
    return textRegex.test(text);
  }

  render () {
    const { language } = this.props;
    return (
      <KeyboardAwareScrollView scrollEnabled={false} resetScrollToCoords={{ x: 0, y: 0 }} >
        <Image style={styles.container} source={Images.background} >
          <TouchableOpacity style={styles.backButton} onPress={() => NavigationActions.pop()}>
            <Icon name="times-circle" size={35} color={Colors.primary}  />
          </TouchableOpacity>
          {/*Form register*/}
          <View style={styles.form}>
            {/*title*/}
            <Image style={styles.logo} source={Images.logo} resizeMode="contain" />
            <Text style={styles.textForm}>{I18n.t('creatAccount', {locale: language})}</Text>

            {/*input-form*/}
            <View style={styles.viewInput}>
              <View style={styles.viewHead}>
                <TextInput
                  style={[styles.inputStyle, {flex: 1}]}
                  placeholder={I18n.t('firstName', {locale: language})}
                  placeholderTextColor="#989899"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                  returnKeyType='next'
                  value={this.state.firstName}
                  onChangeText={(firstName) => this.setState({ firstName })}
                  onSubmitEditing={() => this.lastName.focus()}
                />
                <View style={styles.line2} />
                <TextInput
                  ref={(input) => this.lastName = input}
                  style={[styles.inputStyle, {flex: 1}]}
                  placeholder={I18n.t('lastName', {locale: language})}
                  placeholderTextColor="#989899"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  underlineColorAndroid={'transparent'}
                  returnKeyType='next'
                  value={this.state.lastName}
                  onChangeText={(lastName) => this.setState({ lastName })}
                  onSubmitEditing={() => this.email.focus()}
                />
              </View>
              <View style={styles.line} />
              <TextInput
                ref={(input) => this.email = input}
                style={styles.inputStyle}
                placeholder={I18n.t('email', {locale: language})}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='next'
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={(email) => this.setState({ email })}
                onSubmitEditing={() => this.phone.focus()}
              />
              <View style={styles.line} />
              <TextInput
                ref={(input) => this.phone = input}
                style={styles.inputStyle}
                placeholder={I18n.t('phoneNumber', {locale: language})}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='next'
                keyboardType={'phone-pad'}
                value={this.state.phone}
                onChangeText={(phone) => this.setState({ phone })}
                onSubmitEditing={() => this.username.focus()}
              />
              <View style={styles.line} />
              <TextInput
                ref={(input) => this.username = input}
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
                returnKeyType='next'
                value={this.state.password}
                onChangeText={(password) => this.setState({ password })}
                onSubmitEditing={() => this.rePassword.focus()}
              />
              <View style={styles.line} />
              <TextInput
                ref={(input) => this.rePassword = input}
                style={styles.inputStyle}
                placeholder={I18n.t('repeatPassword', {locale: language})}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                secureTextEntry
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='go'
                value={this.state.rePassword}
                onChangeText={(rePassword) => this.setState({ rePassword })}
                onSubmitEditing={() => this.handleRegister()}
              />
            </View>

            {/*button-register*/}
    				<TouchableOpacity style={styles.button} onPress={() => this.handleRegister()}>
    					<Text style={styles.buttonText}>{I18n.t('register', {locale: language})}</Text>
    				</TouchableOpacity>
          </View>
        </Image>
      </KeyboardAwareScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreactAccount)
