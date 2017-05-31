import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, Animated, ListView, ActivityIndicator, Alert, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import AuctionsActions from '../Redux/AuctionsRedux'
import CategoryActions from '../Redux/CategoryRedux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Header from '../Components/Header'
import ModalCategory from '../Components/ModalCategory'
import ImageLoad from 'react-native-image-placeholder'
import IO from 'socket.io-client/dist/socket.io'

// Styles
import styles from './Styles/HomeScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalCategory: false,
      categorySelected: { categoryId: -1, name: 'all' },
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      data: [],
      badge: 0,
      isOpen: false
    };
    this.loadCategory = false;
    this.clickBid = false;
  }

  componentWillMount() {
    try {
      AsyncStorage.getItem('loginToken').then((token) => {
        console.log(token);
      });
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }

    this.animated = new Animated.Value(0);

    //get data auctions
    this.props.getAuctions(1);

    //get data category
    this.props.getProductCategory();
    this.loadCategory = true;
  }

  componentDidMount() {
    // const socket = IO('https://sbid.herokuapp.com/');
    // socket.on('SERVER-SEND-AUCTIONS', (data) => {
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(data),
    //   });
    // });
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    const { fetching, error, data } = nextProps.auctions;
    const { categoryProduct } = nextProps.category;
    const fetchingCategory = nextProps.category.fetching;
    if(!fetching && data) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
      });
    }

    if(!fetchingCategory && categoryProduct && this.loadCategory) {
      const categoryProductNew = [{categoryId: -1, name: 'all'}].concat(categoryProduct);
      this.setState({
        data: categoryProductNew,
      });
      this.loadCategory = false;
    }

    //error - not internet
    if(!fetching && error){
      Alert.alert(
        'Error',
        error,
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      )
    }
  }

  handleBid(data) {
    this.clickBid = true;
    //auctionId, accountId, priceBid
    const { language } = this.props;
    let price = data.highestBidder ? data.highestBidder.price : data.startPrice ;
    price += data.bidIncreasement;

    const auctionId = data.auctionId;

    if(this.clickBid) {
      //check highestBidder id auctions
      const highestBidder = data.highestBidder;
      if(highestBidder.accountId == 3) {
        Alert.alert(
          data.product.name,
          I18n.t('youAreHighestBidder', {locale: language}),
          [
            {text: I18n.t('ok', {locale: language}), onPress: () => {}, style: 'cancel'},
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          data.product.name,
          I18n.t('yesBid', {locale: language})+ ' ' + price.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.'),
          [
            {text: I18n.t('later', {locale: language}), onPress: () => {}, style: 'cancel'},
            {text: I18n.t('bid', {locale: language}), onPress: () => {
              //bid product
              this.props.bibProduct(auctionId, 3, price);
            }},
          ],
          { cancelable: false }
        );
      }

      this.clickBid = false;
    }
  }

  renderItem(item, rowID) {
    const { language } = this.props;
    return (
      <TouchableOpacity style={styles.row} onPress={() => NavigationActions.detailProductScreen({ title: item.product.name, data: item, rowID: rowID })}>
        <ImageLoad
          style={styles.imageProduct}
          placeholderStyle={{ flex: 1, resizeMode: 'center'}}
          loadingStyle={{ size: 'small', color: 'blue' }}
          resizeMode="contain"
          source={{uri: item.product.images[0].url}}
        />
        <Text style={[styles.textProduct, { height: 40 }]} numberOfLines={2}>{item.product.name}</Text>
        <View style={styles.viewItem}>
          <Text style={styles.textPriceNow}>
          {
            item.highestBidder ?
            item.highestBidder.price.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') :
            item.startPrice.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
          }
          </Text>
        </View>
        <View style={styles.viewItem}>
          <Image
            style={styles.icon}
            source={Images.hourglass}
          />
          <Text>{item.timeLeft}</Text>
        </View>
        <View style={styles.bid}>
          <Text>
          {
            item.highestBidder ?
            (item.highestBidder.price + item.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') :
            (item.startPrice + item.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
          }
          </Text>
        </View>
        <TouchableOpacity style={styles.btnAuction} onPress={() => this.handleBid(item)} >
          <Text style={styles.textAuction}>{I18n.t('bid', {locale: language})}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  render () {
    const { language } = this.props;
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

    const borderCategory = this.animated.interpolate({
      inputRange: [0, 250],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    const categoryStyle = {
      height: hidenCategory,
      borderWidth: borderCategory
    }

    const menuInterpolate = this.animated.interpolate({
      inputRange: [0, 250],
      outputRange: [0, 10],
      extrapolate: 'clamp'
    });
    const menuStyle = {
      paddingTop: menuInterpolate
    }

    const { fetching } = this.props.auctions;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerStyle}>
          <Animated.View style={[styles.iconStyle, menuStyle, {flexDirection: 'row'}]}>
            <Icon name="bell" size={20} color={Colors.primary} />
            {
              this.state.badge != 0 &&
              <View style={{paddingLeft: 5, paddingRight: 5, backgroundColor: Colors.primary, borderRadius: 10}}>
                <Text style={{ color: '#FFF' }}>{this.state.badge}</Text>
              </View>
            }
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
            <TouchableOpacity onPress={() => NavigationActions.uploadProductNextScreen()}>
              <Icon name="pencil" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <TouchableOpacity style={styles.viewCategory} onPress={() => this.setState({openModalCategory: true})}>
          <Text style={styles.textCategory}>{I18n.t('category', {locale: language})}: {I18n.t(this.state.categorySelected.name, {locale: language})}</Text>
          <Icon name="list-alt" size={20} color={Colors.primary} />
        </TouchableOpacity>

        { fetching ?
          <View style={styles.viewLoading}>
            <ActivityIndicator
              animating={fetching}
              style={{height: 80}}
              size="large"
            />
          </View>
          :
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
        }
        { this.renderModalCategory()}
      </View>
    )
  }

  renderModalCategory() {
    return(
      <ModalCategory
        title={'chooseCategory'}
        open={this.state.openModalCategory}
        modalDidClose={() => this.setState({ openModalCategory: false })}
        data={this.state.data}
        onPressItem={(item) => this.setState({ openModalCategory: false, categorySelected: item}) }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    auctions: state.auctions,
    category: state.category,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAuctions: (page) => dispatch(AuctionsActions.auctionsRequest(page)),
    bibProduct: (auctionId, accountId, priceBid) => dispatch(AuctionsActions.bidProductRequest(auctionId, accountId, priceBid)),
    getProductCategory: () => dispatch(CategoryActions.categoryProductRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
