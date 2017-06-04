import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import AuctionsActions from '../Redux/AuctionsRedux'

import Tab1 from './Tab1Screen'
import Tab2 from './Tab2Screen'

// Styles
import styles from './Styles/DetailProductScreenStyle'
import { Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class DetailProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.auctions.data[this.props.rowID]
    };

    this.isHandleBid = false;
  }

  componentWillReceiveProps(nextProps) {
    const { fetching, listData, bidSuccess, error } = nextProps.auctions;
    const { language } = this.props;
    this.setState({
      data: listData[this.props.rowID],
    });

    if(!fetching && bidSuccess && this.isHandleBid) {
      Alert.alert(
        listData[this.props.rowID].product.name,
        I18n.t('bidSuccess', {locale: language}) + ' ' + bidSuccess.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') + ' VND',
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
      this.isHandleBid = false;
    }

    //error - not internet
    if(!fetching && error) {
      Alert.alert(
        'Error',
        error,
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        <ScrollableTabView
          style={{ flex: 1 }}
          tabBarBackgroundColor={'#FFF'}
          tabBarUnderlineStyle={{ backgroundColor: Colors.primary, borderRadius: 5 }}
          tabBarActiveTextColor={Colors.primary}
          tabBarInactiveTextColor={'#900'}
          tabBarTextStyle={styles.fontStyle}
        >
          <Tab1 tabLabel={I18n.t('auction', {locale: language})} rowID={this.props.rowID} />
          <Tab2 tabLabel={I18n.t('detailProduct', {locale: language})} rowID={this.props.rowID} />
        </ScrollableTabView>
        <View style={styles.viewBid}>
          <TouchableOpacity style={styles.button} onPress={() => this.handleBid(this.state.data)}>
            <Text style={styles.titleButton}>{I18n.t('bid', {locale: language})}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity style={styles.button} onPress={() => this.handleBuyNow(this.state.data)}>
            <Text style={styles.titleButton}>{I18n.t('buyNow', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  handleBid(data) {
    const { language } = this.props;
    let price = data.highestBidder ? data.highestBidder.price : data.startPrice ;
    price += data.bidIncreasement;

    const highestBidder = data.highestBidder;
    const auctionId = data.auctionId;

    //Check login
    if(this.props.login.user) {
      if(highestBidder.accountId == this.props.login.user.profile.accountId) {
        Alert.alert(
          data.product.name,
          I18n.t('youAreHighestBidder', {locale: language}),
          [
            {text: I18n.t('ok', {locale: language}), onPress: () => {}, style: 'cancel'},
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          data.product.name,
          I18n.t('yesBid', {locale: language})+ ' ' + price.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') + ' VND ?',
          [
            {text: I18n.t('later', {locale: language}), onPress: () => {}, style: 'cancel'},
            {text: I18n.t('bid', {locale: language}), onPress: () => {
              //bid product
              this.props.bibProduct(this.props.login.user.token, auctionId, this.props.login.user.profile.accountId, price, false);
              this.isHandleBid = true;
            }},
          ],
          { cancelable: false }
        );
      }
    } else {
      //not login - not profile
      NavigationActions.loginScreen();
    }
  }

  handleBuyNow(data) {
    const { language } = this.props;
    const price = data.highestBidder ? data.highestBidder.price : data.startPrice ;
    if(data.ceilingPrice < price) {
      // Buy now disable
      Alert.alert(
        I18n.t('buyNow', {locale: language}),
        I18n.t('youOnlyBid', {locale: language}),
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        I18n.t('buyNow', {locale: language}),
        I18n.t('buyProductPrice', {locale: language}) + ' ' + data.ceilingPrice.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') + ' VNĐ ?',
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
          {text: I18n.t('cancel', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
    }
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    auctions: state.auctions,
    login: state.login,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    bibProduct: (token, auctionId, accountId, priceBid, buyNow) => dispatch(AuctionsActions.bidProductRequest(token, auctionId, accountId, priceBid, buyNow)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailProduct)
