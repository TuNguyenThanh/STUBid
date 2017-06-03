import React from 'react'
import { View, Text, Modal, Image } from 'react-native'
import Spinner from 'react-native-spinkit'
import { Colors, Images } from '../Themes/'

class ModalLoading extends React.Component {
  render() {
    return(
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={this.props.isVisible}
        onRequestClose={() => {alert("Modal has been closed.")}}
      >
        <View style={styles.containerStyle}>

          <Image
            style={styles.imgStyle}
            source={Images.logo}
            resizeMode="contain"
          >
            <Spinner
              isVisible={this.props.isVisible}
              size={200}
              type={'WanderingCubes'}
              color={Colors.primary}
            />
          </Image>
        </View>
      </Modal>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgStyle: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

// Prop type warnings
ModalLoading.propTypes = {
  isVisible: React.PropTypes.bool.isRequired,
}

// Defaults for props
ModalLoading.defaultProps = {
}

export default ModalLoading
