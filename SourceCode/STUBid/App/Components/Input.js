import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import styles from './Styles/InputStyles'

export default class Input extends React.Component {
  render () {
    return (
      <View style={styles.wrapInput}>
        <Text style={styles.titleStyle}>{this.props.title}</Text>
          {
            this.props.type == 'onPress' ?
            <TouchableOpacity style={styles.viewStyle} onPress={this.props.onPress}>
              <Text style={styles.titlePlaceholderStyle} numberOfLines={1}>
                {this.props.value == '' ? this.props.placeholder : this.props.value}
              </Text>
            </TouchableOpacity>
            :
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
          }
          {
            this.props.type == 'money' &&
            <Text style={styles.textStyle}>.000VND</Text>
          }
      </View>
    )
  }
}
