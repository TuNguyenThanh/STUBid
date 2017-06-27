import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Metrics.navBarHeight,
    backgroundColor: Colors.lightgray,
  },
  textStyle: {
    fontFamily: Fonts.type.quicksand,
  },
  textTitleStyle: {
    fontFamily: Fonts.type.quicksand,
    color: Colors.primary
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightgray'
  },
  image: {
    width: Metrics.screenWidth,
    flex: 1
  },
  viewDetail: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  rowItem: {
    flex: 1,
    flexDirection: 'row'
  },

})
