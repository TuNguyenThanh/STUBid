import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import Modal from './Modal'
import Icon from 'react-native-vector-icons/FontAwesome'

//Style
import styles from './Styles/ModalBidStyles'
import { Colors } from '../Themes/'

//I18n
import I18n from 'react-native-i18n'

class ModalCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      bidNumber: 1,
    };
  }

  render() {
    const { language } = this.props;
    const { data } = this.state;
    let price = data.highestBidder ? data.highestBidder.price : data.startPrice;
    price += data.bidIncreasement * this.state.bidNumber;

    return (
      <Modal
        open={this.props.open}
        offset={0}
        overlayBackground={'rgba(0, 0, 0, 0.75)'}
        animationDuration={200}
        animationTension={40}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={this.props.modalDidClose}
        closeOnTouchOutside={true}
        containerStyle={styles.containerStyle}
        modalStyle={styles.modalStyle}
      >
        <View style={styles.viewModalImage}>
          <View style={styles.viewImage}>
            <View style={styles.viewBorderImage}>
              <Icon name="legal" size={60} color={Colors.primary} />
            </View>
            <View style={styles.viewBehindImage} />
          </View>
        </View>

        <View style={styles.bodyModal}>
          {/*Title*/}
          <View style={styles.viewTitleStyle}>
            <Text style={styles.titleStyle}>{this.state.data.product.name}</Text>
          </View>

          {/*Bid price*/}
          <View style={styles.viewBidStyle}>
            <View style={styles.itemBody}>
              <View style={styles.viewBorderBidPrice}>
                <Text>{this.state.data.bidIncreasement.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')}</Text>
              </View>
            </View>
            <View style={styles.itemBody1}><Text>X</Text></View>
            <View style={styles.itemBody}>
              <View style={{ justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => this.handleUp()}>
                  <Icon name="caret-up" size={25} color={Colors.primary} />
                </TouchableOpacity>
                <Text>{this.state.bidNumber}</Text>
                <TouchableOpacity onPress={() => this.handleDown()}>
                  <Icon name="caret-down" size={25} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.viewTitleStyle}>
            <Text style={styles.titleDetailStyle}>{I18n.t('yesBid', {locale: language})}</Text>
            <Text style={styles.titlePriceStyle}>{price.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1.') + ' VND'}</Text>
          </View>

          {/*Button*/}
          <View style={styles.viewBody}>
            <TouchableOpacity style={styles.buttonModal} onPress={this.props.onPressA}>
              <Text style={styles.textButtonModal}>{I18n.t('later', {locale: language})}</Text>
            </TouchableOpacity>
            <View style={{ width:10 }} />
            <TouchableOpacity style={styles.buttonModal} onPress={() => this.handleOnPressB()}>
              <Text style={styles.textButtonModal}>{I18n.t('bid', {locale: language})}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  handleOnPressB() {
    //call back item selected
    const onPressB = this.props.onPressB;
    const price = this.state.data.highestBidder ? this.state.data.highestBidder.price : this.state.data.startPrice;
    const item = price + (this.state.data.bidIncreasement * this.state.bidNumber);
    typeof onPressB === 'function' && onPressB(item);
  }

  handleUp(){
    if(this.state.bidNumber < 10) {
      this.setState({
        bidNumber: this.state.bidNumber + 1
      });
    }
  }

  handleDown(){
    if(this.state.bidNumber > 1) {
      this.setState({
        bidNumber: this.state.bidNumber - 1
      });
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalCategory)
