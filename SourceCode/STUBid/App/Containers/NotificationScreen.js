import React from 'react'
import { View, Text, ListView } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/NotificationScreenStyle'

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([1,2,3,4,5])
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listViewStyle}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => this.renderRow(rowData)}
        />
      </View>
    )
  }

  renderRow(item) {
    return(
      <View style={styles.row}>
        <Text style={styles.titleStyle}>Title</Text>
        <Text style={styles.notifyStyle}>{item}</Text>
      </View>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
