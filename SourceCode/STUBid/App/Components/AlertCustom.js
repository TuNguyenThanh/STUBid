import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import Modal from './Modal'

//Styles
import styles from './Styles/AlertCustomStyle'

export default class AlertCustom extends React.Component {
  render () {
    return (
      <Modal
        open={this.props.isOpen}
        offset={0}
        overlayBackground={'rgba(0, 0, 0, 0.75)'}
        animationDuration={200}
        animationTension={40}
        modalDidClose={this.props.modalDidClose}
        closeOnTouchOutside={false}
        containerStyle={styles.containerStyle}
        modalStyle={styles.modalStyle}
      >
        <View style={styles.viewModalImage}>
          <View style={styles.viewImage}>
            <View style={styles.viewBorderImage}>
              <Image
                style={styles.imgModal}
                source={{ uri: 'http://pano.vn/wp-content/uploads/2015/09/mixed-logo.jpg' }}
              />
            </View>
            <View style={styles.viewBehindImage} />
          </View>
        </View>
        <View style={styles.bodyModal}>
          <View style={styles.viewTitleStyle}>
            <Text style={styles.titleStyle}>{this.props.title}</Text>
          </View>

          <View style={styles.viewTitleStyle}>
            <Text style={styles.descriptionStyle}>
              {this.props.messages}
            </Text>
          </View>

          <TouchableOpacity style={styles.buttonStyle} onPress={this.props.onPress}>
            <Text style={styles.textButtonStyle}>
              {this.props.titleButton}
            </Text>
          </TouchableOpacity>
        </View>

      </Modal>
    )
  }
}

// Prop type warnings
AlertCustom.propTypes = {
  isOpen: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string.isRequired,
  messages: React.PropTypes.string,
  titleButton: React.PropTypes.string,
}

// Defaults for props
AlertCustom.defaultProps = {
  title: 'Title Alert',
  messages: "You've just displayed this awesome Pop Up View",
  titleButton: 'Success'
}
