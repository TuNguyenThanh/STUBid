import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  wrapInput: {
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 8,
    backgroundColor: '#FFF',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
    position: 'relative',
    borderRadius: 2,
  },
  viewInput: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  titleStyle: {
    fontFamily: Fonts.type.quicksand,
    color: Colors.primary
  },
  inputStyle: {
    flex: 1,
    fontFamily: Fonts.type.quicksand,
  },
  textStyle: {
    fontFamily: Fonts.type.quicksand,
    color: Colors.primary,
    fontSize: 18
  }
})
