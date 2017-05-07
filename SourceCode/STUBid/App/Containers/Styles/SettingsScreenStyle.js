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
  imgStyle: {
    width: 80,
    height: 120
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#D8D8D8',
    borderBottomColor: '#D8D8D8',
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
  viewChooseLanguage: {
    height: 30,
    flexDirection: 'row',
    marginTop: 20
  },
  titleLang: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
    fontSize: 18
  },
  button: {
    flex: 1,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  titleButton: {
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand,
  },
  iconLang: {
    width: 20,
    height: 20,
    marginRight: 8
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
      backgroundColor: '#FFF'
    }
})
