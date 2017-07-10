import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    height: Metrics.screenHeight - Metrics.navBarHeight,
    width: Metrics.screenWidth,
    marginBottom: 60,
    backgroundColor: Colors.lightgray,
  },
  viewWrap: {
    height: Metrics.screenHeight / 2,
    width: Metrics.screenWidth
  },
  viewHeaderTitleStyle: {
    marginLeft: 10,
    paddingLeft: 10,
    height: 40,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary
  },
  listviewStyle: {
    flex: 1,
    paddingTop: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  row: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    flexDirection: 'row',
    marginBottom: 15,
    height: Metrics.screenHeight / 5,
  },
  imgStyle: {
    flex: 1,
    margin: 8
  },
  imgStyle2: {
    flex: 1,
    height: (Metrics.screenHeight / 5) - 16,
    margin: 8
  },
  viewLoading: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewDetail: {
    flex: 1,
    padding: 8,
  },
  titleProduct: {
    height: Metrics.screenHeight / 14,
    textAlign: 'justify',
    fontFamily: Fonts.type.quicksand,
    marginTop: -8
  },
  viewTemp: {
    flexDirection: 'row',
    marginTop:  Metrics.screenHeight / 120,
  },
  iconStyle: {
    width: 20,
  },
  titlePriceNow: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
    marginTop: -3
  },
  titleTime: {
    color: 'red',
    fontFamily: Fonts.type.quicksand,
    marginTop: -3
  },
  titlePriceNext: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
  },
  titleHeaderStyle: {
    fontSize: 15,
    color: '#F00',
    fontFamily: Fonts.type.quicksand,
  },
})
