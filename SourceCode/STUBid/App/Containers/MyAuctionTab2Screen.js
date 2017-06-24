import React from 'react'
import { ScrollView, View, Text, ListView, TouchableOpacity   } from 'react-native'
import { connect } from 'react-redux'
import ProductActions from '../Redux/ProductRedux'
import AuctionsActions from '../Redux/AuctionsRedux'
import ImageLoad from 'react-native-image-placeholder'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'
import IO from 'socket.io-client/dist/socket.io'

//Key config - AsyncStorage
import AppConfig from '../Config/AppConfig'
import ApiConfig from '../Config/ApiConfig'

// Styles
import styles from './Styles/MyAuctionTab2ScreenStyle'
import { Images, Colors } from '../Themes'

class MyAuctionTab2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSourceHandling: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      dataSourceProcessed: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
    this.isGetProductUnActivity = false;
  }

  componentDidMount() {
    this.socket = IO(ApiConfig.baseSocketIOURL);

    // my auctions
    this.socket.emit('CLIENT-REQUEST-MY-AUCTIONS-VIEW', { accountId: this.props.login.user.profile.accountId });
    this.socket.emit('CLIENT-SEND-MY-AUCTIONS-PAGE', { page: 1 });
    this.socket.on('SERVER-SEND-MY-AUCTIONS', (data) => {
      this.props.myAuctionsHanding(data);
    });

    this.props.getProductUnActivity(this.props.login.user.token);
    this.isGetProductUnActivity = true;
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    const { fetching, error, data } = nextProps.product;
    const { myAuctionsHanding } = nextProps.auctions;

    if(!fetching && this.isGetProductUnActivity && data) {
      this.setState({
        dataSourceProcessed: this.state.dataSourceProcessed.cloneWithRows(data),
      });
    }

    if(myAuctionsHanding) {
      this.setState({
        dataSourceHandling: this.state.dataSourceHandling.cloneWithRows(myAuctionsHanding),
      });
    }

  }

  render () {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.viewWrap}>
          <View style={styles.viewHeaderTitleStyle}>
            <Text style={styles.titleHeaderStyle}>Đã xử lý</Text>
          </View>
          <ListView
            style={styles.listviewStyle}
            enableEmptySections
            dataSource={this.state.dataSourceHandling}
            renderRow={(rowData, sectionID, rowID) => this.renderItemHandling(rowData, rowID)}
            scrollEventThrottle={16}
          />
        </View>

        <View style={styles.viewWrap}>
          <View style={styles.viewHeaderTitleStyle}>
            <Text style={styles.titleHeaderStyle}>Đang xử lý</Text>
          </View>
          <ListView
            style={styles.listviewStyle}
            enableEmptySections
            dataSource={this.state.dataSourceProcessed}
            renderRow={(rowData, sectionID, rowID) => this.renderItemProcessed(rowData, rowID)}
            scrollEventThrottle={16}
          />
        </View>
      </ScrollView>
    )
  }

  renderItemHandling(item, rowID) {
    return(
      <TouchableOpacity style={styles.row} onPress={() => NavigationActions.detailProductScreen({ title: item.product.name, data: item, rowID: rowID })}>
        {
          item.product.images ?
          <ImageLoad
            style={styles.imgStyle}
            placeholderStyle={{ flex: 1, resizeMode: 'center'}}
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
            <Text style={styles.titleTime}>{item.timeLeft}</Text>
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

  renderItemProcessed(item, rowID) {
    return(
      <TouchableOpacity style={styles.row} onPress={() => NavigationActions.detailProductScreen({ title: item.product.name, data: item, rowID: rowID })}>
        {
          item.product.images ?
          <ImageLoad
            style={styles.imgStyle}
            placeholderStyle={{ flex: 1, resizeMode: 'center'}}
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
              {item.startPrice}
            </Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="hourglass-half" size={15} color={Colors.primary} />
            </View>
            <Text style={styles.titleTime}>Not active</Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="legal" size={15} color={Colors.primary} />
            </View>
            <View style={styles.viewPriceBid}>
              <Text style={styles.titlePriceNext}>
              Not active
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
    language: state.settings.language,
    login: state.login,
    product: state.product,
    auctions: state.auctions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProductUnActivity: (token) => dispatch(ProductActions.getProductUnActivityRequest(token)),
    myAuctionsHanding: (data) => dispatch(AuctionsActions.myAuctionsHanding(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAuctionTab2)
