import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { Actions as NavigationActions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-customized-image-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import Input from '../Components/Input'
import ButtonChoose from '../Components/ButtonChoose'
import ModalCategory from '../Components/ModalCategory'
import Modal2Choose from '../Components/Modal2Choose'

// Styles
import styles from './Styles/UploadProductNextScreenStyle'
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
      categorySelected: { categoryId: -1, name: 'all' },
      data: [],
    };
  }

  componentDidMount() {
    if(this.props.category.categoryProduct) {
      this.setState({
        data: this.props.category.categoryProduct,
      });
    }
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
          <ScrollView style={styles.content}>

            <Input
              title={I18n.t('productName', {locale: language}) + ' *'}
              placeholder={I18n.t('productName', {locale: language})}
              value={this.state.productName}
              onChangeText={(productName) => this.setState({ productName })}
              autoCapitalize={'none'}
              autoCorrect={false}
              underlineColorAndroid={'transparent'}
            />

            <Input
              type={'money'}
              title={I18n.t('productStartPrice', {locale: language}) + ' *'}
              placeholder={'1.000'}
              keyboardType={'numeric'}
              autoCapitalize={'none'}
              autoCorrect={false}
              underlineColorAndroid={'transparent'}
              value={this.state.productStartPrice}
              onChangeText={(text) => this.onChangedProductStartPrice(text)}
            />

            <Input
              type={'money'}
              ref={(input) => this.productCeilPrice = input}
              title={I18n.t('productCeilPrice', {locale: language})}
              placeholder={'6.000'}
              keyboardType={'numeric'}
              value={this.state.productCeilPrice}
              onChangeText={(text) => this.onChangedProductCeilPrice(text)}
            />

            <Input
              title={I18n.t('productDescription', {locale: language}) + ' *'}
              placeholder={I18n.t('productDescription', {locale: language})}
              value={this.state.productDescription}
              onChangeText={(productDescription) => this.setState({ productDescription })}
            />

            <ButtonChoose
              title={I18n.t('productCategory', {locale: language})}
              item={I18n.t(this.state.categorySelected.name, {locale: language})}
              onPress={() => this.setState({openModalCategory: true})}
            />

            <View style={styles.viewImage}>
              <View style={styles.viewTitleImageStyle}>
                <Text style={styles.titleStyle}>{I18n.t('productImage', {locale: language}) + ' *'}</Text>
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

          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={() => this.handleUploadProductNext()}>
            <Text style={styles.textButton}>{I18n.t('next', {locale: language})}</Text>
          </TouchableOpacity>
        </View>
        { this.renderModalCategory() }
        { this.renderModalChooseImage() }
      </KeyboardAwareScrollView>
    )
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

  handleUploadProductNext() {
    const { language } = this.props;
    let { productName, productStartPrice, productCeilPrice, productDescription, categorySelected, arrImageChoose } = this.state;
    productStartPrice = productStartPrice.replace(/\./g, '');
    productCeilPrice = productCeilPrice.replace(/\./g, '');
    //check
    if(productName == '') {
      this.message(I18n.t('pleaseEnterProductName', {locale: language}))
    } else {
      if(productName.length < 10) {
        this.message(I18n.t('pleaseEnterProductNameLonger', {locale: language}))
      } else {
        if(productStartPrice == '') {
          this.message(I18n.t('pleaseEnterStartPrice', {locale: language}))
        } else {
          if(productDescription == '') {
            this.message(I18n.t('pleaseEnterDescription', {locale: language}))
          } else {
            if(productDescription.length < 10) {
              this.message(I18n.t('pleaseEnterDescriptionLonger', {locale: language}))
            } else {
              if(arrImageChoose.length == 0) {
                this.message(I18n.t('pleaseChooseAtLeastOneImage', {locale: language}))
              } else {
                if(productCeilPrice != '') {
                  if (parseInt(productCeilPrice) <= (parseInt(productStartPrice) * 5)) {
                    this.message(I18n.t('TheCeilingPriceGreaterThan5xStartingPrice', {locale: language}));
                    return;
                  }
                }

                const step1 = {
                  productName, productStartPrice, productCeilPrice, productDescription, categorySelected, arrImageChoose
                };
                NavigationActions.uploadProductScreen({ title: I18n.t('step', {locale: language}) + ' 2', step1 })
              }
            }
          }
        }
      }
    }
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
        // console.log(arrImage[i].size);
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
    category: state.category,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadProduct)
