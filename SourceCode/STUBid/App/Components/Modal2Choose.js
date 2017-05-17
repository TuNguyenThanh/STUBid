import React from 'react'
import { View, Text, ListView, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import Modal from './Modal'
import Icon from 'react-native-vector-icons/FontAwesome'

//Style
import styles from './Styles/Modal2ChooseStyles'
import { Colors } from '../Themes/'

//I18n
import I18n from 'react-native-i18n'

class Modal2Choose extends React.Component {
  render() {
    const { language } = this.props;
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
        <View style={styles.viewIcon}>
          {this.props.logo}
        </View>
        <Text style={styles.titleModal}>{I18n.t(this.props.title, {locale: language})}</Text>
        <View style={styles.viewBody}>
          <TouchableOpacity style={styles.buttonModal} onPress={this.props.onPressA}>
            {this.props.iconA}
            <Text style={styles.textButtonModal}>{I18n.t(this.props.titleA, {locale: language})}</Text>
          </TouchableOpacity>
          <View style={{ width:10 }} />
          <TouchableOpacity style={styles.buttonModal} onPress={this.props.onPressB}>
            {this.props.iconB}
            <Text style={styles.textButtonModal}>{I18n.t(this.props.titleB, {locale: language})}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Modal2Choose)
