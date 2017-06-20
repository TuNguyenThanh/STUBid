import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics, Normalize } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    marginTop: Metrics.navBarHeight,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  viewLoading: {
    flex: 1,
    height: Metrics.screenHeight - Metrics.navBarHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  p: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
    textAlign: 'justify'
  },
  h1: {
    fontSize: 23,
    color: '#F00',
    fontFamily: Fonts.type.quicksand,
    textAlign: 'justify'
  },
  h4: {
    fontSize: 16,
    color: '#F00',
    fontFamily: Fonts.type.quicksand,
    textAlign: 'justify'
  },
  i: {
    fontStyle: 'italic',
    textAlign: 'justify',
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand
  },
  b: {
    color: '#F00',
    fontSize: 16,
    fontFamily: Fonts.type.quicksand
  }
})
