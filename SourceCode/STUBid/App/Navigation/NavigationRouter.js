import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Scene, Router } from 'react-native-router-flux'
import Styles from './Styles/NavigationContainerStyles'
import { Colors, Fonts } from '../Themes'
import NavigationDrawer from './NavigationDrawer'
import Icon from 'react-native-vector-icons/FontAwesome'

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
class TabIcon extends React.Component {
  render() {
    const color = this.props.selected ? 'red' :'black';
    const { title } = this.props;
    let nameIcon;
    switch (title) {
      case 'Home':
        nameIcon = 'home';
        break;
      case 'Search':
        nameIcon = 'search';
        break;
      case 'Profile':
        nameIcon = 'user-md';
        break;
      default:
        nameIcon = '';
    }
    return (
      <View style={{ alignItems: 'center'}}>
        <Icon name={nameIcon} size={25} color={color} />
        <Text style={{color: color}}>{title}</Text>
      </View>
    );
  }
}

class NavigationRouter extends Component {
  render () {
    return (
      <Router>
        <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>

          <Scene key="tabbar" tabs={true} tabBarStyle={{backgroundColor: '#FFF'}} >
            <Scene key="tab1" initial={true} title="Home" icon={TabIcon} >
              <Scene key='homeScreen' title="Home" component={HomeScreen} hideNavBar />
              <Scene key='detailProductScreen' component={DetailProductScreen} hideNavBar={false}
                titleStyle={{width: 250, color: Colors.primary, fontFamily: Fonts.type.quicksand}}
                leftButtonIconStyle={{ tintColor: Colors.primary }}
                navigationBarStyle={{ borderBottomColor: '#FFF', backgroundColor: '#FFF' }}
              />
            </Scene>
            <Scene key="tab2" title="Search" icon={TabIcon}>
              <Scene key='searchScreen' component={SearchScreen} hideNavBar />
            </Scene>
            <Scene key="tab3" title="Profile" icon={TabIcon}>
              <Scene key='settingsScreen' component={SettingsScreen} hideNavBar />
            </Scene>
          </Scene>


        </Scene>
      </Router>
    )
  }
}
// <Scene key='launchScreen' component={LaunchScreen} title='LaunchScreen' hideNavBar />
// <Scene key='loginScreen' component={LoginScreen} hideNavBar />
// <Scene key='settingsScreen' component={SettingsScreen} hideNavBar />
// <Scene initial key='main' component={Main} hideNavBar />
// <Scene key='homeScreen' component={HomeScreen} hideNavBar />
// <Scene key='searchScreen' component={SearchScreen} hideNavBar />
// <Scene key='myAuctionScreen' component={MyAuctionScreen} hideNavBar />
// <Scene
//   key='detailProductScreen'
//   component={DetailProductScreen}
//   hideNavBar={false}
//   titleStyle={{width: 250, color: Colors.primary, fontFamily: Fonts.type.quicksand}}
//   leftButtonIconStyle={{ tintColor: Colors.primary }}
//   navigationBarStyle={{ borderBottomColor: '#FFF', backgroundColor: '#FFF' }}
// />
export default NavigationRouter
