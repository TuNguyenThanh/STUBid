import React from 'react'
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from '../Components/Modal'

// Styles
import styles from './Styles/EditProfileScreenStyle'
import { Images, Colors } from '../Themes'

//I18n
import I18n from 'react-native-i18n'

class EditProfile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      firstName: 'Tú',
      lastName: 'Nguyễn Thanh',
      phone: '0903016975',
      email: 'thanhtu.dev@gmail.com',
      atm: '2338 3232 6565 3425',
      openModalChooseImage: false,
    };
  }

  handleChangeAvatar() {
    this.setState({
      openModalChooseImage: true
    });
  }

  handleSaveProfile() {
    alert('save');
  }

  render () {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.contentStyle} scrollEnabled={false} resetScrollToCoords={{ x: 0, y: 0 }}>
          {/*Avatar*/}
          <View style={styles.viewImage}>
            <Image
              style={styles.imgStyle}
              source={{uri: 'http://znews-photo.d.za.zdn.vn/w1024/Uploaded/neg_rtlzofn/2017_01_23/14494601_177404746951l3484_2482115257403382069_n.jpg'}}
            />
            <TouchableOpacity onPress={() => this.handleChangeAvatar()}>
              <Icon name="camera-retro" size={30} style={{marginTop: -20, marginLeft: 70}} />
            </TouchableOpacity>
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

        </KeyboardAwareScrollView>
        <TouchableOpacity style={styles.button} onPress={this.handleSaveProfile.bind(this)}>
          <Text style={styles.textButton}>{I18n.t('change', {locale: language})}</Text>
        </TouchableOpacity>
        { this.renderModalChooseImage()}
      </View>
    )
  }

  renderModalChooseImage() {
    const { language } = this.props;
    return(
      <Modal
        open={this.state.openModalChooseImage}
        offset={0}
        overlayBackground={'rgba(0, 0, 0, 0.75)'}
        animationDuration={200}
        animationTension={40}
        modalDidClose={() => this.setState({openModalChooseImage: false})}
        closeOnTouchOutside={true}
        containerStyle={{ justifyContent: 'center'}}
        modalStyle={{
          borderRadius: 2,
          margin: 20,
          padding: 10,
          backgroundColor: '#F5F5F5',
          alignItems: 'center'
        }}
      >
        <View style={styles.viewIcon}>
          <Icon name="camera-retro" size={30} color={Colors.primary} />
        </View>
        <Text style={styles.titleModal}>{I18n.t('selectImageFrom', {locale: language})}</Text>
        <View style={styles.viewBody}>
          <TouchableOpacity style={styles.buttonModal}>
            <Icon name="picture-o" size={25} color={'#FFF'} />
            <Text style={styles.textButtonModal}>{I18n.t('photo', {locale: language})}</Text>
          </TouchableOpacity>
          <View style={{ width:10 }} />
          <TouchableOpacity style={styles.buttonModal}>
            <Icon name="camera" size={25} color={'#FFF'} />
            <Text style={styles.textButtonModal}>{I18n.t('camera', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
