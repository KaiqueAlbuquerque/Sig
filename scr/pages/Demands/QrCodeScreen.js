import React, {Component} from 'react';
import { Text, View, Dimensions, StyleSheet } from 'react-native';

import QRCodeScanner from "react-native-qrcode-scanner";

export default class QrCodeScreen extends Component {
  state = {
    url: '',
  };

  handleButton = () => {
    this.scanner.reactivate()
  }

  onSuccess = async (e) => {
    await this.setState({ url: e.data });
    this.handleButton();
    this.props.navigation.navigate('DemandsDetail', {userData: this.props.navigation.state.params.userData, createDemands: {}, idProduct: this.state.url});
  };
  
  render(){
    return(
      <View style={styles.container}>
        <QRCodeScanner
          onRead={this.onSuccess}
          showMarker={true}
          checkAndroid6Permissions={true}
          ref={(elem) => { this.scanner = elem }}
          cameraStyle={styles.cameraContainer}
          bottomContent={
            <View style={styles.touchable}>
              <Text style={styles.text}>{this.state.url}</Text>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  
  touchable: {
    padding: 16
  },
  
  text: {
    fontSize: 21,
    color: "rgb(255,255,255)"
  },
  
  cameraContainer: {
    height: Dimensions.get('window').height / 2,
  }  
});