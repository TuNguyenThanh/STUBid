import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics, Normalize } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    marginTop: Metrics.navBarHeight,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight - Metrics.navBarHeight,
  },
  viewImage: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  viewImageCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgStyle: {
    width: Metrics.screenHeight / 5,
    height: Metrics.screenHeight / 5,
    borderRadius: (Metrics.screenHeight / 5)/2,
    zIndex: 0
  },
  rowInput: {
    height: 40,
    flexDirection: 'row'
  },
  viewNameInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textNameInput: {
    fontFamily: Fonts.type.quicksand,
  },
  viewInput: {
    flex: 3
  },
  textinputStyle: {
    flex: 1,
    fontFamily: Fonts.type.quicksand,
  },
  lineStyle: {
    height: 1,
    backgroundColor: 'gray'
  },
  button: {
    height: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: '#FFF',
    fontFamily: Fonts.type.quicksand,
    fontSize: Normalize(21)
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
