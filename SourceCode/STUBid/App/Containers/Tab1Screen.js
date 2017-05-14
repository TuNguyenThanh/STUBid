import React from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity, ListView, Platform } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'

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
  }

  componentDidMount() {
    let arrHinh =  [
      { url: 'https://cdn1.tgdd.vn/Products/Images/522/69336/ipad-air-2-cellular-7-2.jpg' },
      { url: 'https://cdn1.tgdd.vn/Products/Images/522/69336/ipad-air-2-cellular-7-2.jpg' },
      { url: 'https://cdn1.tgdd.vn/Products/Images/522/69336/ipad-air-2-cellular-7-2.jpg' }
    ];

    setTimeout(() => {
      this.setState({ arrImage: arrHinh });
    }, 100);
  }

  render () {
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
              <Text style={styles.fontStyle}>Nguoi ban</Text>
            </View>
            <View style={styles.item}>
              <Icon name="phone" size={20} color={Colors.primary} style={styles.iconRight}/>
              <Text style={styles.fontStyle}>0903016975</Text>
            </View>
          </View>
          <View style={styles.item}>
            <Icon name="clock-o" size={20} color={Colors.primary} style={styles.iconRight}/>
            <Text style={styles.fontStyle}>2017-05-20 10:30:00</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.fontStyle}>Nguoi ra gia cao nhat</Text>
            <Icon name="user-secret" size={20} color={Colors.primary} style={styles.iconLeft}/>
          </View>
          <View style={styles.itemRight}>
            <Text style={styles.fontStyle}>8.300.000 VND</Text>
            <Icon name="legal" size={20} color={Colors.primary} style={styles.iconLeft}/>
          </View>
          <View style={styles.viewCountDown}>
            <Icon name="hourglass-half" size={20} color={Colors.primary} style={styles.iconRight}/>
            <Text style={styles.fontStyle}>21:35:00</Text>
          </View>
          <View style={styles.itemCenter}>
            <View style={styles.viewNextPrice}>
              <Text style={[styles.fontStyle, styles.priceBidStyle]}>8.500.000</Text>
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
          <Image style={styles.image} source={{uri: img.url }} />
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
