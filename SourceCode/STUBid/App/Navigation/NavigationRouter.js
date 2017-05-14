import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Scene, Router, Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
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

//Styles
import Styles from './Styles/NavigationContainerStyles'
import { Colors, Fonts, Images } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/
class TabIcon extends React.Component {
  render() {
    const color = this.props.selected ? Colors.primary :'black';
    const size = this.props.selected ? 30 : 25;
    const { title, sceneKey, language } = this.props;
    let nameIcon;
    switch (sceneKey) {
      case 'tab1':
        nameIcon = 'home';
        break;
      case 'tab2':
        nameIcon = 'search';
        break;
      case 'tab3':
        nameIcon = 'legal';
        break;
      case 'tab4':
        nameIcon = 'user-md';
        break;
      default:
        nameIcon = '';
    }
    return (
      <View style={{ alignItems: 'center'}}>
        <Icon name={nameIcon} size={size} color={color} />
        <Text style={{color: color}}>{I18n.t(title, {locale: language})}</Text>
        {
          this.props.selected &&
          <View style={{ backgroundColor: Colors.primary, width: 70, height: 5,borderRadius: 5}} />
        }
      </View>
    );
  }
}

class NavigationRouter extends Component {
  componentWillReceiveProps(nextProps) {
    Actions.refresh();
  }

  render () {
    return (
      <Router>
        <Scene key='drawerChildrenWrapper' navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>

          <Scene key="tabbar" tabs={true} tabBarStyle={{backgroundColor: '#FFF', height: 60}} >
            <Scene key="tab1" initial={true} title="home" icon={TabIcon} >
              <Scene key='homeScreen' component={HomeScreen} hideNavBar />
            </Scene>
            <Scene key="tab2" title="search" icon={TabIcon}>
              <Scene key='searchScreen' component={SearchScreen} hideNavBar />
            </Scene>
            <Scene key="tab3" title="myAuction" icon={TabIcon}>
              <Scene key='myAuctionScreen' component={MyAuctionScreen} hideNavBar />
            </Scene>
            <Scene key="tab4" title="profile" icon={TabIcon}>
              <Scene key='settingsScreen' component={SettingsScreen} hideNavBar />
            </Scene>
          </Scene>

          <Scene key='loginScreen' component={LoginScreen} hideNavBar />
          <Scene key='detailProductScreen' component={DetailProductScreen} hideNavBar={false}
            titleStyle={{width: 250, color: Colors.primary, fontFamily: Fonts.type.quicksand}}
          />
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
const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationRouter)
