import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  wrapTabIcon: {
    alignItems: 'center'
  },
  titleTabIcon: {
    color: '#000',
    fontFamily: Fonts.type.quicksand
  },
  lineTabIcon: {
    backgroundColor: Colors.primary,
    width: 70,
    height: 5,
    borderRadius: 5,
    marginTop: 5
  },
})
