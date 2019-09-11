import React, {Component} from 'react';

import { StyleSheet, Text, View, Button } from 'react-native';

export default class SecondScreen extends Component{

    static navigationOptions =
    {
       title: 'SecondScreen',
    };
  
    render() {
      
      return (
   
        <View style={styles.MainContainer}>
  
          <Text style={styles.text}>This is Second Screen Activity.</Text>
        
        </View>
      );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
  
      flex: 1,
      justifyContent: 'center',
      backgroundColor : '#f5fcff',
      padding: 11
  
    },
  
    text:
    {
       fontSize: 22,
       color: '#000',
       textAlign: 'center',
       marginBottom: 10
    },
  
  });