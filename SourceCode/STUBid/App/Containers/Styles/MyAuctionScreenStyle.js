import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray
  },
  titleStyle: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand
  },
  contentEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})
