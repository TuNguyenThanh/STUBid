import React from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'
import AccountActions from '../Redux/AccountRedux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/CheckCodeScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class CheckCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '123456',
    };
    this.isCheckCode = false;
    this.isGetCode = false;
  }

  handleGetCode() {
    Alert.alert(
      '',
      I18n.t('getCode', {locale: this.props.language}),
      [
        {text: I18n.t('ok', {locale: this.props.language}), onPress: () => {
          const { email, username, phoneNumber } = this.props.dataRegister;
          this.props.getCode(email, username, phoneNumber);
          this.isGetCode = true;
        }},
        {text: I18n.t('cancel', {locale: this.props.language}), onPress: () => {}},
      ],
      { cancelable: false }
    );
  }

  handleSendCode() {
    const { code } = this.state;
    if(code == '') {
      this.message('Vui long nhap code')
    } else {
      if(code.length != 6) {
        this.message('Code khong hop le')
      } else {
        const { email, username, phoneNumber } = this.props.dataRegister;
        this.props.checkCode(code, email, username, phoneNumber);
        this.isCheckCode = true;
      }
    }
  }

  componentWillReceiveProps(nextProps){
    const { codeSuccess, error, fetching, newCode } = nextProps.account;

    if(!fetching && codeSuccess && this.isCheckCode) {
      Alert.alert(
        I18n.t('getCode', {locale: this.props.language}),
        'Success, please check sms !',
        [
          {text: 'OK', onPress: () => {}},
        ],
        { cancelable: false }
      );
      this.isCheckCode = false;
    }

    if(!fetching && newCode && this.isGetCode) {
      Alert.alert(
        'Thong bao',
        'Account Actived',
        [
          {text: 'OK', onPress: () => {
            if(this.props.isPop) {
              NavigationActions.pop();
              setTimeout(() => {
                NavigationActions.pop();
              }, 100);
            }
          }},
        ],
        { cancelable: false }
      );
      this.isCheckCode = false;
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
          {/*Form check code*/}
          <View style={styles.form}>
            {/*title*/}
            <Image style={styles.logo} source={Images.logo} resizeMode="contain" />
            <Text style={styles.textForm}>{I18n.t('verificationCode', {locale: language})}</Text>

            {/*input-logo*/}
            <View style={styles.viewInput}>
              <TextInput
                style={styles.inputStyle}
                placeholder={I18n.t('verificationCode', {locale: language})}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='go'
                value={this.state.code}
                onChangeText={(code) => this.setState({ code })}
                onSubmitEditing={() => this.handleSendCode()}
              />
            </View>

            <View style={styles.viewGetCode}>
              <TouchableOpacity onPress={() => this.handleGetCode()}>
                <Text style={styles.title}>{I18n.t('getCode', {locale: language})}</Text>
              </TouchableOpacity>
            </View>

            {/*button-confirm*/}
            <TouchableOpacity style={styles.button} onPress={() => this.handleSendCode()}>
              <Text style={styles.buttonText}>{I18n.t('confirm', {locale: language})}</Text>
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
    account: state.account,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkCode: (code, email, username, phoneNumber) => dispatch(AccountActions.checkCodeRequest(code, email, username, phoneNumber)),
    getCode: (email, username, phoneNumber) => dispatch(AccountActions.getNewCodeRequest(email, username, phoneNumber)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckCode)
