import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Themes'

export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
  },
  form: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 100
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
    position: 'relative'
  },
  inputStyle: {
    height: 50,
    width: Metrics.screenWidth - 40,
    paddingLeft: 8,
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
    marginBottom: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 18
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
	},
  footer: {
    marginTop: -40,
    zIndex: -10,
  },
  title: {
    textAlign: 'center',
    color: Colors.text
  },
  createAccount: {
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.primary,
  },
})
