import React from 'react'
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-customized-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal2Choose from '../Components/Modal2Choose'

// Styles
import styles from './Styles/EditProfileScreenStyle'
import { Images, Colors } from '../Themes'

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
      phone: this.props.user.phoneNumber,
      email: this.props.user.email,
      atm: this.props.user.atm,
      openModalChooseImage: false,
      urlImage: this.props.user.avatar,
    };
  }

  handleChangeAvatar() {
    this.setState({ openModalChooseImage: true });
  }

  handleSaveProfile() {
    alert('save');
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
                  <Image
                    style={styles.imgStyle}
                    source={{uri: this.state.urlImage}}
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
                onSubmitEditing={() => this.email.focus()}
                value={this.state.phone}
                onChangeText={(phone) => this.setState({ phone })}
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
                onSubmitEditing={() => this.atmCard.focus()}
                value={this.state.email}
                onChangeText={(email) => this.setState({ email })}
              />
              <View style={styles.lineStyle} />
            </View>
          </View>

          {/*ATM Number*/}
          <View style={styles.rowInput}>
            <View style={styles.viewNameInput}>
              <Icon name="credit-card-alt" size={25} />
            </View>
            <View style={styles.viewInput}>
              <TextInput
                ref={(input) => this.atmCard = input}
                style={styles.textinputStyle}
                autoCapitalize={'none'}
                autoCorrect={false}
                underlineColorAndroid={'transparent'}
                returnKeyType='done'
                onSubmitEditing={() => this.handleSaveProfile()}
                value={this.state.atm}
                onChangeText={(atm) => this.setState({ atm })}
              />
              <View style={styles.lineStyle} />
            </View>
          </View>

          <View style={{flex: 1}}/>

          <TouchableOpacity style={styles.button} onPress={this.handleSaveProfile.bind(this)}>
            <Text style={styles.textButton}>{I18n.t('change', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
        { this.renderModalChooseImage()}
      </KeyboardAwareScrollView>
    )
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
          this.setState({
            urlImage: image.path
          });
        }},
      ],
      { cancelable: false }
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
