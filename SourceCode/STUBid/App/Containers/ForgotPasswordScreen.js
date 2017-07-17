import React from 'react'
import { ScrollView, Text, View, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import AccountActions from '../Redux/AccountRedux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/ForgotPasswordScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
    this.isForgotPassword = false;
  }

  componentWillReceiveProps(nextProps){
    const { language } = this.props;
    const { error, fetching, forgotPasswordSuccess } = nextProps.account;

    if(!fetching && forgotPasswordSuccess && this.isForgotPassword) {
      Alert.alert(
        I18n.t('success', {locale: this.props.language}),
        I18n.t('pleaseCheckEmail', {locale: this.props.language}) + ' ' + this.state.email,
        [
          {text: I18n.t('ok', {locale: this.props.language}), onPress: () => {
            NavigationActions.pop();
          }},
        ],
        { cancelable: false }
      );
      this.isForgotPassword = false;
    }

    //error
    if(!fetching && error) {
      Alert.alert(
        I18n.t('error', {locale: language}),
        I18n.t(error, {locale: language}),
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
    }
  }

  handleSendForgotPassword(email) {
    const { language } = this.props;
    if (!this.validateEmail(email)) {
      //email not invalid
      Alert.alert(
        I18n.t('emailAddressNotValid', {locale: language}),
        I18n.t('pleaseEnterEmailAgain', {locale: language}),
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
    } else {
      this.props.forgotPassword(email);
      this.isForgotPassword = true;
    }
  }

  validateEmail(email) {
    const check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return check.test(email);
  }

  render () {
    const { language } = this.props;
    return (
      <KeyboardAwareScrollView scrollEnabled={false} resetScrollToCoords={{ x: 0, y: 0 }} >
        <Image style={styles.container} source={Images.background} >
          <TouchableOpacity style={styles.backButton} onPress={() => NavigationActions.pop()}>
            <Icon name="chevron-circle-left" size={35} color={Colors.primary}  />
          </TouchableOpacity>
          {/*Form forgotPassword*/}
          <View style={styles.form}>
            {/*logo*/}
            <Image style={styles.logo} source={Images.logo} resizeMode="contain" />
            <Text style={styles.textForm}>{I18n.t('forgotPassword', {locale: language})}</Text>

            {/*input-logo*/}
            <View style={styles.viewInput}>
              <TextInput
                style={styles.inputStyle}
                placeholder={'Email'}
                placeholderTextColor="#989899"
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='go'
                keyboardType={'email-address'}
                value={this.state.email}
                onChangeText={(email) => this.setState({ email })}
                onSubmitEditing={() => this.handleSendForgotPassword(this.state.email)}
              />
            </View>

            {
              /*button-send*/
              this.renderButtonForgotPassword()
            }
          </View>
        </Image>
      </KeyboardAwareScrollView>

    )
  }

  renderButtonForgotPassword() {
    const { language } = this.props;
    if (!this.props.account.fetching) {
      return (
        <TouchableOpacity style={styles.button} onPress={() => this.handleSendForgotPassword(this.state.email)}>
          <Text style={styles.buttonText}>{I18n.t('sendPassword', {locale: language})}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.button} onPress={() => this.handleSendForgotPassword(this.state.email)}>
        <ActivityIndicator animating={this.props.account.fetching} color='white' />
      </TouchableOpacity>
    );
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
    forgotPassword: (email) => dispatch(AccountActions.forgotPasswordRequest(email)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
