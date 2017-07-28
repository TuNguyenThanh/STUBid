import React, { Component } from 'react'
import { Text, View, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import LoginActions from '../Redux/LoginRedux'
import { Scene, Router } from 'react-native-router-flux'
import NavigationDrawer from './NavigationDrawer'
import NavItems from './NavItems'
import TabIcon from './TabIcon'
import ModalLoading from '../Components/ModalLoading'

//Key config - AsyncStorage
import AppConfig from '../Config/AppConfig'

// screens identified by the router
import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/LoginScreen'
import SettingsScreen from '../Containers/SettingsScreen'
import HomeScreen from '../Containers/HomeScreen'
import SearchScreen from '../Containers/SearchScreen'
import MyAuctionScreen from '../Containers/MyAuctionScreen'
import DetailProductScreen from '../Containers/DetailProductScreen'
import EditProfileScreen from '../Containers/EditProfileScreen'
import InfoAppScreen from '../Containers/InfoAppScreen'
import UploadProductNextScreen from '../Containers/UploadProductNextScreen'
import UploadProductScreen from '../Containers/UploadProductScreen'
import ForgotPasswordScreen from '../Containers/ForgotPasswordScreen'
import CreactAccountScreen from '../Containers/CreactAccountScreen'
import CheckCodeScreen from '../Containers/CheckCodeScreen'
import ChangePasswordScreen from '../Containers/ChangePasswordScreen'
import VersionAppScreen from '../Containers/VersionAppScreen'
import InfoUploadProductScreen from '../Containers/InfoUploadProductScreen'
import MyAuctionNotActiveScreen from '../Containers/MyAuctionNotActiveScreen'
import NotificationScreen from '../Containers/NotificationScreen'

//Styles
import Styles from './Styles/NavigationContainerStyles'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/
class NavigationRouter extends Component {
  componentDidMount() {
    this.isLoginToken = false;
    try {
      AsyncStorage.getItem(AppConfig.STORAGE_KEY_SAVE_TOKEN).then((token) => {
        this.props.loginToken(token);
        this.isLoginToken = true;
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    const { user, fetchingLoginToken } = nextProps.login;
    if(!fetchingLoginToken && user && this.isLoginToken) {
      try {
        AsyncStorage.setItem(AppConfig.STORAGE_KEY_SAVE_TOKEN, user.token);
      } catch (error) {
        // Error saving data
        console.log('Error saving data');
      }
    }
  }

  render () {
    return (
      <Router>
        <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>

          <Scene key="tabbar" tabs={true} tabBarStyle={{backgroundColor: '#FFF', height: 60}} >
            <Scene key="tab1" initial={true} title="home" icon={TabIcon}>
              <Scene key='homeScreen' component={HomeScreen} hideNavBar/>
            </Scene>
            <Scene key="tab2" title="search" icon={TabIcon}>
              <Scene key='searchScreen' component={SearchScreen} hideNavBar/>
            </Scene>
            <Scene key="tab3" title="myAuction" icon={TabIcon}>
              <Scene key='myAuctionScreen' component={MyAuctionScreen} hideNavBar/>
            </Scene>
            <Scene key="tab4" title="profile" icon={TabIcon}>
              <Scene key='settingsScreen' component={SettingsScreen} hideNavBar/>
              <Scene key='infoAppScreen' component={InfoAppScreen} hideNavBar={false} leftButtonIconStyle={Styles.leftButton} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />
              <Scene key='versionAppScreen' component={VersionAppScreen} hideNavBar={false} leftButtonIconStyle={Styles.leftButton} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />
            </Scene>
          </Scene>

          <Scene key='loginScreen' component={LoginScreen} hideNavBar />
          <Scene key='forgotPasswordScreen' component={ForgotPasswordScreen} hideNavBar />
          <Scene key='checkCodeScreen' component={CheckCodeScreen} hideNavBar />
          <Scene key='changePasswordScreen' component={ChangePasswordScreen} hideNavBar />
          <Scene key='creactAccountScreen' component={CreactAccountScreen} direction="vertical" hideNavBar />
          <Scene key='editProfileScreen' component={EditProfileScreen} hideNavBar={false} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />
          <Scene key='detailProductScreen' component={DetailProductScreen} hideNavBar={false} titleStyle={Styles.title} />
          <Scene key='myAuctionNotActiveScreen' component={MyAuctionNotActiveScreen} hideNavBar={false} titleStyle={Styles.title} />
          <Scene key='uploadProductNextScreen' component={UploadProductNextScreen} title={'Step 1'} hideNavBar={false} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom}
            renderRightButton={NavItems.infoUploadButton}
          />
          <Scene key='uploadProductScreen' component={UploadProductScreen} title={'Step 2'} hideNavBar={false} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />
          <Scene key='infoUploadProductScreen' component={InfoUploadProductScreen} title={'SBid'} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />
          <Scene key='notificationScreen' component={NotificationScreen} title={'SBid'} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />

        </Scene>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginToken: (token) => dispatch(LoginActions.loginTokenRequest(token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationRouter)
