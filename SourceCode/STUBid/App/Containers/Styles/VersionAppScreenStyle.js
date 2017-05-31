import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textUpdate: {
    margin: 40,
    textAlign: 'center'
  },
  buttonUpdate: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: Fonts.type.quicksand,
    fontWeight: '600'
  },
})
