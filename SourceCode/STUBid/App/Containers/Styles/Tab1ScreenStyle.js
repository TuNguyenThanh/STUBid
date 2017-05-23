import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray,
  },
  fontStyle: {
    fontFamily: Fonts.type.quicksand,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightgray'
  },
  image: {
    width: Metrics.screenWidth,
    flex: 1
  },
  viewDetail: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  item: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  itemCenter: {
    //flex: 1,
    height: 40,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemRight: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  viewCountDown: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  viewNextPrice: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray'
  },
  iconLeft: {
    marginLeft: 10,
  },
  iconRight: {
    marginRight: 10,
  },
  priceBidStyle: {
    color: '#F00',
    fontWeight: 'bold',
    fontSize: 15,
  }
})
