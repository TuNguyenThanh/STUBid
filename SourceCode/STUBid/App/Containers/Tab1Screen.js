import React from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity, ListView, Platform } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'
import ImageLoad from 'react-native-image-placeholder'
import moment from 'moment'
import 'moment/locale/vi'

// Styles
import styles from './Styles/Tab1ScreenStyle'
import { Colors, Metrics, Images } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class Tab1 extends React.Component {
  constructor(props) {
    super(props);
    let data = [];
    if(this.props.screen == 'HOME') {
      data = this.props.auctions.listData[this.props.rowID];
    } else if(this.props.screen == 'MYAUCTIONS') {
      const temp = this.props.auctions.myListAuction.concat(this.props.auctions.myListAuctionClose);
      data = temp[this.props.rowID];
    } else if (this.props.screen == 'MYAUCTION_TAB2_1') {
      data = this.props.auctions.myAuctionsHanding[this.props.rowID];
    } else if (this.props.screen == 'SEARCH_SCREEN') {
      data = this.props.auctions.searchAuctions[this.props.rowID];
    }

    this.state = {
      arrImage: [],
      data
    };
  }

  componentDidMount() {
    let arrHinh = [];
    if(this.state.data.product.images) {
      this.state.data.product.images.map((img) => {
        arrHinh.push({ url: img.url })
      });
    }

    setTimeout(() => {
      this.setState({ arrImage: arrHinh });
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    const { listData, myListAuction, myListAuctionClose, myAuctionsHanding, searchAuctions } = nextProps.auctions;

    if(this.props.screen == 'HOME') {
      this.setState({
        data: listData[this.props.rowID],
      });
    } else if(this.props.screen == 'MYAUCTIONS') {
      const temp = myListAuction.concat(myListAuctionClose);
      this.setState({
        data: temp[this.props.rowID],
      });
    } else if (this.props.screen == 'MYAUCTION_TAB2_1') {
      this.setState({
        data: myAuctionsHanding[this.props.rowID],
      });
    } else if (this.props.screen == 'SEARCH_SCREEN') {
      this.setState({
        data: searchAuctions[this.props.rowID],
      });
    }
  }

  render () {
    moment.locale(this.props.language);
    const { data } = this.state;
    return (
      <View style={styles.container}>
        <Swiper height={(Metrics.screenWidth * 1.8)/3} autoplay activeDotColor={Colors.primary}>
          {
            this.renderImage()
          }
        </Swiper>
        <View style={styles.viewDetail}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.item}>
              <Icon name="user" size={20} color={Colors.primary} style={styles.iconRight}/>
              <Text style={styles.fontStyle}>{data.seller.lastName + ' ' +data.seller.firstName}</Text>
            </View>
            <View style={styles.item}>
              <Icon name="phone" size={20} color={Colors.primary} style={styles.iconRight}/>
              <Text style={styles.fontStyle}>{data.seller.phoneNumber}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <Icon name="clock-o" size={20} color={Colors.primary} style={styles.iconRight}/>
            <Text style={styles.fontStyle}>
            {
              this.capitalizeEachWord(moment(data.activatedDate).format('LLLL').toString())
            }
            </Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.fontStyle}>
              {
                data.highestBidder ? data.highestBidder.lastName + data.highestBidder.firstName :
                'Chua co nguoi dau gia'
              }
            </Text>
            <Icon name="user-secret" size={20} color={Colors.primary} style={styles.iconLeft}/>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.fontStyle}>
              {
                data.highestBidder ?
                data.highestBidder.price.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') :
                data.startPrice.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
              }
            </Text>
            <Icon name="legal" size={20} color={Colors.primary} style={styles.iconLeft}/>
          </View>
          <View style={styles.viewCountDown}>
            <Icon name="hourglass-half" size={20} color={Colors.primary} style={styles.iconRight}/>
            <Text style={styles.fontStyle}>{data.timeLeft ? data.timeLeft : 'Đã kết thúc'}</Text>
          </View>
          <View style={styles.itemCenter}>
            <View style={styles.viewNextPrice}>
              <Text style={[styles.fontStyle, styles.priceBidStyle]}>
                {
                  data.highestBidder ?
                  (data.highestBidder.price + data.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') :
                  (data.startPrice + data.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
                }
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  renderImage() {
    if(this.state.arrImage.length != 0) {
      let arrImg = [];
      this.state.arrImage.map((img, index) => {
        arrImg.push(
          <View style={styles.slide} key={index}>
            <ImageLoad
              style={styles.image}
              source={{uri: img.url }}
              resizeMode="contain"
            />
          </View>
        );
      });
      return arrImg;
    } else {
      return (
        <ImageLoad
          style={styles.image}
          source={Images.sbidIcon}
        />
      );
    }
  }

  capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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

export default connect(mapStateToProps, mapDispatchToProps)(Tab1)
