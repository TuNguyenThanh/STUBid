import { StyleSheet, Dimensions } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'
const { width, height } = Dimensions.get('window');

const marginSuperView = 100;

export default StyleSheet.create({
  containerStyle: {
    justifyContent: 'center'
  },
  modalStyle: {
    borderRadius: 2,
    margin: 20,
    padding: 10,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  viewModalImage: {
    height: 70,
    flexDirection: 'row'
  },
  viewImage: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBorderImage: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 43
  },
  imgModal: {
    width: 70,
    height: 70,
    borderRadius: 70/2,
  },
  viewBehindImage: {
    backgroundColor: '#FFF',
    height: 40,
    width: width - marginSuperView,
    marginTop: -40,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    zIndex: -35,
  },
  bodyModal: {
    backgroundColor: '#FFF',
    width: width - marginSuperView,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  viewTitleStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  descriptionStyle: {
    textAlign: 'center'
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F00',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20,
    borderRadius: 5
  },
  textButtonStyle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
  }




})
