import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import ScrollableTabView from 'react-native-scrollable-tab-view'

import Tab1 from './Tab1Screen'
import Tab2 from './Tab2Screen'

// Styles
import styles from './Styles/DetailProductScreenStyle'
import { Colors } from '../Themes'

class DetailProduct extends React.Component {

  render () {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          style={{ flex: 1 }}
          tabBarBackgroundColor={'#FFF'}
          tabBarUnderlineStyle={{ backgroundColor: Colors.primary, borderRadius: 5 }}
          tabBarActiveTextColor={Colors.primary}
          tabBarInactiveTextColor={'#900'}
        >
          <Tab1 tabLabel="Đấu giá" />
          <Tab2 tabLabel="Chi tiết" />
        </ScrollableTabView>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailProduct)
