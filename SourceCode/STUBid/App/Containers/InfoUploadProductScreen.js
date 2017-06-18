import React from 'react'
import { ScrollView, Text } from 'react-native'
import { connect } from 'react-redux'
import ProductActions from '../Redux/ProductRedux'
import HTMLView from 'react-native-htmlview'

// Styles
import styles from './Styles/InfoUploadProductScreenStyle'

class InfoUploadProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      htmlContent: ''
    };
    this.isGetInfoUploadProduct = false;
  }

  componentWillMount() {
    this.props.getInfoUploadProduct();
    this.isGetInfoUploadProduct = true;
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    const { fetching, error, dataInfo} = nextProps.product;

    if(!fetching && dataInfo && this.isGetInfoUploadProduct) {
      this.setState({
        htmlContent: dataInfo
      });
      this.isGetInfoUploadProduct = false;
    }
  }

  render () {
    const htmlContent = `<p><a href="http://jsdf.co">&hearts; nice job!</a></p>`;
    return (
      <ScrollView style={styles.container}>
        <HTMLView
          value={this.state.htmlContent}
          stylesheet={styles}
        />
      </ScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    product: state.product
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInfoUploadProduct: () => dispatch(ProductActions.getInfoUploadRequest()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoUploadProduct)
