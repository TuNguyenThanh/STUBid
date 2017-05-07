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
        <View style={{ flex: 1 }}>
          <Text>Tab 1 screen</Text>
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
