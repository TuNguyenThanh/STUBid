import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { Colors, Fonts } from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome'

//Styles
import styles from './Styles/TabIconStyles'

//I18n
import I18n from 'react-native-i18n'

class TabIcon extends Component {
  returnNameIcon(sceneKey) {
    switch (sceneKey) {
      case 'tab1':
        return 'home';
      case 'tab2':
        return 'search';
      case 'tab3':
        return 'legal';
      case 'tab4':
        return 'user-md';
      default:
        return 'home';
    }
  }

  render() {
    const color = this.props.selected ? Colors.primary :'black';
    const { title, sceneKey, language } = this.props;
    const nameIcon = this.returnNameIcon(sceneKey);

    return (
      <View style={styles.wrapTabIcon}>
        <Icon name={nameIcon} size={25} color={color} />
        <Text style={[styles.titleTabIcon, {color}]}>{I18n.t(title, {locale: language})}</Text>
        {
          this.props.selected && <View style={styles.lineTabIcon} />
        }
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(TabIcon)
