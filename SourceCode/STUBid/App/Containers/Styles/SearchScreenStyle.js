import { StyleSheet, Platform } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  content: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    paddingLeft: 15,
    paddingRight: 15
  },
  headerStyle: {
    alignItems: 'center',
    ...Platform.select({
      android: {
        paddingTop: 0
      },
      ios: {
        paddingTop: 20
      }
    }),
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    flexDirection: 'row',
  },
  centerHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: Fonts.type.quicksand,
    color: Colors.primary
  },
  viewSearch: {
    backgroundColor: '#FFF',
    height: 40,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12
  },
  inputStyle: {
    flex: 1,
    fontFamily: Fonts.type.quicksand,
    color: Colors.primary
  },
  listviewStyle: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  row: {
  //  borderRadius: 2,
  //  shadowRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    flexDirection: 'row',
    marginBottom: 15,
    height: Metrics.screenHeight / 5,
  },
  viewDetail: {
    flex: 1,
    padding: 8
  },
  viewTemp: {
    flexDirection: 'row'
  },
  viewIcon: {
    width: 20
  },
  viewPriceBid: {
    borderColor: '#D8D8D8',
    borderWidth: 1,
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 3,
    marginTop: -3
  },
  titleProduct: {
    height: 40,
    textAlign: 'justify',
    fontFamily: Fonts.type.quicksand,
    marginTop: -3
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
  }

})
