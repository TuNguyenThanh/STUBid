import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    paddingTop:  Metrics.navBarHeight
  },
  viewBid: {
    height: 50,
    backgroundColor: Colors.primary,
    flexDirection: 'row'
  },
  titleButton: {
    color: '#FFF',
    fontFamily: Fonts.type.quicksand,
    fontSize: 21
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  line: {
    width:1,
    backgroundColor: '#FFF'
  },
  fontStyle: {
    fontFamily: Fonts.type.quicksand,
  },
  viewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
