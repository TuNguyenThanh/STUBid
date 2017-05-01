import React from 'react'
import { View, Text, Picker, Image, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { connect } from 'react-redux'
import SettingsActions from '../Redux/SettingsRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../Components/Header'
import Modal from '../Components/Modal'

// Styles
import styles from './Styles/SettingsScreenStyle'
import { Colors, Images } from '../Themes/'

//I18n
import I18n from 'react-native-i18n'

class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      switchIsOn: true,
      openLanguage: false,
      user: null
    };
  }

  render() {
    const { language } = this.props;
    return(
      <View style={styles.container}>
        <Header
          title={I18n.t('profile', { locale: language })}
          bgColor={'#FFF'}
          titleStyle={styles.titleStyle}
        />
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
          {
            this.state.user &&
            this.renderAvatarUser()
          }

          {
            !this.state.user &&
            this.renderNotUser()
          }

          <View style={{ flex: 1}}>
            {
              /*User setting*/
              this.state.user &&
              this.renderSettingUser()
            }
            {/*App setting*/}
            <View style={styles.session}>
              <Text style={styles.titleSession}>{I18n.t('setting', { locale: language }).toUpperCase()}</Text>
            </View>
            <View style={styles.group}>
              <TouchableOpacity style={styles.row} onPress={() => this.setState({openLanguage: true})} >
                <Text style={styles.titleRow}>{I18n.t('language', { locale: language })}</Text>
                <Text style={{color: 'gray'}}>
                  {
                    language == 'vi' ?
                    I18n.t('vi', { locale: language }) :
                    I18n.t('en', { locale: language })
                  }
                </Text>
              </TouchableOpacity>
              <View style={styles.line} />
              <View style={styles.row}>
                <Text style={styles.titleRow}>{I18n.t('notification', { locale: language })}</Text>
                <Switch
                  value={this.state.switchIsOn}
                  onValueChange={(value) => this.setState({switchIsOn: value})}
                />
              </View>
            </View>


            {/*About*/}
            <View style={styles.session}>
              <Text style={styles.titleSession}>{I18n.t('about', { locale: language }).toUpperCase()}</Text>
            </View>
            <View style={styles.group}>
              <TouchableOpacity style={styles.row}>
                <Text style={styles.titleRow}>{I18n.t('about', { locale: language })}</Text>
                <Icon name="angle-right" size={25} color={'lightgray'} />
              </TouchableOpacity>
              <View style={styles.line} />
              <TouchableOpacity style={styles.row}>
                <Text style={styles.titleRow}>{I18n.t('version', { locale: language })}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{marginRight: 10, color: 'gray'}}>1.0.1</Text>
                  <Icon name="angle-right" size={25} color={'lightgray'} />
                </View>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
        {this.renderModelChangeLanguage()}
      </View>
    );
  }

  renderAvatarUser() {
    return(
      <View style={styles.viewAvatar}>
        <View style={{ flexDirection: 'row'}}>
          <Image
            style={styles.imgStyle}
            source={Images.left}
            resizeMode="contain"
          />
          <Image
            source={{uri: 'http://znews-photo.d.za.zdn.vn/w1024/Uploaded/neg_rtlzofn/2017_01_23/14494601_177404746951l3484_2482115257403382069_n.jpg'}}
            style={styles.imgAvatar}
          />
          <Image
            style={styles.imgStyle}
            source={Images.right}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.titleUser}>Nguyễn Thanh Tú</Text>
      </View>
    );
  }

  renderNotUser() {
    const { language } = this.props;
    return(
      <View style={{ marginTop: 20}}>
        <View style={styles.session}>
          <Text style={styles.titleSession}>{I18n.t('user', { locale: language }).toUpperCase()}</Text>
        </View>
        <View style={styles.group}>
          <TouchableOpacity style={styles.row} onPress={() => NavigationActions.loginScreen()}>
            <Text style={styles.titleRow}>{I18n.t('login', { locale: language })}</Text>
            <Icon name="angle-right" size={25} color={'lightgray'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderSettingUser() {
    const { language } = this.props;
    return(
      <View>
        <View style={styles.session}>
          <Text style={styles.titleSession}>{I18n.t('user', { locale: language }).toUpperCase()}</Text>
        </View>
        <View style={styles.group}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.titleRow}>{I18n.t('editUser', { locale: language })}</Text>
            <Icon name="angle-right" size={25} color={'lightgray'} />
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.titleRow}>{I18n.t('changePass', { locale: language })}</Text>
            <Icon name="angle-right" size={25} color={'lightgray'} />
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.titleRow}>{I18n.t('logOut', { locale: language })}</Text>
            <Icon name="angle-right" size={25} color={'lightgray'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  changeLanguage(newLang) {
    this.props.changeLanguage(newLang);
    this.setState({
      openLanguage: false
    });
  }

  renderModelChangeLanguage() {
    const { language } = this.props;
    return(
      <Modal
        open={this.state.openLanguage}
        offset={0}
        overlayBackground={'rgba(0, 0, 0, 0.75)'}
        animationDuration={200}
        animationTension={40}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={() => this.setState({openLanguage: false})}
        closeOnTouchOutside={true}
        containerStyle={{
          justifyContent: 'center',
        }}
        modalStyle={{
          borderRadius: 2,
          margin: 20,
          padding: 10,
          backgroundColor: '#F5F5F5',
          alignItems: 'center'
        }}>
          <Text style={styles.titleLang}>{I18n.t('changeLanguage', { locale: language })}</Text>
          <View style={styles.viewChooseLanguage}>
            <TouchableOpacity style={styles.button} onPress={() => this.changeLanguage('vi')}>
              <Image
                style={styles.iconLang}
                source={Images.iconVN}
              />
              <Text style={styles.titleButton}>Vi</Text>
            </TouchableOpacity>

            <View style={{ width: 10, height: 10}} />
            <TouchableOpacity style={styles.button} onPress={() => this.changeLanguage('en')}>
              <Image
                style={styles.iconLang}
                source={Images.iconEN}
              />
              <Text style={styles.titleButton}>EN</Text>
            </TouchableOpacity>
          </View>
      </Modal>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguage: (newLang) => dispatch(SettingsActions.changeLanguage(newLang)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
