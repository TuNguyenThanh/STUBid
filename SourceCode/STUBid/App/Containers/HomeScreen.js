import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, Animated, ListView } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/HomeScreenStyle'
import { Images } from '../Themes'
import Header from '../Components/Header'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }

  componentWillMount() {
    this.animated = new Animated.Value(0);
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(['row 1', 'row 2', 'row 3', 'row 4', 'row 1', 'row 2', 'row 3', 'row 4']),
    });
  }

  renderItem(item, rowID) {
    return (
      <TouchableOpacity style={styles.row}>
        <Image
          style={styles.imageProduct}
          resizeMode="contain"
          source={{uri: 'http://sivitech.com/media/news/1502_HP-ENVY-17-s030nr-17-Inch-Notebook-e1483359950791.jpg'}}
        />
        <Text style={styles.textProduct} numberOfLines={2}>Máy tính xách tay HP</Text>
        <View style={styles.viewItem}>
          <Text style={styles.textPriceNow}>2.000.000</Text>
        </View>
        <View style={styles.viewItem}>
          <Image
            style={styles.icon}
            source={Images.hourglass}
          />
          <Text>44:06:46</Text>
        </View>
        <View style={styles.bid}>
          <Text>2.500.000</Text>
        </View>
        <TouchableOpacity
          style={styles.btnAuction}
          onPress={() => {}}
        >
          <Text style={styles.textAuction}>Đấu giá</Text>
        </TouchableOpacity>

      </TouchableOpacity>
    );
  }

  render () {
    const hideImage = this.animated.interpolate({
      inputRange: [0, 250],
      outputRange: [40, 0],
      extrapolate: "clamp",
    });
    const imageStyle = {
      width: 90,
      height: hideImage,
    };

    const fontInterpolate = this.animated.interpolate({
      inputRange: [0, 250],
      outputRange: [18, 25],
      extrapolate: 'clamp'
    });
    const titleStyle = {
      fontSize: fontInterpolate
    };

    const hidenCategory = this.animated.interpolate({
      inputRange: [0, 250],
      outputRange: [40, 0],
      extrapolate: 'clamp'
    });
    const categoryStyle = {
      height: hidenCategory
    }

    const menuInterpolate = this.animated.interpolate({
      inputRange: [0, 250],
      outputRange: [0, 10],
      extrapolate: 'clamp'
    });
    const menuStyle = {
      paddingTop: menuInterpolate
    }

    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerStyle}>
          <Animated.View style={[styles.iconStyle, menuStyle]}>
            <TouchableOpacity>
              <Image source={Images.menu} />
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.centerHeader}>
            <Animated.Image
              style={imageStyle}
              source={Images.logo}
              resizeMode={'contain'}
            ></Animated.Image>
            <Animated.Text style={[styles.title, titleStyle]}>sBid</Animated.Text>
          </View>

          <Animated.View style={[styles.iconStyle, menuStyle]}>
            <TouchableOpacity>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.viewCategory}>
          <Text style={styles.textCategory}>Category</Text>
          <Image source={Images.down} />
        </View>

        <ListView
          style={styles.content}
          scrollEventThrottle={16}
          onScroll={
            Animated.event([
              { nativeEvent: { contentOffset: { y: this.animated }}}
            ])
          }
          enableEmptySections
          contentContainerStyle={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => this.renderItem(rowData, rowID)}
        />

      </View>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)
