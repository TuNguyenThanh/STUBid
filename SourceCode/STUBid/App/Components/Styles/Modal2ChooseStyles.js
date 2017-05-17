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
  titleModal: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
    fontSize: 18,
    marginTop: -15,
    marginBottom: 10
  },
  viewBody: {
    height: 50,
    flexDirection: 'row'
  },
  buttonModal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 2
  },
  textButtonModal: {
    color: '#FFF',
    fontFamily: Fonts.type.quicksand,
    marginLeft: 8
  },
  iconChooseImageStyle: {
    marginTop: -20,
    marginLeft: 50,
    zIndex: 1
  },
})
