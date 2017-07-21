import React from 'react'
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator, ListView, Platform } from 'react-native'
import { connect } from 'react-redux'
import AccountActions from '../Redux/AccountRedux'
import CategoryActions from '../Redux/CategoryRedux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-customized-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal2Choose from '../Components/Modal2Choose'
import ModalBanking from '../Components/Modal'
import ImageLoad from 'react-native-image-placeholder'

// Styles
import styles from './Styles/EditProfileScreenStyle'
import { Images, Colors, Metrics } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

var _this;
class EditProfile extends React.Component {
  constructor(props){
    super(props);
    _this = this;
    this.state = {
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      phoneNumber: this.props.user.phoneNumber,
      email: this.props.user.email,
      accountBanking: this.props.user.bankRef ? this.props.user.bankRef.bankAccountNumber : '',
      bankBrandName: this.props.user.bankRef ? this.props.user.bankRef.bankBrandName: '',
      idBankBrandSelected: this.props.user.bankRef ? this.props.user.bankRef.bankBrandId : 1,
      openModalChooseImage: false,
      openModalBanking: false,
      urlImage: this.props.user.avatar,
      dataSourceBanking: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
    console.log(this.props.user);
    this.isChange = false;
    this.isUploadAvatar = false;
    this.isLoadBankBrands = false;
  }

  componentWillMount() {
    this.props.getBankBrands();
    this.isLoadBankBrands = true;
  }

  componentWillReceiveProps(nextProps) {
    const { language } = this.props;
    const { fetching, error, editProfileSuccess, uploadAvatarSuccess } = nextProps.account;
    const fetchingBankBrands = nextProps.category.fetching;
    const listBankBrands = nextProps.category.listBankBrands;

    if(!fetchingBankBrands && listBankBrands && this.isLoadBankBrands) {
      let arrNewBankBrands = [];
      listBankBrands.map((item) => {
        let newObject;
        if(item.bankBrandName == 'ACB') {
          newObject = Object.assign({}, item, { logo: Images.acb });
        }
        if(item.bankBrandName == 'Sacombank') {
          newObject = Object.assign({}, item, { logo: Images.sacombank });
        }
        arrNewBankBrands.push(newObject);
      });
      this.setState({
        dataSourceBanking: this.state.dataSourceBanking.cloneWithRows(arrNewBankBrands),
      });
      this.isLoadBankBrands = false;
    }

    if(!fetching && editProfileSuccess && this.isChange) {
      Alert.alert(
        I18n.t('success', {locale: this.props.language}),
        '',
        [
          {text: I18n.t('ok', {locale: this.props.language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
      this.isChange = false;
    }

    if(!fetching && uploadAvatarSuccess && this.isUploadAvatar) {
      Alert.alert(
        I18n.t('success', {locale: this.props.language}),
        '',
        [
          {text: I18n.t('ok', {locale: this.props.language}), onPress: () => {}},
        ],
        { cancelable: false }
      );
      this.isUploadAvatar = false;
    }

    //error
    // if(!fetching && error && this.isLoadBankBrands) {
    //   Alert.alert(
    //     I18n.t('error', {locale: this.props.language}),
    //     I18n.t(error, {locale: this.props.language}),
    //     [
    //       {text: I18n.t('ok', {locale: language}), onPress: () => {}},
    //     ],
    //     { cancelable: false }
    //   );
    // }
  }

  handleChangeAvatar() {
    this.setState({ openModalChooseImage: true });
  }

  handleSaveProfile() {
    const { firstName, lastName, phoneNumber, email, idBankBrandSelected, accountBanking } = this.state;
    const { token } = this.props.login.user;
    if(idBankBrandSelected) {
      const bankRef = {
        bankAccountNumber: accountBanking,
        bankBrandId: idBankBrandSelected
      };
      const info = { token, firstName, lastName, phoneNumber, email, bankRef };

      this.props.editProfile(info);
      this.isChange = true;
    }
  }

  render () {
    const { language } = this.props;
    return (
      <KeyboardAwareScrollView scrollEnabled={false} resetScrollToCoords={{ x: 0, y: 0 }} >
        <View style={styles.container}>
          {/*Avatar*/}
          <View style={styles.viewImage}>
            <View style={{ flexDirection: 'row'}}>
              <Image
                style={styles.imgStyle}
                source={Images.left}
                resizeMode="contain"
              />
              <View style={styles.viewImageCenter}>
                {
                  this.state.urlImage ?
                  <ImageLoad
                    style={styles.imgStyle}
                    loadingStyle={{ size: 'small', color: 'blue' }}
                    source={{uri: this.state.urlImage}}
                    borderRadius={Metrics.screenHeight / 10}
                  />
                  :
                  <Image
                    style={[styles.imgStyle, { tintColor: Colors.primary }]}
                    source={Images.userIcon}
                  />
                }
                <TouchableOpacity style={styles.iconChooseImageStyle} onPress={() => this.handleChangeAvatar()}>
                  <Icon name="camera-retro" size={30} />
                </TouchableOpacity>
              </View>
              <Image
                style={styles.imgStyle}
                source={Images.right}
                resizeMode="contain"
              />
            </View>
          </View>

          {/*First name*/}
          <View style={styles.rowInput}>
            <View style={styles.viewNameInput}>
              <Text style={styles.textNameInput}>{I18n.t('firstName', {locale: language})}</Text>
            </View>
            <View style={styles.viewInput}>
              <TextInput
                style={styles.textinputStyle}
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='next'
                onSubmitEditing={() => this.lastName.focus()}
                value={this.state.firstName}
                onChangeText={(firstName) => this.setState({ firstName })}
              />
              <View style={styles.lineStyle} />
            </View>
          </View>

          {/*Last name*/}
          <View style={styles.rowInput}>
            <View style={styles.viewNameInput}>
              <Text style={styles.textNameInput}>{I18n.t('lastName', {locale: language})}</Text>
            </View>
            <View style={styles.viewInput}>
              <TextInput
                ref={(input) => this.lastName = input}
                style={styles.textinputStyle}
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='next'
                onSubmitEditing={() => this.phone.focus()}
                value={this.state.lastName}
                onChangeText={(lastName) => this.setState({ lastName })}
              />
              <View style={styles.lineStyle} />
            </View>
          </View>

          {/*Phone*/}
          <View style={styles.rowInput}>
            <View style={styles.viewNameInput}>
              <Icon name="mobile" size={40} />
            </View>
            <View style={styles.viewInput}>
              <TextInput
                ref={(input) => this.phone = input}
                style={styles.textinputStyle}
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='next'
                keyboardType={'numeric'}
                onSubmitEditing={() => this.email.focus()}
                value={this.state.phoneNumber}
                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
              />
              <View style={styles.lineStyle} />
            </View>
          </View>

          {/*Email*/}
          <View style={styles.rowInput}>
            <View style={styles.viewNameInput}>
              <Icon name="envelope" size={25} />
            </View>
            <View style={styles.viewInput}>
              <TextInput
                ref={(input) => this.email = input}
                style={styles.textinputStyle}
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='next'
                keyboardType={'email-address'}
                onSubmitEditing={() => this.atmCard.focus()}
                value={this.state.email}
                onChangeText={(email) => this.setState({ email })}
              />
              <View style={styles.lineStyle} />
            </View>
          </View>

          {/*Banking Number*/}
          <View style={styles.rowInput}>
            <View style={styles.viewNameInput}>
            {
              this.renderImageBankBrands(this.state.idBankBrandSelected)
            }

            </View>
            <View style={styles.viewInput}>
              <TextInput
                ref={(input) => this.atmCard = input}
                style={styles.textinputStyle}
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='done'
                keyboardType={'numeric'}
                onSubmitEditing={() => this.handleSaveProfile()}
                value={this.state.accountBanking}
                onChangeText={(accountBanking) => this.setState({ accountBanking })}
              />
              <View style={styles.lineStyle} />
            </View>
          </View>

          <View style={{flex: 1}}/>

          {
            /*Button change*/
            this.renderButtonChange()
          }
        </View>
        { this.renderModalChooseImage() }
        { this.renderModalBanking() }
      </KeyboardAwareScrollView>
    )
  }

  renderImageBankBrands(idBankBrand) {
    switch (idBankBrand) {
      case 1:
        return (
          <TouchableOpacity onPress={() => this.setState({ openModalBanking: true })}>
            <Image
              style={{ width: 40, height: 15 }}
              resizeMode="contain"
              source={Images.acb}
            />
          </TouchableOpacity>
        );
      case 2:
        return (
          <TouchableOpacity onPress={() => this.setState({ openModalBanking: true })}>
            <Image
              style={{ width: 55, height: 18 }}
              resizeMode="contain"
              source={Images.sacombank}
            />
          </TouchableOpacity>
        );
      default:
        return(
          <Icon name="credit-card-alt" size={25} />
        );
    }
  }

  renderModalBanking() {
    const { language } = this.props;
    return (
      <ModalBanking
        open={this.state.openModalBanking}
        offset={0}
        overlayBackground={'rgba(0, 0, 0, 0.75)'}
        animationDuration={200}
        animationTension={40}
        modalDidOpen={() => {}}
        modalDidClose={() => this.setState({ openModalBanking: false })}
        closeOnTouchOutside={true}
        containerStyle={styles.containerStyle}
        modalStyle={styles.modalStyle}
      >
        <Text style={styles.titleModal}>{I18n.t('chooseBankBrand', {locale: language})}</Text>
        <ListView
          enableEmptySections
          dataSource={this.state.dataSourceBanking}
          renderRow={(rowData) => this.renderRowBanking(rowData)}
          contentContainerStyle={styles.listViewBanking}
        />
      </ModalBanking>
    );
  }

  handleChooseBanking(banking) {
    this.setState({
      openModalBanking: false,
      bankBrandName: banking.name,
      idBankBrandSelected: banking.bankBrandId,
    });
  }

  renderRowBanking(item) {
    const { language } = this.props;
    return(
      <TouchableOpacity style={styles.rowCategory} onPress={() => this.handleChooseBanking(item)}>
        <Image
          style={{ width: 120, height: 40 }}
          resizeMode="contain"
          source={item.logo}
        />
      </TouchableOpacity>
    );
  }

  renderButtonChange() {
    const { language } = this.props;
    if (!this.props.account.fetching) {
      return (
        <TouchableOpacity style={styles.button} onPress={() => this.handleSaveProfile()}>
          <Text style={styles.textButton}>{I18n.t('change', {locale: language})}</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.button}>
        <ActivityIndicator animating={this.props.account.fetching} color='white' />
      </TouchableOpacity>
    );
  }

  handlePhoto() {
    this.setState({ openModalChooseImage: false });
    ImagePicker.openPicker({
      compressQuality: 70,
    }).then(image => {
      setTimeout(() => {
        _this.changeImage(image);
      }, 1000);
    }).catch((e) => console.log(e));;
  }

  handleCamera() {
    this.setState({ openModalChooseImage: false });
    ImagePicker.openPicker({
      compressQuality: 70,
      isCamera: true,
      openCameraOnStart: true,
    }).then(image => {
      setTimeout(() => {
        _this.changeImage(image);
      }, 1000);
    }).catch((e) => console.log(e));;
  }

  renderModalChooseImage() {
    return (
      <Modal2Choose
        logo={<Icon name="camera-retro" size={30} color={Colors.primary} />}
        title={'selectImageFrom'}
        titleA={'photo'}
        iconA={<Icon name="picture-o" size={25} color={'#FFF'} />}
        titleB={'camera'}
        iconB={<Icon name="camera" size={25} color={'#FFF'} />}
        open={this.state.openModalChooseImage}
        modalDidClose={() => this.setState({ openModalChooseImage: false })}
        onPressA={() => this.handlePhoto()}
        onPressB={() => this.handleCamera()}
      />
    )
  }

  changeImage(image) {
    const { language } = this.props;
    Alert.alert(
      I18n.t('youHaveSelected', {locale: language}) +' 1 '+ I18n.t('photos', {locale: language}),
      I18n.t('areYouSure', {locale: language}),
      [
        {text: I18n.t('cancel', {locale: language}), onPress: () => {}, style: 'cancel'},
        {text: I18n.t('ok', {locale: language}), onPress: () => {
          const { token } = this.props.login.user;
          const { accountId } = this.props.login.user.profile;
          if(Platform.OS === 'ios') {
            this.props.uploadAvatar(image.path, token, accountId);
            this.setState({
              urlImage: image.path
            });
          }
          if(Platform.OS === 'android') {
            this.props.uploadAvatar(image[0].path, token, accountId);
            this.setState({
              urlImage: image[0].path
            });
          }
          this.isUploadAvatar = true;
        }},
      ],
      { cancelable: false }
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    login: state.login,
    account: state.account,
    category: state.category,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editProfile: (info) => dispatch(AccountActions.editProfileRequest(info)),
    uploadAvatar: (image, token, accountId) => dispatch(AccountActions.uploadAvatarRequest(image, token, accountId)),
    getBankBrands: () => dispatch(CategoryActions.bankBrandsRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
