import React from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/InfoUploadProductScreenStyle'

class InfoUploadProduct extends React.Component {

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text>InfoUploadProduct Screen</Text>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoUploadProduct)
