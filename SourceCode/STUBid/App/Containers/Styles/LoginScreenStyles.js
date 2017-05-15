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
  line: {
    width: Metrics.screenWidth - 40,
    height: 1,
    marginLeft: -1,
    backgroundColor: 'lightgray'
  },
  viewForgotPass: {
    width: Metrics.screenWidth - 40,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    marginTop: 8,
    marginBottom: 8
  },
  textForm: {
    fontSize: 25,
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 20,
    fontFamily: Fonts.type.quicksand
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: Fonts.type.quicksand
  },
  button: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.primary,
		height: 50,
		borderRadius: 25,
		zIndex: 100,
	},
	circle: {
		height: 50,
		width: 50,
		marginTop: -50,
		borderWidth: 1,
		borderColor: '#F035E0',
		borderRadius: 100,
		alignSelf: 'center',
		zIndex: 99,
		backgroundColor: Colors.primary,
	},
	text: {
		color: 'white',
    fontSize: 18,
		backgroundColor: 'transparent',
    fontFamily: Fonts.type.quicksand
	},
  footer: {
    marginTop: -40,
    zIndex: -10,
  },
  title: {
    textAlign: 'center',
    color: Colors.text,
    fontFamily: Fonts.type.quicksand
  },
  createAccount: {
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.primary,
    fontFamily: Fonts.type.quicksand
  },
  backButton: {
    width: 30,
    marginTop: 30,
    marginLeft: 10
  }
})
