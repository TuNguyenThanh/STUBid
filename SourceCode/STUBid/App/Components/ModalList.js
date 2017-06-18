import React from 'react'
import { View, Text, ListView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import Modal from './Modal'
import Icon from 'react-native-vector-icons/FontAwesome'

//Style
import styles from './Styles/ModalCategoryStyles'
import { Colors } from '../Themes/'

//I18n
import I18n from 'react-native-i18n'

class ModalList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dataSourceCategory: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.state = {
      dataSourceCategory: this.state.dataSourceCategory.cloneWithRows(data),
    }
  }

  render() {
    const { language } = this.props;
    return (
      <Modal
        open={this.props.open}
        offset={0}
        overlayBackground={'rgba(0, 0, 0, 0.75)'}
        animationDuration={200}
        animationTension={40}
        modalDidOpen={() => console.log('modal did open')}
        modalDidClose={this.props.modalDidClose}
        closeOnTouchOutside={true}
        containerStyle={styles.containerStyle}
        modalStyle={styles.modalStyle}
      >
        <View style={styles.viewIcon}>
          {
            this.props.logo
          }
        </View>
        <Text style={styles.titleModalCategory}>{this.props.title}</Text>
        <ListView
          enableEmptySections
          dataSource={this.state.dataSourceCategory}
          renderRow={this.renderRowCategory.bind(this)}
          contentContainerStyle={styles.listViewCategory}
        />
      </Modal>
    )
  }

  renderRowCategory(item) {
    const { language } = this.props;
    return(
      <TouchableOpacity style={styles.rowCategory} onPress={this.handleCategoryItem.bind(this, item)}>
        <Text style={styles.titleItemStyle}>{item.name ? item.name : item}</Text>
      </TouchableOpacity>
    );
  }

  handleCategoryItem(item) {
    //call back item selected
    const onPressItem = this.props.onPressItem;
    typeof onPressItem === 'function' && onPressItem(item);
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalList)
