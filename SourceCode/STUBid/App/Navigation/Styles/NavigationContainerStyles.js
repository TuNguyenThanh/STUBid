import { Colors, Fonts } from '../../Themes/'

export default {
  container: {
    flex: 1
  },
  navBar: {
    borderBottomColor: '#FFF',
    backgroundColor: '#FFF',
  },
  title: {
    width: 250,
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand
  },
  leftButton: {
    tintColor: Colors.primary
  },
  rightButton: {
    color: Colors.snow
  },
  navBarCustom: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    borderBottomColor: '#FFF',
    backgroundColor: '#FFF',
    tintColor: Colors.primary
  },
}
