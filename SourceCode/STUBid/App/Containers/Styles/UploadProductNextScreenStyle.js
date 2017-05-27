import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics, Normalize } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray,
    marginTop: Metrics.navBarHeight,
    paddingTop: 10,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight - Metrics.navBarHeight,
  },
  content: {
    flex: 1
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
  viewImage: {
    height: Metrics.screenHeight / 3,
    backgroundColor: '#FFF',
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
    position: 'relative',
    borderRadius: 2,
  },
  titleStyle: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
  },
  viewIconImage: {
    flex: 1,
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
  titleModalCategory: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
    fontSize: 18,
    marginTop: -15,
    marginBottom: 10
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
  imgStyle: {
    width: (Metrics.screenWidth * 1.8) / 3,
    height: 160,
    resizeMode: 'contain',
    marginLeft: 10
  },
  contentContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollViewStyle: {
    flex: 1
  },
})
