import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Alert, AsyncStorage, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AccountActions from '../Redux/AccountRedux'
import LoginActions from '../Redux/LoginRedux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'
import md5 from 'blueimp-md5'

// KEY CONFIG - AsyncStorage
import AppConfig from '../Config/AppConfig'

// Styles
import styles from './Styles/ChangePasswordScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      reNewPassword: '',
    };
    this.isChangePassword = false;
  }

  componentWillReceiveProps(nextProps) {
    const { language } = this.props;
    const { fetching, error, changePasswordSuccess } = nextProps.account;
    const { user } = nextProps.login;
    const fetchingLogin = nextProps.login.fetching;

    if(!fetching && changePasswordSuccess && this.isChangePassword) {
      Alert.alert(
        'Change Password',
        'Success, please login again',
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {
            this.handleLoginAgain();
          }},
        ],
        { cancelable: false }
      );
      this.isChangePassword = false;
    }

    if(!fetchingLogin && !user) {
      NavigationActions.loginScreen({ screen: 'CHANGE_PASSWORD' })
    }

    //handle error
    if(!fetching && error) {
      Alert.alert(
        'Error',
        error,
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
    }

  }

  handleSend() {
    const { oldPassword, newPassword, reNewPassword } = this.state;
    if(oldPassword == '') {
      this.message('Vui long nhap mat khau cu');
    } else {
      if(newPassword == '') {
        this.message('Vui long nhap mat khau moi');
      } else {
        if(reNewPassword == '') {
          this.message('Vui long nhap lai mat khau moi');
        } else {
          if(oldPassword.length < 6 ) {
            this.message('Mat khau cu it nhat 6 ky tu');
          } else {
            if(newPassword.length < 6 ) {
              this.message('Mat khau moi it nhat 6 ky tu');
            } else {
              if(reNewPassword.length < 6 ) {
                this.message('Mat khau moi nhap lai it nhat 6 ky tu');
              } else {
                if(oldPassword.length > 18 ) {
                  this.message('Mat khau cu toi da 18 ky tu');
                } else {
                  if(newPassword.length > 18 ) {
                    this.message('Mat khau moi toi da 18 ky tu');
                  } else {
                    if(reNewPassword.length > 18 ) {
                      this.message('Mat khau moi nhap lai toi da 18 ky tu');
                    } else {
                      if(newPassword != reNewPassword) {
                        this.message('Mat khau moi va nhap lai mat khau moi phai giong nhau');
                      } else {
                          //oke send
                        const token = this.props.login.user.token;
                        this.props.changePassword(token, md5(oldPassword), md5(newPassword));
                        this.isChangePassword = true;
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

  handleLoginAgain() {
    this.props.logout();
    this.removeToken();
  }

  async removeToken() {
    try {
      await AsyncStorage.removeItem(AppConfig.STORAGE_KEY_SAVE_TOKEN);
    } catch (error) {
      cosole.log(error.message);
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

  render () {
    const { language } = this.props;
    return (
      <KeyboardAwareScrollView scrollEnabled={false} resetScrollToCoords={{ x: 0, y: 0 }} >
        <Image style={styles.container} source={Images.background} >
          <TouchableOpacity style={styles.backButton} onPress={() => NavigationActions.pop()}>
            <Icon name="chevron-circle-left" size={35} color={Colors.primary}  />
          </TouchableOpacity>
          {/*Form changePassword*/}
          <View style={styles.form}>
            {/*logo*/}
            <Image style={styles.logo} source={Images.logo} resizeMode="contain" />
            <Text style={styles.textForm}>{I18n.t('changePass', { locale: language })}</Text>

            {/*input-logo*/}
            <View style={styles.viewInput}>
              <TextInput
                style={styles.inputStyle}
                placeholder={I18n.t('oldPassword', {locale: language})}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='next'
                secureTextEntry
                value={this.state.oldPassword}
                onChangeText={(oldPassword) => this.setState({ oldPassword })}
                onSubmitEditing={() => this.newPassword.focus()}
              />
              <View style={styles.line} />
              <TextInput
                ref={(input) => this.newPassword = input}
                style={styles.inputStyle}
                placeholder={I18n.t('newPassword', {locale: language})}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='next'
                secureTextEntry
                value={this.state.newPassword}
                onChangeText={(newPassword) => this.setState({ newPassword })}
                onSubmitEditing={() => this.reNewPassword.focus()}
              />
              <View style={styles.line} />
              <TextInput
                ref={(input) => this.reNewPassword = input}
                style={styles.inputStyle}
                placeholder={I18n.t('repeatNewPassword', {locale: language})}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='go'
                secureTextEntry
                value={this.state.reNewPassword}
                onChangeText={(reNewPassword) => this.setState({ reNewPassword })}
                onSubmitEditing={() => this.handleSend()}
              />
            </View>

            {
              /*button-send*/
              this.renderButtonChangePassword()
            }
          </View>
        </Image>
      </KeyboardAwareScrollView>
    )
  }

  renderButtonChangePassword() {
    const { language } = this.props;
    if (!this.props.account.fetching) {
      return (
        <TouchableOpacity style={styles.button} onPress={() => this.handleSend()}>
          <Text style={styles.buttonText}>{I18n.t('changePass', {locale: language})}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.button}>
        <ActivityIndicator animating={this.props.account.fetching} color='white' />
      </TouchableOpacity>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    account: state.account,
    login: state.login,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(LoginActions.logout()),
    changePassword: (token, oldPassword, newPassword) => dispatch(AccountActions.changePasswordRequest(token, oldPassword, newPassword)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
