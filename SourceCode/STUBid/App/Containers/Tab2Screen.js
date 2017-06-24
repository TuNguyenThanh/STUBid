import React from 'react'
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/Tab2ScreenStyle'

class Tab2 extends React.Component {
  constructor(props) {
    super(props);

    let data = [];
    if(this.props.screen == 'HOME') {
      data = this.props.auctions.listData[this.props.rowID];
    } else if(this.props.screen == 'MYAUCTIONS') {
      const temp = this.props.auctions.myListAuction.concat(this.props.auctions.myListAuctionClose);
      data = temp[this.props.rowID];
    }

    this.state = {
      data
    };
  }

  componentWillReceiveProps(nextProps) {
    const { listData, myListAuction, myListAuctionClose } = nextProps.auctions;

    if(this.props.screen == 'HOME') {
      this.setState({
        data: listData[this.props.rowID],
      });
    } else if(this.props.screen == 'MYAUCTIONS') {
      const temp = myListAuction.concat(myListAuctionClose);
      this.setState({
        data: temp[this.props.rowID],
      });
    }
  }

  render() {
    const { data } = this.state;
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.textStyle}>{data.product.description}</Text>
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    language: state.settings.language,
    auctions: state.auctions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tab2)
