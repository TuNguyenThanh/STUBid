import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/VersionAppScreenStyle'

//I18n
import I18n from 'react-native-i18n'

class VersionApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNewVersion: false,
    };
  }

  render () {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        <Text>{I18n.t('versionApp', { locale: language })} 1.0.7</Text>
        {
          this.state.isNewVersion &&
          <View style={styles.contentStyle}>
            <Text style={styles.textUpdate}>Đã có 1 bản cập nhật mới, cập nhật ngay để trải nghiệm tốt hơn.</Text>
            <TouchableOpacity style={styles.buttonUpdate}>
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(VersionApp)
