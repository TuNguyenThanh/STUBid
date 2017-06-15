import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  wrapButton: {
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
  viewButton: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleStyle: {
    fontFamily: Fonts.type.quicksand,
    color: Colors.primary
  },
  itemStyle: {
    fontFamily: Fonts.type.quicksand,
  },
  viewIcon: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
