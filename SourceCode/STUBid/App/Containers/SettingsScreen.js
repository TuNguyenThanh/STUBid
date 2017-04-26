import React from 'react'
import { View, Text, Picker } from 'react-native'
import { connect } from 'react-redux'
import SettingsActions from '../Redux/SettingsRedux'
import I18n from 'react-native-i18n'

// Styles
import styles from './Styles/SettingsScreenStyle'

class Settings extends React.Component {

  render() {
    const { language } = this.props;
    const languageOptions = Object.keys(I18n.translations).map((lang, i) => {
      return (
        <Picker.Item key={i} label={lang} value={lang} />
      )
    });

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          {I18n.t('login', { locale: language })}
        </Text>
        <Picker
          style={styles.picker}
          selectedValue={language}
          onValueChange={(lang) => this.changeLanguage(lang)}
        >
          {languageOptions}
        </Picker>
      </View>
    )
  }

  changeLanguage(newLang) {
    //console.log(newLang);
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
