import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

const marginSuperView = 100;

export default StyleSheet.create({
  containerStyle: {
    justifyContent: 'center'
  },
  modalStyle: {
    borderRadius: 2,
    margin: 10,
    padding: 10,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  viewIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
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
    height: 40,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row'
  },
  buttonModal: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 5
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
    width: Metrics.screenWidth - marginSuperView,
    marginTop: -40,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    zIndex: -35,
  },
  bodyModal: {
    backgroundColor: '#FFF',
    width: Metrics.screenWidth - marginSuperView,
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
  itemBody: {
    flex :2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemBody1: {
    flex :1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBidStyle: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  viewBorderBidPrice: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primary
  },
  titleDetailStyle: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  titlePriceStyle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#F00',
    fontSize: 18,
  }
})
