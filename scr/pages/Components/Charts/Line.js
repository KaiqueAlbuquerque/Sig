import React, { Component } from 'react';
import { View } from "react-native";
import PureChart from 'react-native-pure-chart';
import COLORS from '../../../styles/Colors.js';

export default class Line extends Component  {

    generateChart = () => {

        let data = [{
            data: this.props.data,
            color: COLORS.default
        }]; 
        
        return  <View style={{ marginLeft: 20, marginRight: 20 }}>
                    <PureChart data={data} type='line' height={this.props.height} />
                </View>
    }

    render() {
        return(
            <>
                {this.generateChart()}
            </>
        )
    }
}