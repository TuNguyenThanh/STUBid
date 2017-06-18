import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'
import ProductActions from '../Redux/ProductRedux'
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
      moneyReceivingAddress: '',
      productReturningAddress: '',

      openModalTime: false,
      timeSelected: 48,
      dataTime: [ 12, 24, 48, 72],

      openModalPayment: false,
      paymentMethodSeleted: {id: 1, name: 'SBid'},
      dataPayment: [{id: 1, name: 'SBid'}, {id: 2, name: 'Banking'}, {id: 3, name: 'Buu dien'}],

      openModalDeposit: false,
      depositMethodSeleted: {id: 1, name: 'SBid'},
      dataDeposit: [{id: 1, name: 'SBid'}, {id: 2, name: 'Buu dien'}],

      openModalMembership: false,
      membershipSeleted: {id: 1, name: 'Tat ca'},
      dataMembership: [{id: 1, name: 'Tat ca'}, {id: 2, name: 'premium'}]
    };
    this.isUploadProduct = false;
  }

  componentWillReceiveProps(nextProps) {
    const { language } = this.props;
    const { fetching, error, uploadSuccess } = nextProps.productState;

    if(!fetching && this.isUploadProduct && uploadSuccess) {
      Alert.alert(
        I18n.t('upload', {locale: language}),
        I18n.t('success', {locale: language}),
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {
            NavigationActions.tabbar({ type: 'reset' });
          }},
        ],
        { cancelable: false }
      );
      this.isUploadProduct = false;
    }

    //error
    if(!fetching && error) {
      Alert.alert(
        I18n.t('error', {locale: this.props.language}),
        error,
        [
          {text: I18n.t('ok', {locale: language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
    }
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

          {
            this.state.paymentMethodSeleted.id != '1' &&
            <Input
              title={'moneyReceivingAddress'}
              placeholder={'moneyReceivingAddress'}
              value={this.state.moneyReceivingAddress}
              onChangeText={(moneyReceivingAddress) => this.setState({moneyReceivingAddress})}
            />
          }

          <ButtonChoose
            title={I18n.t('consignment', {locale: language})}
            item={this.state.depositMethodSeleted}
            nameIcon={'gift'}
            onPress={() => this.setState({openModalDeposit: true})}
          />

          {
            this.state.depositMethodSeleted.id != '1' &&
            <Input
              title={'productReturningAddress'}
              placeholder={'productReturningAddress'}
              value={this.state.productReturningAddress}
              onChangeText={(productReturningAddress) => this.setState({productReturningAddress})}
            />
          }

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
    const { priceBid, timeSelected, paymentMethodSeleted, depositMethodSeleted, membershipSeleted, moneyReceivingAddress, productReturningAddress } = this.state;
    const token = this.props.login.user.token;

    const product = {
      productName: this.props.step1.productName,
      description: this.props.step1.productDescription,
      categoryId: this.props.step1.categorySelected.categoryId,
      startPrice: this.props.step1.productStartPrice.replace(/\./g, ''),
      ceilingPrice: this.props.step1.productCeilPrice.replace(/\./g, ''),
      duration: timeSelected,
      bidIncreasement: priceBid.replace(/\./g, ''),
      productReturningAddress: productReturningAddress,
      moneyReceivingBankRefId: this.props.login.user.bankRef ? this.props.login.user.bankRef.bankRefId : '',
      moneyReceivingAddress: moneyReceivingAddress,
      allowedUserLevel: membershipSeleted.id,
      image: this.props.step1.arrImageChoose
    };

    this.props.uploadProduct(token, product);
    this.isUploadProduct = true;
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    login: state.login,
    productState: state.product,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadProduct: (token, product) => dispatch(ProductActions.uploadProductRequest(token, product)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadProduct)
