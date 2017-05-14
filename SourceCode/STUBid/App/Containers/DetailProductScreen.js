import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import Tab1 from './Tab1Screen'
import Tab2 from './Tab2Screen'

// Styles
import styles from './Styles/DetailProductScreenStyle'
import { Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class DetailProduct extends React.Component {

  render() {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        <ScrollableTabView
          style={{ flex: 1 }}
          tabBarBackgroundColor={'#FFF'}
          tabBarUnderlineStyle={{ backgroundColor: Colors.primary, borderRadius: 5 }}
          tabBarActiveTextColor={Colors.primary}
          tabBarInactiveTextColor={'#900'}
          tabBarTextStyle={styles.fontStyle}
        >
          <Tab1 tabLabel={I18n.t('auction', {locale: language})} />
          <Tab2 tabLabel={I18n.t('detailProduct', {locale: language})} />
        </ScrollableTabView>
        <View style={styles.viewBid}>
          <TouchableOpacity style={styles.button} onPress={() => alert('Đấu giá')}>
            <Text style={styles.titleButton}>{I18n.t('bid', {locale: language})}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity style={styles.button} onPress={() => alert('Mua ngay')}>
            <Text style={styles.titleButton}>{I18n.t('buyNow', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailProduct)
