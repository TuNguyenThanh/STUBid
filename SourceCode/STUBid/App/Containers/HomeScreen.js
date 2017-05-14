import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, Animated, ListView } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Modal from '../Components/Modal'
// Styles
import styles from './Styles/HomeScreenStyle'
import { Images, Colors } from '../Themes'
import Header from '../Components/Header'

//I18n
import I18n from 'react-native-i18n'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModalCategory: false,
      categorySelected: 'all',
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      dataSourceCategory: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      badge: 0,
    };
  }

  componentWillMount() {
    this.animated = new Animated.Value(0);
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(['row 1', 'row 2', 'row 3', 'row 4', 'row 1', 'row 2', 'row 3', 'row 4','row 4']),
      dataSourceCategory: this.state.dataSourceCategory.cloneWithRows(['all', 'vehicles', 'mobile', 'laptop', 'houseware', 'dtationery', 'document']),
    });
  }

  renderItem(item, rowID) {
    const { language } = this.props;
    return (
      <TouchableOpacity style={styles.row} onPress={() => NavigationActions.detailProductScreen({ title: 'Máy tính xách tay HP'})}>
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
        <TouchableOpacity style={styles.btnAuction} onPress={() => {}} >
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
            <TouchableOpacity>
              <Icon name="pencil" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <TouchableOpacity style={styles.viewCategory} onPress={() => this.setState({openModalCategory: true})}>
          <Text style={styles.textCategory}>{I18n.t('category', {locale: language})}</Text>
          <Icon name="angle-right" size={20} color={Colors.primary} />
        </TouchableOpacity>

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
        { this.renderModalCategory()}
      </View>
    )
  }

  renderModalCategory() {
    const { language } = this.props;
    return(
      <Modal
        open={this.state.openModalCategory}
        offset={0}
        overlayBackground={'rgba(0, 0, 0, 0.75)'}
        animationDuration={200}
        animationTension={40}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={() => this.setState({openModalCategory: false})}
        closeOnTouchOutside={true}
        containerStyle={{
          justifyContent: 'center',
        }}
        modalStyle={{
          borderRadius: 2,
          margin: 20,
          padding: 10,
          backgroundColor: '#F5F5F5',
          alignItems: 'center'
        }}
      >
        <View style={styles.viewIcon}>
          <Icon name="list-alt" size={30} color={Colors.primary} />
        </View>
        <Text style={styles.titleModalCategory}>{I18n.t('chooseCategory', {locale: language})}</Text>
        <ListView
          enableEmptySections
          dataSource={this.state.dataSourceCategory}
          renderRow={this.renderRowCategory.bind(this)}
          contentContainerStyle={styles.listViewCategory}
        />
      </Modal>
    );
  }

  handleCategoryItem(item) {
    this.setState({
      openModalCategory: false,
      categorySelected: item
    })
  }

  renderRowCategory(item) {
    const { language } = this.props;
    return(
      <TouchableOpacity style={styles.rowCategory} onPress={this.handleCategoryItem.bind(this, item)}>
        <Text>{I18n.t(item, {locale: language})}</Text>
      </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)
