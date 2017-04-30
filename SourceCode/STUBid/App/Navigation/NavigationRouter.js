import React, { Component } from 'react'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyles'
import { Colors } from '../Themes'
import NavigationDrawer from './NavigationDrawer'

// screens identified by the router
import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/LoginScreen'
import SettingsScreen from '../Containers/SettingsScreen'
import HomeScreen from '../Containers/HomeScreen'
import Main from '../Containers/Main'
import SearchScreen from '../Containers/SearchScreen'
import MyAuctionScreen from '../Containers/MyAuctionScreen'
import DetailProductScreen from '../Containers/DetailProductScreen'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
          <Scene key='launchScreen' component={LaunchScreen} title='LaunchScreen' hideNavBar />
          <Scene key='loginScreen' component={LoginScreen} hideNavBar />
          <Scene key='settingsScreen' component={SettingsScreen} hideNavBar />
          <Scene initial key='main' component={Main} hideNavBar />
          <Scene key='homeScreen' component={HomeScreen} hideNavBar />
          <Scene key='searchScreen' component={SearchScreen} hideNavBar />
          <Scene key='myAuctionScreen' component={MyAuctionScreen} hideNavBar />
          <Scene
            key='detailProductScreen'
            component={DetailProductScreen}
            hideNavBar={false}
            titleStyle={{color: Colors.primary}}
            leftButtonIconStyle={{ tintColor: Colors.primary }}
            navigationBarStyle={{ borderBottomColor: '#FFF', backgroundColor: '#FFF' }}
          />
        </Scene>
      </Router>
    )
  }
}

export default NavigationRouter
