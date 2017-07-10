import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics, Normalize } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Metrics.navBarHeight,
    backgroundColor: Colors.lightgray
  },
  listViewStyle: {
    flex: 1,
    marginTop: 15
  },
  row: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative',
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    padding: 5
  },
  titleStyle: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
    fontSize: Normalize(15)
  },
  notifyStyle: {
    fontFamily: Fonts.type.quicksand,
    fontSize: Normalize(12)
  }
})
