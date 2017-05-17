import React from 'react'
import { View, Text, Animated, TouchableOpacity, Image, TextInput, ListView } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'
import ModalCategory from '../Components/ModalCategory'

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
      categorySelected: 'all',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }

  componentWillMount() {
    this.animated = new Animated.Value(0);
  }

  componentDidMount() {
    const { language } = this.props;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(['row 1', 'row 2', 'row 3', 'row 4', 'row 1', 'row 2', 'row 3', 'row 4','row 4']),
      data: ['all', 'vehicles', 'mobile', 'houseware', 'dtationery', 'document'],
    });
  }

  renderItem(rowData, rowID) {
    return(
      <TouchableOpacity style={styles.row} onPress={() => NavigationActions.detailProductScreen({ title: 'May tinh HP'})}>
        <Image
          style={{flex: 1}}
          source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Macbook_Pro_PSD.png'}}
          resizeMode="contain"
        />

        <View style={styles.viewDetail}>
          <Text style={styles.titleProduct} numberOfLines={2} >May tinh xach tay HP nadg jhfwh hwefb frfg rv v  </Text>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="dollar" size={15} color={Colors.primary} />
            </View>
            <Text style={styles.titlePriceNow}>2.500.000</Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="hourglass-half" size={15} color={Colors.primary} />
            </View>
            <Text style={styles.titleTime}>19:45:00</Text>
          </View>
          <View style={styles.viewTemp}>
            <View style={styles.iconStyle}>
              <Icon name="legal" size={15} color={Colors.primary} />
            </View>
            <View style={styles.viewPriceBid}>
              <Text style={styles.titlePriceNext}>2.600.000</Text>
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
              <Animated.Text style={[styles.title, titleStyle]}>{I18n.t(this.state.categorySelected, {locale: language})}</Animated.Text>
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
            returnKeyType={'search'}
            onSubmitEditing={() => alert('search')}
          />
          <TouchableOpacity>
            <Icon name="search" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

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
        onPressItem={(item) => this.setState({ openModalCategory: false, categorySelected: item }) }
      />
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Search)
