import React from 'react'
import { View, Text, Modal, Image } from 'react-native'
import Spinner from 'react-native-spinkit'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Images } from '../Themes/'

class ModalUpload extends React.Component {
  render() {
    return(
      <View style={styles.containerStyle}>
          <Image
            style={styles.imgStyle}
            source={Images.iconUpload}
            resizeMode="contain"
          >
            <Spinner
              isVisible={true}
              size={100}
              type={'Pulse'}
              color={Colors.primary}
            />
          </Image>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute'
  },
  imgStyle: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    tintColor: Colors.primary
  }
};

// Prop type warnings
ModalUpload.propTypes = {

}

// Defaults for props
ModalUpload.defaultProps = {
}

export default ModalUpload
