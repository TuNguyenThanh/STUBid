import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-customized-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import Input from '../Components/Input'
import ButtonChoose from '../Components/ButtonChoose'
import ModalCategory from '../Components/ModalCategory'
import Modal2Choose from '../Components/Modal2Choose'

// Styles
import styles from './Styles/UploadProductScreenStyle'
import { Colors } from '../Themes/'

//I18n
import I18n from 'react-native-i18n'

var _this;
class UploadProduct extends React.Component {
  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      productName: '',
      productStartPrice: '',
      productCeilPrice: '',
      productDescription: '',
      arrImageChoose: [],
      openModalCategory: false,
      openModalChooseImage: false,
      categorySelected: 'all',
      data: [],
    };
  }

  componentDidMount() {
    const { language } = this.props;
    this.setState({
      data: ['all', 'vehicles', 'mobile', 'houseware', 'dtationery', 'document'],
    });
  }

  onChangedProductStartPrice(text) {
    text = text.replace(/\./g, '');
    text = text.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.setState({ productStartPrice: text });
  }

  onChangedProductCeilPrice(text) {
    text = text.replace(/\./g, '');
    text = text.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.setState({ productCeilPrice: text });
  }

  render() {
    const { language } = this.props;
    return (
      <KeyboardAwareScrollView scrollEnabled={false} resetScrollToCoords={{ x: 0, y: 0 }} >
        <View style={styles.container}>

          <Input
            title={I18n.t('productName', {locale: language})}
            placeholder={I18n.t('productName', {locale: language})}
            value={this.state.productName}
            onChangeText={(productName) => this.setState({ productName })}
          />

          <Input
            title={I18n.t('productStartPrice', {locale: language})}
            placeholder={'1.000 vnd'}
            keyboardType={'number-pad'}
            value={this.state.productStartPrice}
            onChangeText={(text) => this.onChangedProductStartPrice(text)}
          />

          <Input
            title={I18n.t('productCeilPrice', {locale: language})}
            placeholder={'5.000 vnd'}
            keyboardType={'number-pad'}
            value={this.state.productCeilPrice}
            onChangeText={(text) => this.onChangedProductCeilPrice(text)}
          />

          <Input
            title={I18n.t('productDescription', {locale: language})}
            placeholder={I18n.t('productDescription', {locale: language})}
            value={this.state.productDescription}
            onChangeText={(productDescription) => this.setState({ productDescription })}
          />

          <ButtonChoose
            title={I18n.t('productCategory', {locale: language})}
            item={I18n.t(this.state.categorySelected, {locale: language})}
            onPress={() => this.setState({openModalCategory: true})}
          />

          <View style={styles.viewImage}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.titleStyle}>{I18n.t('productImage', {locale: language})}</Text>
              {
                this.state.arrImageChoose.length != 0 &&
                <TouchableOpacity onPress={() => this.cancelImageChoose()}>
                  <Text style={styles.titleStyle}>{I18n.t('cancel', {locale: language})}</Text>
                </TouchableOpacity>
              }
            </View>
            {
              this.state.arrImageChoose.length == 0 &&
              <TouchableOpacity style={styles.viewIconImage} onPress={() => this.setState({ openModalChooseImage: true }) }>
                <Icon name="picture-o" size={100} color={Colors.primary} />
              </TouchableOpacity>
            }
            {
              this.state.arrImageChoose.length != 0 &&
              <ScrollView
                horizontal
                contentContainerStyle={styles.contentContainerStyle}
                style={styles.scrollViewStyle}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                {
                  this.renderMultiImage(this.state.arrImageChoose)
                }
              </ScrollView>
            }
          </View>

          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.textButton}>{I18n.t('next', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
        { this.renderModalCategory() }
        { this.renderModalChooseImage() }
      </KeyboardAwareScrollView>
    )
  }

  renderModalCategory() {
    return(
      <ModalCategory
        title={'chooseCategory'}
        open={this.state.openModalCategory}
        modalDidClose={() => this.setState({ openModalCategory: false })}
        data={this.state.data}
        onPressItem={(item) => this.setState({ openModalCategory: false, categorySelected: item }) }
      />
    );
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

  renderMultiImage(arrImage) {
    let arrPush = [];
    arrImage.map((img, index) => {
      arrPush.push(
        <Image
          key={index}
          style={styles.imgStyle}
          source={{ uri: img }}
        />
      );
    });
    return arrPush;
  }

  handlePhoto() {
    this.setState({ openModalChooseImage: false });
    ImagePicker.openPicker({
      multiple: true,
      maxSize: 5,
      compressQuality: 70,
    }).then(images => {
      setTimeout(() => {
        _this.changeImage(images);
      }, 1000);
    }).catch((e) => console.log(e));;
  }

  handleCamera() {
    this.setState({ openModalChooseImage: false });
    ImagePicker.openPicker({
      multiple: true,
      isCamera: true,
      openCameraOnStart: true,
      maxSize: 5,
      compressQuality: 70,
    }).then(images => {
      setTimeout(() => {
        _this.changeImage(images);
      }, 1000);
    }).catch((e) => console.log(e));;
  }

  changeImage(arrImage) {
    const { language } = this.props;
    let arrImageTemp = [];
    if(arrImage.length !=0 ) {
      for(let i = 0; i< arrImage.length; i++) {
        arrImageTemp.push(arrImage[i].path);
      }
      Alert.alert(
        I18n.t('youHaveSelected', {locale: language}) +' '+arrImageTemp.length+' '+ I18n.t('photos', {locale: language}),
        I18n.t('areYouSure', {locale: language}),
        [
          {text: I18n.t('cancel', {locale: language}), onPress: () => {}, style: 'cancel'},
          {text: I18n.t('ok', {locale: language}), onPress: () => {
            this.setState({
              arrImageChoose: this.state.arrImageChoose.concat(arrImageTemp),
            });
          }},
        ],
        { cancelable: false }
      );
    } else {
      alert('0 Image selected')
    }
  }

  cancelImageChoose() {
    this.setState({ arrImageChoose: [] });
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
