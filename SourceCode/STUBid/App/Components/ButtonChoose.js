import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './Styles/ButtonChooseStyles'
import { Colors } from '../Themes/'

export default class ButtonChoose extends React.Component {
  render() {
    return (
      <View style={styles.wrapButton}>
        <Text style={styles.titleStyle}>{this.props.title}</Text>
        <TouchableOpacity style={styles.viewButton} onPress={this.props.onPress}>
          <Text style={styles.itemStyle}>{this.props.item}</Text>
          <View style={styles.viewIcon}>
            <Icon name={this.props.nameIcon || "list-alt"} size={30} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
