import React from 'react'
import { View, Text, Animated, TouchableOpacity, Image, TextInput, ListView, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import SearchActions from '../Redux/SearchRedux'
import AuctionsActions from '../Redux/AuctionsRedux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'
import ModalCategory from '../Components/ModalCategory'
import ImageLoad from 'react-native-image-placeholder'
import Highlighter from 'react-native-highlight-words'
import latinize from 'latinize'
import { searchAuctions } from '../Helper/SocketIO'

// Styles
import styles from './Styles/SearchScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalCategory: false,
      categorySelected: { categoryId: -1, name: 'all' },
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      keySearch: '',
    };
    this.loadCategory = true;
  }

  componentWillMount() {
    this.animated = new Animated.Value(0);
  }

  componentDidMount() {
    const { categoryProduct } = this.props.category;
    if(categoryProduct && this.loadCategory) {
      this.setState({
        data: categoryProduct,
      });
      this.loadCategory = false;
    }

    searchAuctions.setServerSendSearchHandler((data) => {
      this.props.searchAuctions(data);
    }, this.state.categorySelected.categoryId, '');
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    const { fetching, error, searchAuctions } = nextProps.auctions;
    if(!fetching && searchAuctions) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(searchAuctions),
      });
    }

    // if(categoryProduct && this.loadCategory) {
    //   const categoryProductNew = [{categoryId: -1, name: 'all'}].concat(categoryProduct);
    //   this.setState({
    //     data: categoryProductNew,
    //   });
    //   this.loadCategory = false;
    // }

    //error - not internet
    // if(!fetching && error){
    //   Alert.alert(
    //     'Error',
    //     error,
    //     [
    //       {text: I18n.t('ok', {locale: language}), onPress: () => {}},
    //     ],
    //     { cancelable: false }
    //   )
    // }
  }

  renderItem(item, rowID) {
    return(
      <TouchableOpacity style={styles.row} onPress={() => NavigationActions.detailProductScreen({ title: item.product.name, data: item, rowID: rowID, screen: 'SEARCH', screen: 'SEARCH_SCREEN' })}>
        {
          item.product.images ?
          <ImageLoad
            style={styles.imgStyle}
            placeholderStyle={{ flex: 1, resizeMode: 'center'}}
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
          <Highlighter
            style={styles.titleProduct}
            numberOfLines={2}
            highlightStyle={{ color: '#F00' }}
            searchWords={[this.state.keySearch]}
            textToHighlight={item.product.name}
            sanitize={latinize}
          />
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
            <Text style={styles.titleTime}>{item.timeLeft}</Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="legal" size={15} color={Colors.primary} />
            </View>
            <View style={styles.viewPriceBid}>
              <Text style={styles.titlePriceNext}>
              {
                item.highestBidder ?
                (item.highestBidder.price + item.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') :
                (item.startPrice + item.bidIncreasement).toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')
              }
              </Text>
            </View>
          </View>
        </View>
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

    const { fetching } = this.props.auctions;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerStyle}>
          <View style={styles.centerHeader}>
            <Animated.Image
              style={imageStyle}
              source={Images.logo}
              resizeMode={'contain'}
            ></Animated.Image>
            <TouchableOpacity onPress={() => this.setState({openModalCategory: true})}>
              <Animated.Text style={[styles.title, titleStyle]}>{I18n.t(this.state.categorySelected.name, {locale: language})}</Animated.Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.viewSearch}>
          <TextInput
            style={styles.inputStyle}
            underlineColorAndroid={'transparent'}
            autoCapitalize={'none'}
            autoCorrect={false}
            placeholder={I18n.t('search', {locale: language})}
            onChangeText={(keySearch) => this.handleSearch(keySearch)}
            value={this.state.keySearch}
          />
          <TouchableOpacity>
            <Icon name="search" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

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
            style={styles.listviewStyle}
            enableEmptySections
            dataSource={this.state.dataSource}
            renderRow={(rowData, sectionID, rowID) => this.renderItem(rowData, rowID)}
            scrollEventThrottle={16}
            onScroll={
              Animated.event([
                { nativeEvent: { contentOffset: { y: this.animated }}}
              ])
            }
          />
        }
        { this.renderModalCategory()}
      </View>
    )
  }

  handleSearch(keySearch) {
    searchAuctions.emitKeySearch(latinize(keySearch));
    this.setState({ keySearch });
  }

  renderModalCategory() {
    return(
      <ModalCategory
        title={'chooseCategory'}
        open={this.state.openModalCategory}
        modalDidClose={() => this.setState({ openModalCategory: false })}
        data={this.state.data}
        onPressItem={(item) => {
          searchAuctions.emitCategory(item.categoryId);
          this.setState({ openModalCategory: false, categorySelected: item });
        }}
      />
    );
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    category: state.category,
    auctions: state.auctions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    searchAuctions: (data) => dispatch(AuctionsActions.searchAuctions(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
