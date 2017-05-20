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
import { Colors, Metrics } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class Tab1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrImage: [],
    };

    console.log(this.props.data);
  }

  componentDidMount() {
    let arrHinh = [];
    this.props.data.product.images.map((img) => {
      arrHinh.push({ url: img.url })
    });

    setTimeout(() => {
      this.setState({ arrImage: arrHinh });
    }, 100);
  }

  render () {
    moment.locale(this.props.language);
    const { data } = this.props;
    return (
      <View style={styles.container}>
        <Swiper height={(Metrics.screenWidth * 1.8)/3} autoplay>
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
              moment().format('LLLL')
            }
            </Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.fontStyle}>
              {
                data.highestBidder.firstName ? data.highestBidder.lastName + data.highestBidder.firstName :
                'Chua co nguoi dau gia'
              }
            </Text>
            <Icon name="user-secret" size={20} color={Colors.primary} style={styles.iconLeft}/>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.fontStyle}>
              {
                data.highestBidder.price ?
                data.highestBidder.price.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') :
                data.startPrice.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
              }
            </Text>
            <Icon name="legal" size={20} color={Colors.primary} style={styles.iconLeft}/>
          </View>
          <View style={styles.viewCountDown}>
            <Icon name="hourglass-half" size={20} color={Colors.primary} style={styles.iconRight}/>
            <Text style={styles.fontStyle}>{data.timeLeft}</Text>
          </View>
          <View style={styles.itemCenter}>
            <View style={styles.viewNextPrice}>
              <Text style={[styles.fontStyle, styles.priceBidStyle]}>
                {
                  data.highestBidder.price ?
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

export default connect(mapStateToProps, mapDispatchToProps)(Tab1)
