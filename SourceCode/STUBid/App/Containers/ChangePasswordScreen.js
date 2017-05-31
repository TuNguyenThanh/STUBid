import React from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, Alert} from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'

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

            {/*button-send*/}
    				<TouchableOpacity style={styles.button} onPress={() => this.handleSend()}>
    					<Text style={styles.buttonText}>{I18n.t('changePass', {locale: language})}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
