import React from 'react'
import { ScrollView, View, Text, ListView, TouchableOpacity   } from 'react-native'
import { connect } from 'react-redux'
import ImageLoad from 'react-native-image-placeholder'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'

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
  }

  componentDidMount() {
    this.setState({
      dataSourceHandling: this.state.dataSourceHandling.cloneWithRows([1,2,3,4,5,6]),
      dataSourceProcessed: this.state.dataSourceProcessed.cloneWithRows([1,2,3,4,5,6]),
    });
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
            renderRow={(rowData, sectionID, rowID) => this.renderItem(rowData, rowID)}
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
            renderRow={(rowData, sectionID, rowID) => this.renderItem(rowData, rowID)}
            scrollEventThrottle={16}
          />
        </View>
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAuctionTab2)
