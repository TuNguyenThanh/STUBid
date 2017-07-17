import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import styles from './Styles/InputStyles'

export default class Input extends React.Component {
  render () {
    return (
      <View style={styles.wrapInput}>
        <Text style={styles.titleStyle}>{this.props.title}</Text>
        <View style={styles.viewInput}>
          {
            this.props.action == 'onPress' ?
            <TouchableOpacity style={styles.viewStyle} onPress={this.props.onPress}>
              <Text style={styles.titlePlaceholderStyle} numberOfLines={1}>
                {this.props.value == '' ? this.props.placeholder : this.props.value}
              </Text>
            </TouchableOpacity>
            :
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
          }
          {
            this.props.type == 'money' &&
            <Text style={styles.textStyle}>.000VND</Text>
          }
        </View>
      </View>
    )
  }
}
