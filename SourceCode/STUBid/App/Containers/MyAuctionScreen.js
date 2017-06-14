import React from 'react'
import { View, Text } from 'react-native'
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
          {
            this.state.data.length == 0 ?
            this.renderEmptyAuction() :
            this.renderMyAuction()
          }
        </View>
      </View>
    )
  }

  renderMyAuction() {
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Bạn không có cuộc đấu giá nào cả</Text>
      </View>
    );
  }

  renderEmptyAuction() {
    const { language } = this.props;
    return(
      <View style={styles.contentEmpty}>
        <Icon name="legal" size={70} color={Colors.primary} />
        <Text>{I18n.t('emptyAuctions', {locale: language})}</Text>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAuction)
