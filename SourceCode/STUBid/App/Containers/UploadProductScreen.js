import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import ProductActions from '../Redux/ProductRedux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import ButtonChoose from '../Components/ButtonChoose'
import Input from '../Components/Input'
import ModalList from '../Components/ModalList'
import ModalUpload from '../Components/ModalUpload'
import Icon from 'react-native-vector-icons/FontAwesome'
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
// Styles
import styles from './Styles/UploadProductScreenStyle'
import { Colors } from '../Themes/'

//I18n
import I18n from 'react-native-i18n'

class UploadProduct extends React.Component {
  constructor(props) {
    super(props);
    const { language } = this.props;
    this.state = {
      priceBid: '',
      moneyReceivingAddress: '',
      productReturningAddress: '',

      openModalTime: false,
      timeSelected: 12,
      dataTime: [ 12, 24, 48, 72, 96, 120, 144, 168],

      openModalPayment: false,
      paymentMethodSeleted: {id: 1, name: 'SBid'},
      dataPayment: [{id: 1, name: 'SBid'}, {id: 2, name: I18n.t('banking', {locale: language})}, {id: 3, name: I18n.t('postOffice', {locale: language})}],

      openModalDeposit: false,
      depositMethodSeleted: {id: 1, name: 'SBid'},
      dataDeposit: [{id: 1, name: 'SBid'}, {id: 2, name: I18n.t('postOffice', {locale: language})}],

      openModalMembership: false,
      membershipSeleted: {id: 1, name: I18n.t('all', {locale: language})},
      dataMembership: [{id: 1, name: I18n.t('all', {locale: language})}, {id: 2, name: 'Premium'}],

      isOpenChooseAddress: false,
      isOpenChooseConsignmentAddress: false,
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
    const { fetching } = this.props.productState;
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >

          <Input
            type={'money'}
            title={I18n.t('amountPerABid', {locale: language}) + ' *'}
            placeholder={'VND'}
            keyboardType={'numeric'}
            value={this.state.priceBid}
            onChangeText={(priceBid) => this.handlePriceBid(priceBid)}
          />

          <ButtonChoose
            title={I18n.t('auctionTime', {locale: language})}
            item={this.state.timeSelected + ' ' + I18n.t('hour', {locale: language})}
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
            this.state.paymentMethodSeleted.id == '3' &&
            <Input
              action={'onPress'}
              onPress={() => this.handleChooseReceivingAddress()}
              title={I18n.t('moneyReceivingAddress', {locale: language}) + ' *'}
              placeholder={I18n.t('moneyReceivingAddress', {locale: language})}
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
              action={'onPress'}
              onPress={() => this.handleChooseConsignmentAddress()}
              title={I18n.t('consignmentAddress', {locale: language}) + ' *'}
              placeholder={I18n.t('consignmentAddress', {locale: language})}
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

          <View style={styles.viewNote}>
            <Text style={styles.textNote}>{I18n.t('termsOf', {locale: language})}</Text>
            <Text style={styles.textFontStyle}>
              {I18n.t('note1', {locale: language})}
            </Text>
            <Text style={styles.textFontStyle}>
              {I18n.t('note2', {locale: language})}
            </Text>
          </View>

        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={() => this.handleUploadProduct()}>
          <Text style={styles.textButton}>{I18n.t('upload', {locale: language})}</Text>
        </TouchableOpacity>
        { this.renderModalTime() }
        { this.renderModalPaymentMethod() }
        { this.renderModalDepositMethod() }
        { this.renderModalMembership() }
        { this.renderChooseMoneyReceiving() }
        { this.renderChooseConsignment() }
        { fetching && <ModalUpload /> }
      </View>
    )
  }

  handleChooseConsignmentAddress() {
    this.setState({
      isOpenChooseConsignmentAddress: true
    });
  }

  handleChooseReceivingAddress() {
    this.setState({
      isOpenChooseAddress: true
    });
  }

