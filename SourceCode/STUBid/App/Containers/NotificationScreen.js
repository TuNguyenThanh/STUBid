import React from 'react'
import { View, Text, ListView } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/NotificationScreenStyle'

//I18n
import I18n from 'react-native-i18n'

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataNotifi: [],
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.dataNotifi)
    })
  }

  render () {
    const { language } = this.props;
    return (
      <View style={styles.container}>
        {
          this.state.dataNotifi.length == 0 ?
          <View style={styles.centerViewStyle}>
            <Text style={styles.titleStyle}>
              {I18n.t('youHaveNoNotificationsAtAll', {locale: language})}
            </Text>
          </View>
          :
          <ListView
            enableEmptySections
            style={styles.listViewStyle}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this.renderRow(rowData)}
          />
        }
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
    language: state.settings.language,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)
