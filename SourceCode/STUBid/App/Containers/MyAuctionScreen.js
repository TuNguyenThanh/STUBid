import React from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import Header from '../Components/Header'

// Styles
import styles from './Styles/MyAuctionScreenStyle'

//I18n
import I18n from 'react-native-i18n'

class MyAuction extends React.Component {
  constructor(props){
    super(props);
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
        <View style={{ flex: 1, marginTop: 15}}>
          <Text>My Auction Screen</Text>
        </View>
      </View>
    )
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
