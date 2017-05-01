import React from 'react'
import { View, Text, Picker, Image, TouchableOpacity, ScrollView, Switch } from 'react-native'
import { connect } from 'react-redux'
import SettingsActions from '../Redux/SettingsRedux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../Components/Header'

// Styles
import styles from './Styles/SettingsScreenStyle'
import { Colors } from '../Themes/'

//I18n
import I18n from 'react-native-i18n'

class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      switchIsOn: true
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
          <View style={styles.viewAvatar}>
            <Image
              source={{uri: 'http://znews-photo.d.za.zdn.vn/w1024/Uploaded/neg_rtlzofn/2017_01_23/14494601_177404746951l3484_2482115257403382069_n.jpg'}}
              style={styles.imgAvatar}
            />
            <Text style={styles.titleUser}>Nguyễn Thanh Tú</Text>
          </View>

          <View style={{ flex: 1}}>
            {/*User setting*/}
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
            </View>

            {/*App setting*/}
            <View style={styles.session}>
              <Text style={styles.titleSession}>{I18n.t('setting', { locale: language }).toUpperCase()}</Text>
            </View>
            <View style={styles.group}>
              <TouchableOpacity style={styles.row}>
                <Text style={styles.titleRow}>{I18n.t('language', { locale: language })}</Text>
                <Text style={{color: 'gray'}}>Viet nam</Text>
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
              <Text style={styles.titleSession}>{I18n.t('profile', { locale: language }).toUpperCase()}</Text>
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

      </View>
    );
  }

  changeLanguage(newLang) {
    this.props.changeLanguage(newLang);
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

// render() {
//   const { language } = this.props;
//   const languageOptions = Object.keys(I18n.translations).map((lang, i) => {
//     return (
//       <Picker.Item key={i} label={lang} value={lang} />
//     )
//   });
//
//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>
//         {I18n.t('login', { locale: language })}
//       </Text>
//       <Picker
//         style={styles.picker}
//         selectedValue={language}
//         onValueChange={(lang) => this.changeLanguage(lang)}
//       >
//         {languageOptions}
//       </Picker>
//     </View>
//   )
// }
