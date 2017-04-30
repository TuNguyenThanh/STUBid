import React from 'react'
import { Text, Image, View } from 'react-native'
import { Images, Colors } from '../Themes'
import TabNavigator from 'react-native-tab-navigator'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import HomeScreen from './HomeScreen'
import SearchScreen from './SearchScreen'
import MyAuctionScreen from './MyAuctionScreen'
import SettingsScreen from './SettingsScreen'

//I18n
import I18n from 'react-native-i18n'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
    };
  }

  render () {
    const { language } = this.props;
    return (
      <TabNavigator
        lineStyleSelect={{backgroundColor: '#0e5aa8', height: 5 }}
        lineStyleUnSelect={{backgroundColor: '#fff', height: 5}}
      >
        <TabNavigator.Item
          selected={this.state.selectedTab === 'home'}
          title={I18n.t('home', {locale: language})}
          titleStyle={{color:'#900'}}
          selectedTitleStyle={{color: Colors.primary, fontSize: 13}}
          renderIcon={() => <Icon name="home" size={25} color="#900" />}
          renderSelectedIcon={() => <Icon name="home" size={30} color={Colors.primary} />}
          onPress={() => this.setState({ selectedTab: 'home' })}>
          <HomeScreen />
        </TabNavigator.Item>

        <TabNavigator.Item
          selected={this.state.selectedTab === 'search'}
          title={I18n.t('search', {locale: language})}
          titleStyle={{color:'#900'}}
          selectedTitleStyle={{color: Colors.primary, fontSize: 13}}
          renderIcon={() => <Icon name="search" size={25} color="#900" />}
          renderSelectedIcon={() => <Icon name="search" size={30} color={Colors.primary} />}
          onPress={() => this.setState({ selectedTab: 'search' })}>
          <SearchScreen />
        </TabNavigator.Item>

        <TabNavigator.Item
          selected={this.state.selectedTab === 'auction'}
          title={I18n.t('myAuction', {locale: language})}
          titleStyle={{color:'#900'}}
          selectedTitleStyle={{color: Colors.primary, fontSize: 13}}
          renderIcon={() => <Icon name="legal" size={25} color="#900" />}
          renderSelectedIcon={() => <Icon name="legal" size={30} color={Colors.primary} />}
          onPress={() => this.setState({ selectedTab: 'auction' })}>
          <MyAuctionScreen />
        </TabNavigator.Item>

        <TabNavigator.Item
          selected={this.state.selectedTab === 'profile'}
          title={I18n.t('profile', {locale: language})}
          titleStyle={{color:'#900'}}
          selectedTitleStyle={{color: Colors.primary, fontSize: 13}}
          renderIcon={() => <Icon name="user-md" size={25} color="#900" />}
          renderSelectedIcon={() => <Icon name="user-md" size={30} color={Colors.primary} />}
          onPress={() => this.setState({ selectedTab: 'profile' })}>
          <SettingsScreen />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
