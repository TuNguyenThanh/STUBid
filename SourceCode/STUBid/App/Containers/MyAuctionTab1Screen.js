import React from 'react'
import { View, Text, ListView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import ImageLoad from 'react-native-image-placeholder'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'

// Styles
import styles from './Styles/MyAuctionTab1ScreenStyle'
import { Images, Colors } from '../Themes'

class MyAuctionTab1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([1,2,3]),
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
    return(
      <TouchableOpacity style={styles.row} onPress={() => NavigationActions.detailProductScreen({ title: item.product.name, data: item, rowID: rowID })}>
        <ImageLoad
          style={styles.imgStyle}
          placeholderStyle={{ flex: 1, resizeMode: 'center'}}
          loadingStyle={{ size: 'small', color: 'blue' }}
          resizeMode="contain"
          source={{uri: 'http://sohanews.sohacdn.com/k:2015/2-anh-den-nhem-mot-thoi-cua-my-nhan-viet-2012-1430010384059/hot-hoang-voi-hinh-anh-den-nhem-xau-xi-mot-thoi-cua-my-nhan-viet.jpg'}}
        />
        <View style={styles.viewDetail}>
          <Text style={styles.titleProduct} numberOfLines={2}>name</Text>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="dollar" size={15} color={Colors.primary} />
            </View>
            <Text style={styles.titlePriceNow}>
              highestBidder
            </Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="hourglass-half" size={15} color={Colors.primary} />
            </View>
            <Text style={styles.titleTime}>timeLeft</Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="legal" size={15} color={Colors.primary} />
            </View>
            <View style={styles.viewPriceBid}>
              <Text style={styles.titlePriceNext}>
              highestBidder
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAuctionTab1)
