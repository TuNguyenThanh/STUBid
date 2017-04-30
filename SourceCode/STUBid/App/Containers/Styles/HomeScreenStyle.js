import { StyleSheet, Platform } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

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
  iconStyle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: Fonts.type.quicksand,
    color: Colors.primary
  },
  viewCategory: {
    height: 40,
    backgroundColor: '#FFF',
    margin: 15,
    marginTop: 15,
    marginBottom: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8,
    borderColor: '#D2D0D0',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 3
  },
  textCategory: {
    color: '#646464'
  },
  listView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    width: ((Metrics.screenWidth / 2) - 15),
  //  borderRadius: 2,
    borderColor: '#D8D8D8',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 5,
    backgroundColor: '#FFFFFF'
  },
  viewItem: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageProduct: {
    width: ((Metrics.screenWidth / 2) - 15) - 10,
    height: ((Metrics.screenWidth / 2) - 15) - 10
  },

  textProduct: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4
  },

  textPriceNow: {
    color: 'red',
    fontWeight: '700',
  },

  bid: {
    borderColor: '#D8D8D8',
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 4,
    borderRadius: 2
  },

  icon: {
    width: 16,
    height: 16,
    marginRight: 4
  },

  textAuction: {
    color: 'white'
  },

  bodyStyles: {
    flex: 1,
    backgroundColor: '#EBEBEB',
    justifyContent: 'center',
    alignItems: 'center'
  },

  textLoadStyles: {
    marginTop: -20,
    color: '#646464'
  },

  btnAuction: {
    backgroundColor: '#EF5E92',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 2
  },
  // viewChoose: {
  //   height: 50,
  //   flexDirection: 'row'
  // },
  // button: {
  //   flex: 1,
  //   margin: 8,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: 'gray',
  //   borderRadius: 5
  // },
  // line: {
  //   width: 1,
  //   backgroundColor: 'gray',
  //   marginTop: 8,
  //   marginBottom: 8
  // }
})
