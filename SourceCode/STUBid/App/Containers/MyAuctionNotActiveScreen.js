import React from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import Swiper from 'react-native-swiper'
import ImageLoad from 'react-native-image-placeholder'
import QRCode from 'react-native-qrcode'
import moment from 'moment'
import 'moment/locale/vi'

// Styles
import styles from './Styles/MyAuctionNotActiveScreenStyle'
import { Colors, Metrics, Images } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class MyAuctionNotActive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrImage: [],
      data: this.props.data,
      text: 'https://github.com/tunguyenthanh',
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

  render () {
    const { data } = this.state;
    const { language } = this.props;
    moment.locale(this.props.language);
    return (
      <View style={styles.container}>
        <Swiper height={(Metrics.screenWidth * 1.8)/3} autoplay>
          {
            this.renderImage()
          }
        </Swiper>
        <View style={styles.viewDetail}>
          <View style={[styles.rowItem, { marginTop: 10 }]}>
            <Text style={styles.textTitleStyle}>{I18n.t('productId', {locale: language})}: </Text>
            <Text style={styles.textStyle}>{data.product.productId}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.textTitleStyle}>{I18n.t('createDate', {locale: language})}: </Text>
            <Text style={styles.textStyle}>
            {
              this.capitalizeEachWord(moment(data.activatedDate).format('LLLL').toString())
            }
            </Text>
          </View>

          <View style={styles.rowItem}>
            <Text style={styles.textTitleStyle}>{I18n.t('category', {locale: language})}: </Text>
            <Text style={styles.textStyle}>{I18n.t(data.product.category.name, {locale: language})}</Text>
          </View>

          <View style={styles.viewQRCodeStyle}>
            <QRCode
              value={this.state.text}
              size={180}
              bgColor={Colors.primary}
              fgColor={Colors.lightgray}
            />
            <View style={styles.viewImageQRCode}>
              <View style={styles.viewWrapQRCode}>
                <Image
                  source={Images.sbidIcon}
                  style={styles.imgLogoStyle}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
          <View style={{ alignItems: 'center'}}>
            <Text style={styles.textTitleStyle}>{I18n.t('scanIt', {locale: language})}</Text>
          </View>
        </View>
      </View>
    )
  }

  capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAuctionNotActive)
