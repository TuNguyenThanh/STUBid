import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics, Normalize } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    marginTop: Metrics.navBarHeight,
    paddingTop: 10,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight - Metrics.navBarHeight,
  },
  content: {
    flex: 1
  },
  button: {
    height: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: '#FFF',
    fontFamily: Fonts.type.quicksand,
    fontSize: Normalize(21)
  },
  viewNote: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20
  },
  textNote: {
    fontSize: 18,
    fontFamily: Fonts.type.quicksand,
    color: '#F00',
    fontWeight: 'bold'
  },
  textFontStyle: {
    fontFamily: Fonts.type.quicksand,
  }
})
