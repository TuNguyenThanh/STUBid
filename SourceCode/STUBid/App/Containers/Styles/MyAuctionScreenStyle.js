import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray
  },
  titleStyle: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 20
  },
  contentEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonStyle: {
    marginTop: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5
  },
  buttonTextStyle: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand
  }
})
