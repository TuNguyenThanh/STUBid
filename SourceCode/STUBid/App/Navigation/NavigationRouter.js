import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Scene, Router } from 'react-native-router-flux'
import NavigationDrawer from './NavigationDrawer'
import TabIcon from './TabIcon'

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

//Styles
import Styles from './Styles/NavigationContainerStyles'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/
class NavigationRouter extends Component {
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
              <Scene key='infoAppScreen' component={InfoAppScreen} hideNavBar={false} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />
            </Scene>
          </Scene>

          <Scene key='loginScreen' component={LoginScreen} hideNavBar />
          <Scene key='forgotPasswordScreen' component={ForgotPasswordScreen} hideNavBar />
          <Scene key='checkCodeScreen' component={CheckCodeScreen} hideNavBar />
          <Scene key='creactAccountScreen' component={CreactAccountScreen} direction="vertical" hideNavBar />
          <Scene key='editProfileScreen' component={EditProfileScreen} hideNavBar={false} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />
          <Scene key='detailProductScreen' component={DetailProductScreen} hideNavBar={false} titleStyle={Styles.title} />
          <Scene key='uploadProductNextScreen' component={UploadProductNextScreen} title={'Step 1'} hideNavBar={false} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />
          <Scene key='uploadProductScreen' component={UploadProductScreen} title={'Step 2'} hideNavBar={false} titleStyle={Styles.title} navigationBarStyle={Styles.navBarCustom} />

        </Scene>
      </Router>
    );
  }
}

export default NavigationRouter
