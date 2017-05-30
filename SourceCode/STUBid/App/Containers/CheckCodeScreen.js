import React from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'
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
      code: '',
    };
  }

  handleGetCode() {
    alert('get new code')
  }

  handleSendCode(code) {
    if(code == '') {
      this.message('Vui long nhap code')
    } else {
      if(code.length != 6) {
        this.message('Code khong hop le')
      } else {
        alert(code);
        NavigationActions.loginScreen({ type: 'reset', screen: 'CHECK_CODE' });
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
                onSubmitEditing={() => this.handleSendCode(this.state.code)}
              />
            </View>

            <View style={styles.viewGetCode}>
              <TouchableOpacity onPress={() => this.handleGetCode()}>
                <Text style={styles.title}>{I18n.t('getCode', {locale: language})}</Text>
              </TouchableOpacity>
            </View>

            {/*button-confirm*/}
            <TouchableOpacity style={styles.button} onPress={() => this.handleSendCode(this.state.code)}>
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckCode)
