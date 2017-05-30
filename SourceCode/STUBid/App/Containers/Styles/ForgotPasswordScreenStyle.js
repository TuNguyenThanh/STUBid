import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes'

export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    flex: 1,
  },
  form: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 100,
    marginTop: -100
  },
  backButton: {
    width: 30,
    marginTop: 30,
    marginLeft: 10
  },
  textForm: {
    fontSize: 25,
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 20,
    fontFamily: Fonts.type.quicksand
  },
  viewInput: {
    width: Metrics.screenWidth - 40,
    borderRadius: Metrics.borderRadius,
    paddingTop: Metrics.borderRadius,
    paddingBottom: Metrics.borderRadius,
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
    backgroundColor: '#FFF'
  },
  inputStyle: {
    height: 50,
    width: Metrics.screenWidth - 40,
    paddingLeft: 8,
    fontFamily: Fonts.type.quicksand
  },
  button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.primary,
    width: Metrics.screenWidth - 40,
	  height: 50,
		borderRadius: 25,
    marginTop: 30
	},
  buttonText: {
		color: 'white',
    fontSize: 18,
		backgroundColor: 'transparent',
    fontFamily: Fonts.type.quicksand
	},
})