  renderChooseConsignment() {
    const { language } = this.props;
    if(this.state.isOpenChooseConsignmentAddress) {
      return (
        <TouchableWithoutFeedback onPress={() => this.setState({ isOpenChooseConsignmentAddress: false })}>
          <View style={styles.modalAddress}>
            <GooglePlacesAutocomplete
              placeholder={I18n.t('enterAddress', {locale: language})}
              minLength={2}
              autoFocus
              returnKeyType={'default'}
              fetchDetails={true}
              styles={{
                textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth:0,
                },
                textInput: {
                  marginLeft: 10,
                  marginRight: 10,
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16
                },
                description: {
                  color: '#FFF'
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                },
              }}
              //currentLocation={true}
              //currentLocationLabel={I18n.t('locationAround', {locale: language})}
              query={{
                //available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyC_1pZ7TY6wPQhhih430NpNZeqtAfREf1g',
                language: 'vi', // language of the results
                types: 'geocode', // default: 'geocode'
              }}
              debounce={200}
              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_1', 'administrative_area_level_3']}
              onPress={(data, details = null) => {
                this.setState({
                  productReturningAddress: data.description,
                  isOpenChooseConsignmentAddress: false
                });
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }

  renderChooseMoneyReceiving() {
    const { language } = this.props;
    if(this.state.isOpenChooseAddress) {
      return (
        <TouchableWithoutFeedback onPress={() => this.setState({ isOpenChooseAddress: false })}>
          <View style={styles.modalAddress}>
            <GooglePlacesAutocomplete
              placeholder={I18n.t('enterAddress', {locale: language})}
              minLength={2}
              autoFocus
              returnKeyType={'default'}
              fetchDetails={true}
              styles={{
                textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth:0,
                },
                textInput: {
                  marginLeft: 10,
                  marginRight: 10,
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16
                },
                description: {
                  color: '#FFF'
                },
                predefinedPlacesDescription: {
                  color: '#1faadb'
                },
              }}
              //currentLocation={true}
              //currentLocationLabel={I18n.t('locationAround', {locale: language})}
              query={{
                //available options: https://developers.google.com/places/web-service/autocomplete
                key: 'AIzaSyC_1pZ7TY6wPQhhih430NpNZeqtAfREf1g',
                language: 'vi', // language of the results
                types: 'geocode', // default: 'geocode'
              }}
              debounce={200}
              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_1', 'administrative_area_level_3']}
              onPress={(data, details = null) => {
                this.setState({
                  moneyReceivingAddress: data.description,
                  isOpenChooseAddress: false
                });
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }

  renderModalTime() {
    const { language } = this.props;
    return(
      <ModalList
        textItem={I18n.t('hour', {locale: language})}
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
    const { language } = this.props;
    const { priceBid, timeSelected, paymentMethodSeleted, depositMethodSeleted, membershipSeleted, moneyReceivingAddress, productReturningAddress } = this.state;
    const token = this.props.login.user.token;
    const upCeilPrice =  parseInt(this.props.step1.productCeilPrice.replace(/\./g, ''));
    const upStartPrice =  parseInt(this.props.step1.productStartPrice.replace(/\./g, ''));
    const upBidPrice =  parseInt(priceBid.replace(/\./g, ''));

    const product = {
      productName: this.props.step1.productName,
      description: this.props.step1.productDescription,
      categoryId: this.props.step1.categorySelected.categoryId,
      startPrice: upStartPrice,
      ceilingPrice: upCeilPrice,
      duration: timeSelected,
      bidIncreasement: upBidPrice,
      productReturningAddress: productReturningAddress,
      moneyReceivingBankRefId: this.props.login.user.bankRef ? this.props.login.user.bankRef.bankRefId : '',
      moneyReceivingAddress: moneyReceivingAddress,
      allowedUserLevel: membershipSeleted.id,
      image: this.props.step1.arrImageChoose
    };

    //thieu paymentMethodSeleted
    if(priceBid == '') {
        this.message(I18n.t('pleaseEnterAmountPerABid', {locale: language}));
    } else {
      const temp = (parseInt(this.props.step1.productCeilPrice.replace(/\./g, '')) - parseInt(this.props.step1.productStartPrice.replace(/\./g, ''))) / parseInt(priceBid.replace(/\./g, ''));
      if(temp < 5){
        this.message(I18n.t('theBidAmountMustBeAtLeastx5CeilingPrice', {locale: language}));
      } else {
        if(paymentMethodSeleted.id === 3) {
          if(moneyReceivingAddress == '') {
            this.message(I18n.t('pleaseEnterAnAddress', {locale: language}));
            return;
          }
        }

        if(depositMethodSeleted.id === 2) {
          if(productReturningAddress == '') {
            this.message(I18n.t('pleaseEnterAnAddress', {locale: language}));
            return;
          }
        }

        this.props.uploadProduct(token, product);
        this.isUploadProduct = true;
      }
    }
  }

  message(mess) {
    const { language } = this.props;
    Alert.alert(
      I18n.t('error', {locale: language}),
      mess,
      [
        {text: I18n.t('ok', {locale: language}), onPress: () => {}},
      ],
      { cancelable: false }
    );
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
