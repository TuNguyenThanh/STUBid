import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    marginTop: Metrics.navBarHeight,
    paddingBottom: 50,
  },
  viewLogo: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 200,
    height: 100,
  },
  viewBody: {
    flex: 1
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Fonts.type.quicksand
  }
})
