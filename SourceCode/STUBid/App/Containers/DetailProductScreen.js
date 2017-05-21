import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import ScrollableTabView from 'react-native-scrollable-tab-view'

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
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps.auctions;
    this.setState({
      data: data[this.props.rowID],
    });
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
          <TouchableOpacity style={styles.button} onPress={() => this.handleBuyNow(this.state.data.ceilingPrice)}>
            <Text style={styles.titleButton}>{I18n.t('buyNow', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  handleBid(data) {
    let price = data.highestBidder.price ? data.highestBidder.price : data.startPrice ;
    price += data.bidIncreasement;
    alert('bid ' + price);
  }

  handleBuyNow(ceilingPrice) {
    const { language } = this.props;
    Alert.alert(
      I18n.t('buyNow', {locale: language}),
      I18n.t('buyProductPrice', {locale: language}) + ' ' + ceilingPrice + ' VNĐ ?',
      [
        {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        {text: I18n.t('cancel', {locale: language}), onPress: () => {}},
      ],
      { cancelable: false }
    )
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    auctions: state.auctions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailProduct)
