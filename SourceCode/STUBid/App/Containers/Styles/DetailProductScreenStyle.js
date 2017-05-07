import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    paddingTop:  Metrics.navBarHeight
  },
  button: {
    height: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleButton: {
    color: '#FFF',
    fontFamily: Fonts.type.quicksand,
    fontSize: 21
  }
})
