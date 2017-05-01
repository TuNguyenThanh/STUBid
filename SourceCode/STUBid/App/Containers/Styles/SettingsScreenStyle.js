import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightgray
  },
  viewAvatar: {
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgAvatar: {
    width: Metrics.screenHeight / 5,
    height: Metrics.screenHeight / 5,
    borderRadius: Metrics.screenHeight / 10
  },
  titleStyle: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand
  },
  titleUser: {
    fontFamily: Fonts.type.quicksand,
    fontSize: 18
  },
  session:{
    height: 30,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center'
  },
  titleSession: {
    color: 'gray',
    fontFamily: Fonts.type.quicksand
  },
  group: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    marginBottom: 20
  },
  row: {
    height: 40,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleRow: {
    fontFamily: Fonts.type.quicksand
  },
  line: {
    backgroundColor: '#D8D8D8',
    height: 1,
    marginLeft: 20
  },
  header: {
    fontSize: 20,
    textAlign: 'left',
    marginVertical: 10,
    marginLeft: 10,
  },
  picker: {
    flex: 1,
    marginRight: 10,
  }
})
