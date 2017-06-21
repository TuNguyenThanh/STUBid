import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  containerStyle: {
    justifyContent: 'center'
  },
  modalStyle: {
    borderRadius: 2,
    margin: 20,
    padding: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center'
  },
  viewIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleModalCategory: {
    textAlign: 'center',
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
    fontSize: 18,
    marginTop: -15,
    marginBottom: 10
  },
  titleItemStyle: {
    fontFamily: Fonts.type.quicksand,
  },
  listViewCategory: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowCategory: {
    width: (Metrics.screenWidth / 2.6),
    borderRadius: 2,
    borderColor: '#D8D8D8',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 5,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginLeft: 2,
    marginRight: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
})
