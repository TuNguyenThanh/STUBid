import React from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/InfoAppScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class InfoApp extends React.Component {

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.viewLogo}>
          <Image style={styles.logo} source={Images.logo} resizeMode="contain" />
        </View>
        <View style={styles.viewBody}>
          <View style={{ padding: 8 }}>
            <Text>If you really liked Ignite 1 as it was, then not much has changed! You just run ignite new MyApp --max and everything feels pretty normal from there.</Text>
          </View>
          <View style={{flex: 1, backgroundColor: 'yellow', marginTop: 8}}>

          </View>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(InfoApp)
