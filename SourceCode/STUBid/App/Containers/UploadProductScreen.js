import React from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import ButtonChoose from '../Components/ButtonChoose'
import Input from '../Components/Input'
import ModalList from '../Components/ModalList'
import Icon from 'react-native-vector-icons/FontAwesome'

// Styles
import styles from './Styles/UploadProductScreenStyle'
import { Colors } from '../Themes/'

//I18n
import I18n from 'react-native-i18n'

class UploadProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceBid: '',

      openModalTime: false,
      timeSelected: '48',
      dataTime: [12, 24, 48, 72],

      openModalPayment: false,
      paymentMethodSeleted: 'SBid',
      dataPayment: ['SBid', 'Banking', 'Buu dien'],

      openModalDeposit: false,
      depositMethodSeleted: 'SBid',
      dataDeposit: ['Den SBid', 'Buu dien', 'Dich vu'],

      openModalMembership: false,
      membershipSeleted: 'Tat ca',
      dataMembership: ['Tat ca', 'premium']
    };
  }

  handlePriceBid(text) {
    text = text.replace(/\./g, '');
    text = text.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.setState({ priceBid: text });
  }

  render () {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} scrollEnabled={false} >

          <Input
            title={I18n.t('amountPerABid', {locale: language})}
            placeholder={'VND'}
            keyboardType={'numeric'}
            value={this.state.priceBid}
            onChangeText={(priceBid) => this.handlePriceBid(priceBid)}
          />

          <ButtonChoose
            title={I18n.t('auctionTime', {locale: language})}
            item={this.state.timeSelected + ' hour'}
            nameIcon={'clock-o'}
            onPress={() => this.setState({openModalTime: true})}
          />

          <ButtonChoose
            title={I18n.t('formOfTransaction', {locale: language})}
            item={this.state.paymentMethodSeleted}
            nameIcon={'handshake-o'}
            onPress={() => this.setState({openModalPayment: true})}
          />

          <ButtonChoose
            title={I18n.t('consignment', {locale: language})}
            item={this.state.depositMethodSeleted}
            nameIcon={'gift'}
            onPress={() => this.setState({openModalDeposit: true})}
          />

          <ButtonChoose
            title={I18n.t('participants', {locale: language})}
            item={this.state.membershipSeleted}
            nameIcon={'users'}
            onPress={() => this.setState({openModalMembership: true})}
          />


        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => this.handleUploadProduct()}>
          <Text style={styles.textButton}>{I18n.t('upload', {locale: language})}</Text>
        </TouchableOpacity>
        { this.renderModalTime() }
        { this.renderModalPaymentMethod() }
        { this.renderModalDepositMethod() }
        { this.renderModalMembership() }
      </View>
    )
  }

  renderModalTime() {
    const { language } = this.props;
    return(
      <ModalList
        logo={<Icon name="clock-o" size={30} color={Colors.primary} />}
        title={I18n.t('auctionTime', {locale: language})}
        open={this.state.openModalTime}
        modalDidClose={() => this.setState({ openModalTime: false })}
        data={this.state.dataTime}
        onPressItem={(item) => this.setState({ openModalTime: false, timeSelected: item }) }
      />
    );
  }

  renderModalPaymentMethod() {
    const { language } = this.props;
    return(
      <ModalList
        logo={<Icon name="handshake-o" size={30} color={Colors.primary} />}
        title={I18n.t('formOfTransaction', {locale: language})}
        open={this.state.openModalPayment}
        modalDidClose={() => this.setState({ openModalPayment: false })}
        data={this.state.dataPayment}
        onPressItem={(item) => this.setState({ openModalPayment: false, paymentMethodSeleted: item }) }
      />
    );
  }

  renderModalDepositMethod() {
    const { language } = this.props;
    return(
      <ModalList
        logo={<Icon name="gift" size={30} color={Colors.primary} />}
        title={I18n.t('consignment', {locale: language})}
        open={this.state.openModalDeposit}
        modalDidClose={() => this.setState({ openModalDeposit: false })}
        data={this.state.dataDeposit}
        onPressItem={(item) => this.setState({ openModalDeposit: false, depositMethodSeleted: item }) }
      />
    );
  }

  renderModalMembership() {
    const { language } = this.props;
    return(
      <ModalList
        logo={<Icon name="users" size={30} color={Colors.primary} />}
        title={I18n.t('participants', {locale: language})}
        open={this.state.openModalMembership}
        modalDidClose={() => this.setState({ openModalMembership: false })}
        data={this.state.dataMembership}
        onPressItem={(item) => this.setState({ openModalMembership: false, membershipSeleted: item }) }
      />
    );
  }

  handleUploadProduct() {
    NavigationActions.tabbar({ type: 'reset' });
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

export default connect(mapStateToProps, mapDispatchToProps)(UploadProduct)
