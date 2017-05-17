import React from 'react'
import { View, Text, TextInput } from 'react-native'
import styles from './Styles/InputStyles'

export default class Input extends React.Component {
  render () {
    return (
      <View style={styles.wrapInput}>
        <Text style={styles.titleStyle}>{this.props.title}</Text>
        <View style={styles.viewInput}>
          <TextInput
            style={styles.inputStyle}
            placeholder={this.props.placeholder}
            keyboardType={this.props.keyboardType}
            placeholderTextColor="#989899"
            autoCapitalize={'none'}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            returnKeyType='next'
            value={this.props.value}
            onChangeText={this.props.onChangeText}
          />
        </View>
      </View>
    )
  }
}
