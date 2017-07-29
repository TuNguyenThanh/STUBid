import React from 'react'
import { View, Text, ListView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import AuctionsActions from '../Redux/AuctionsRedux'
import ImageLoad from 'react-native-image-placeholder'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'

//I18n
import I18n from 'react-native-i18n'

// Styles
import styles from './Styles/MyAuctionTab1ScreenStyle'
import { Images, Colors } from '../Themes'

class MyAuctionTab1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    const { fetching, error, myListAuction, myListAuctionClose } = nextProps.auctions;
    const temp = myListAuction.concat(myListAuctionClose);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(temp),
    });
  }

  render () {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listviewStyle}
          enableEmptySections
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => this.renderItem(rowData, rowID)}
          scrollEventThrottle={16}
        />
      </View>
    )
  }

  renderItem(item, rowID) {
    const { language } = this.state;
    return(
      <TouchableOpacity style={styles.row} onPress={() => NavigationActions.detailProductScreen({ title: item.product.name, data: item, rowID: rowID, screen: 'MYAUCTIONS' })}>
        {
          item.product.images ?
          <ImageLoad
            style={styles.imgStyle}
            loadingStyle={{ size: 'small', color: 'blue' }}
            resizeMode="contain"
            source={{uri: item.product.images[0].url}}
          />
          :
          <Image
            style={styles.imgStyle2}
            source={Images.sbidIcon}
          />
        }
        <View style={styles.viewDetail}>
          <Text style={styles.titleProduct} numberOfLines={2}>{item.product.name}</Text>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="dollar" size={15} color={Colors.primary} />
            </View>
            <Text style={styles.titlePriceNow}>
            {
              item.highestBidder ?
              item.highestBidder.price.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') :
              item.startPrice.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
            }
            </Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="hourglass-half" size={15} color={Colors.primary} />
            </View>
            <Text style={styles.titleTime}>{item.timeLeft ? item.timeLeft : I18n.t('Finished', {locale: language})}</Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="legal" size={15} color={Colors.primary} />
            </View>
            <View style={styles.viewPriceBid}>
              <Text style={styles.titlePriceNext}>
              {
                item.highestBidder ?
                (item.highestBidder.price + item.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') :
                (item.startPrice + item.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
              }
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    auctions: state.auctions,
    language: state.settings.language,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAuctionTab1)
