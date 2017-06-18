import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Header from '../Components/Header'

// Styles
import styles from './Styles/MyAuctionScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class MyAuction extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: []
    };
  }

  render() {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        <Header
          title={I18n.t('myAuction', { locale: language })}
          bgColor={'#FFF'}
          titleStyle={styles.titleStyle}
        />
        <View style={{ flex: 1 }}>
          { this.renderView() }
        </View>
      </View>
    )
  }

  renderView() {
    const { language } = this.props;
    if(this.props.login.user) {
      if(this.state.data.length == 0) {
        return(
          <View style={styles.contentEmpty}>
            <Icon name="legal" size={70} color={Colors.primary} />
            <Text>{I18n.t('emptyAuctions', {locale: language})}</Text>
          </View>
        );
      } else {
        return(
          <View style={styles.viewWrap}>
            <Text>Bạn không có cuộc đấu giá nào cả</Text>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.viewWrap}>
          <Text style={styles.titleStyle}>
            {I18n.t('PleaseLoginViewYourAuctions', {locale: language})}
          </Text>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => NavigationActions.loginScreen()}>
            <Text style={styles.buttonTextStyle}>{I18n.t('login', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    login: state.login,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAuction)
