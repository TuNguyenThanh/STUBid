import React from 'react'
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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

class UploadProduct extends React.Component {
  constructor(props) {
    super(props);
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
            <Text style={styles.titleStyle}>{I18n.t('productImage', {locale: language})}</Text>
            {
              this.state.arrImageChoose.length != 0 ?
              <Image
                style={{flex: 1}}
                resizeMode="contain"
                source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
              /> :
              <TouchableOpacity style={styles.viewIconImage} onPress={() => this.setState({ openModalChooseImage: true }) }>
                <Icon name="picture-o" size={100} color={Colors.primary} />
              </TouchableOpacity>
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

  handlePhoto() {
    this.setState({ openModalChooseImage: false });
  }

  handleCamera() {
    this.setState({ openModalChooseImage: false });
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
