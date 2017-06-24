import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import AuctionsActions from '../Redux/AuctionsRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../Components/Header'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import MyAuctionTab1 from './MyAuctionTab1Screen'
import MyAuctionTab2 from './MyAuctionTab2Screen'
import IO from 'socket.io-client/dist/socket.io'

//Key config - AsyncStorage
import AppConfig from '../Config/AppConfig'
import ApiConfig from '../Config/ApiConfig'

// Styles
import styles from './Styles/MyAuctionScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class MyAuction extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    if(this.props.login.user) {
      this.socket = IO(ApiConfig.baseSocketIOURL);

      //my auctions
      this.socket.emit('CLIENT-REQUEST-ATTENDED-AUCTIONS-VIEW', { accountId: this.props.login.user.profile.accountId});
      this.socket.emit('CLIENT-SEND-PAGE', { page: 1 });
      this.socket.on('SERVER-SEND-AUCTIONS', (data) => {
        this.props.myAuctions(data);
      });

      //
      this.socket.on('SERVER-SEND-CLOSED-ATTENDED-AUCTIONS', (data) => {
        this.props.myAuctionsClose(data);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    const { myListAuction, myListAuctionClose } = nextProps.auctions;

    if(myListAuction) {
      this.setState({
        data: this.state.data.concat(myListAuction)
      });
    }

    if(myListAuctionClose) {
      this.setState({
        data: this.state.data.concat(myListAuctionClose)
      });
    }
  }

  render() {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title={I18n.t('myAuction', { locale: language })}
          bgColor={'#FFF'}
          titleStyle={styles.titleStyle}
        />
        <View style={{ flex: 1 }}>
          { this.renderView() }
        </View>
      </View>
    )
  }

  renderView() {
    const { language } = this.props;
    if(this.props.login.user) {
      if(this.state.data.length == 0) {
        return(
          <View style={styles.contentEmpty}>
            <Icon name="legal" size={70} color={Colors.primary} />
            <Text>{I18n.t('emptyAuctions', {locale: language})}</Text>
          </View>
        );
      } else {
        return(
          <ScrollableTabView
            style={{ flex: 1 }}
            tabBarBackgroundColor={'#FFF'}
            tabBarUnderlineStyle={{ backgroundColor: Colors.primary, borderRadius: 5 }}
            tabBarActiveTextColor={Colors.primary}
            tabBarInactiveTextColor={'#900'}
            tabBarTextStyle={styles.fontStyle}
          >
            <MyAuctionTab1 tabLabel={'Đang đấu giá'}/>
            <MyAuctionTab2 tabLabel={'Danh sách đăng'}/>
          </ScrollableTabView>
        );
      }
    } else {
      return (
        <View style={styles.viewWrap}>
          <Text style={styles.titleStyle}>
            {I18n.t('PleaseLoginViewYourAuctions', {locale: language})}
          </Text>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => NavigationActions.loginScreen()}>
            <Text style={styles.buttonTextStyle}>{I18n.t('login', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    login: state.login,
    auctions: state.auctions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    myAuctions: (data) => dispatch(AuctionsActions.myAuctions(data)),
    myAuctionsClose: (data) => dispatch(AuctionsActions.myAuctionsClose(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAuction)
