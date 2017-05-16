import React from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import MapView from 'react-native-maps'

// Styles
import styles from './Styles/InfoAppScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class InfoApp extends React.Component {

  render() {
    const region =  {
      latitude: 10.738294,
      longitude: 106.677950,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    return (
      <View style={styles.container}>
        <View style={styles.viewLogo}>
          <Image style={styles.logo} source={Images.logo} resizeMode="contain" />
        </View>
        <View style={styles.viewBody}>
          <View style={{ padding: 8 }}>
            <Text>If you really liked Ignite 1 as it was, then not much has changed! You just run ignite new MyApp --max and everything feels pretty normal from there.</Text>
          </View>
          <MapView style={{flex: 1}} region={region} mapType="standard">
            <MapView.Marker
              coordinate={region}
              title={'STUBid'}
              description={'Auction Online'}
            />
          </MapView>
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
