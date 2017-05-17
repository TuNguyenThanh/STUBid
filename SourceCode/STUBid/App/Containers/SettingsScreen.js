import React from 'react'
import { View, Text, Picker, Image, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { connect } from 'react-redux'
import SettingsActions from '../Redux/SettingsRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../Components/Header'
import Modal2Choose from '../Components/Modal2Choose'

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
      user: 'user'
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
                <Text style={styles.titleLangStyle}>
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
              <TouchableOpacity style={styles.row} onPress={() => NavigationActions.infoAppScreen({ title: I18n.t('about', { locale: language }) })}>
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
          <TouchableOpacity style={styles.row} onPress={() => NavigationActions.editProfileScreen({title: I18n.t('editUser', { locale: language })} )}>
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
    return (
      <Modal2Choose
        logo={<Icon name="globe" size={30} color={Colors.primary} />}
        title={'changeLanguage'}
        titleA={'vi'}
        iconA={
          <Image
            source={Images.iconVN}
            style={styles.iconLang}
          />
        }
        titleB={'en'}
        iconB={
          <Image
            source={Images.iconEN}
            style={styles.iconLang}
          />
        }
        open={this.state.openLanguage}
        modalDidClose={() => this.setState({ openLanguage: false })}
        onPressA={() => this.changeLanguage('vi')}
        onPressB={() => this.changeLanguage('en')}
      />
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
    changeLanguage: (newLang) => dispatch(SettingsActions.changeLanguage(newLang)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
