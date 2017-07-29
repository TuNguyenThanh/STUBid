import React from 'react'
import { ScrollView, View, Text, ListView, TouchableOpacity   } from 'react-native'
import { connect } from 'react-redux'
import ProductActions from '../Redux/ProductRedux'
import AuctionsActions from '../Redux/AuctionsRedux'
import ImageLoad from 'react-native-image-placeholder'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'
//import { myAuctionsHandler } from '../Helper/SocketIO'

//Key config - AsyncStorage
import AppConfig from '../Config/AppConfig'
import ApiConfig from '../Config/ApiConfig'

// Styles
import styles from './Styles/MyAuctionTab2ScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class MyAuctionTab2 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSourceHandling: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
    };
  }

  componentDidMount() {
    // myAuctionsHandler.setServerSendMyAuctionsHandler((data) => {
    //   this.props.myAuctionsHanding(data);
    // }, this.props.login.user.profile.accountId, 1);
    //
    // this.props.getProductUnActivity(this.props.login.user.token);
    // this.isGetProductUnActivity = true;
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    //const { fetching, error, data } = nextProps.productState;
    const { myAuctionsHanding, myAuctionsUnActive, myCloseAuctionsActive } = nextProps.auctions;

    let temp = myAuctionsHanding.concat(myAuctionsUnActive);
    if(myCloseAuctionsActive.length != 0) {
      temp = temp.concat(myCloseAuctionsActive);
    }
    this.setState({
      dataSourceHandling: this.state.dataSourceHandling.cloneWithRows(temp)
    });
  }

  render () {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ListView
          style={styles.listviewStyle}
          enableEmptySections
          dataSource={this.state.dataSourceHandling}
          renderRow={(rowData, sectionID, rowID) => this.renderItemHandling(rowData, rowID)}
          scrollEventThrottle={16}
        />
      </ScrollView>
    )
  }

  renderItemHandling(item, rowID) {
    const { language } = this.props;
    return(
      <TouchableOpacity style={styles.row} onPress={() => {
        item.timeLeft ?
        NavigationActions.detailProductScreen({ title: item.product.name, data: item, rowID: rowID, screen: 'MYAUCTION_TAB2_1' })
        :
         NavigationActions.myAuctionNotActiveScreen({ title: item.product.name, data: item })
      }}>
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
            <Text style={styles.titleTime}>
            {
              item.timeLeft ? item.timeLeft : (item.state >1 ? I18n.t('Finished', {locale: language}) : I18n.t('notActive', {locale: language}))
            }
            </Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="legal" size={15} color={Colors.primary} />
            </View>
            <View style={styles.viewPriceBid}>
              <Text style={styles.titlePriceNext}>
              {
                item.timeLeft ?
                (
                  item.highestBidder ?
                  (item.highestBidder.price + item.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') :
                  (item.startPrice + item.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
                )
                :
                I18n.t('notActive', {locale: language})
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
    language: state.settings.language,
    login: state.login,
    productState: state.product,
    auctions: state.auctions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // getProductUnActivity: (token) => dispatch(ProductActions.getProductUnActivityRequest(token)),
    // myAuctionsHanding: (data) => dispatch(AuctionsActions.myAuctionsHanding(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAuctionTab2)
