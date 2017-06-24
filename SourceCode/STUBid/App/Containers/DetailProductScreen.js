import React from 'react'
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import AuctionsActions from '../Redux/AuctionsRedux'
import ModalBid from '../Components/ModalBid'

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
      data: [],//this.props.auctions.data[this.props.rowID],
      openModalBid: false,
      productSelected: null,
    };
    this.isHandleBid = false;
  }

  componentWillReceiveProps(nextProps) {
    const { fetching, listData, bidSuccess, error, myListAuction, myListAuctionClose } = nextProps.auctions;
    const { language } = this.props;

    if(this.props.screen == 'HOME' || this.props.screen == 'SEARCH') {
      this.setState({
        data: listData[this.props.rowID],
      });
    } else if(this.props.screen == 'MYAUCTIONS') {
      const temp = myListAuction.concat(myListAuctionClose);
      this.setState({
        data: temp[this.props.rowID],
      });
    }

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
    if(!fetching && error && this.isHandleBid) {
      Alert.alert(
        I18n.t('error', {locale: language}),
        error,
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
      this.isHandleBid = false;
    }
  }

  render() {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        {
          this.state.data ?
          <View style={{flex: 1}}>
            <ScrollableTabView
              style={{ flex: 1 }}
              tabBarBackgroundColor={'#FFF'}
              tabBarUnderlineStyle={{ backgroundColor: Colors.primary, borderRadius: 5 }}
              tabBarActiveTextColor={Colors.primary}
              tabBarInactiveTextColor={'#900'}
              tabBarTextStyle={styles.fontStyle}
            >
              <Tab1 tabLabel={I18n.t('auction', {locale: language})} rowID={this.props.rowID} screen={this.props.screen} />
              <Tab2 tabLabel={I18n.t('detailProduct', {locale: language})} rowID={this.props.rowID} screen={this.props.screen} />
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
            { this.renderModalBid() }
          </View>
          :
          <View style={styles.viewLoading}>
            <ActivityIndicator
              animating={true}
              size="large"
              color={Colors.primary}
            />
          </View>
        }
      </View>
    )
  }

  handleBidPress(priceBid) {
    //bid product
    this.props.bibProduct(this.props.login.user.token, this.state.productSelected.auctionId, this.props.login.user.profile.accountId, priceBid, false);
    this.setState({ productBid: this.state.productSelected, openModalBid: false  });
    this.isHandleBid = true;
  }

  renderModalBid() {
    if(this.state.openModalBid) {
      return(
        <ModalBid
          title={this.state.productSelected.product.name}
          data={this.state.productSelected}
          open={this.state.openModalBid}
          modalDidClose={() => this.setState({ openModalBid: false })}
          onPressA={() => this.setState({ openModalBid: false })}
          onPressB={(priceBid) => this.handleBidPress(priceBid)}
        />
      );
    } else {
      return null;
    }
  }

  handleBid(data) {
    const { language } = this.props;
    let price = data.highestBidder ? data.highestBidder.price : data.startPrice ;
    price += data.bidIncreasement;

    const highestBidder = data.highestBidder;
    const auctionId = data.auctionId;

    //Check login
    if(this.props.login.user) {
      if(highestBidder) {
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
          this.setState({ openModalBid: true, productSelected: data });
        }
      } else {
        if(data.seller.accountId == this.props.login.user.profile.accountId) {
          Alert.alert(
            data.product.name,
            I18n.t('YouCanNotBidBecauseYouSeller', {locale: language}),
            [
              {text: I18n.t('ok', {locale: language}), onPress: () => {}, style: 'cancel'},
            ],
            { cancelable: false }
          );
        } else {
          this.setState({ openModalBid: true, productSelected: data });
        }
      }

    } else {
      //not login - not profile
      NavigationActions.loginScreen();
    }
  }

  handleBuyNow(data) {
    console.log(data);
    const { language } = this.props;
    const price = data.highestBidder ? data.highestBidder.price : data.startPrice ;
    //Check login
    if(this.props.login.user) {
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
        let _this = this;
        Alert.alert(
          I18n.t('buyNow', {locale: language}),
          I18n.t('buyProductPrice', {locale: language}) + ' ' + data.ceilingPrice.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') + ' VNĐ ?',
          [
            {text: I18n.t('ok', {locale: language}), onPress: () => {
              this.props.bibProduct(this.props.login.user.token, data.auctionId, this.props.login.user.profile.accountId, data.ceilingPrice, true);
              this.isHandleBid = true;
            }},
            {text: I18n.t('cancel', {locale: language}), onPress: () => {}},
          ],
          { cancelable: false }
        );
      }
    } else {
      //not login - not profile
      NavigationActions.loginScreen();
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
