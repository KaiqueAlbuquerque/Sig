import React, { Component } from "react";
import { View, Text } from "react-native";
import PureChart from 'react-native-pure-chart';

export default class Pie extends Component {

    generateChart = () => {
        
        if(this.props.data.length == 0){
            return  <View 
                        style={{
                            marginLeft: 20, 
                            marginRight: 20, 
                            marginTop: 40,
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text>Nenhum resgistro neste período</Text>
                    </View>
        }
        else{

            return  <View
                        style={{
                            marginLeft: 20, 
                            marginRight: 20, 
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <PureChart data={this.props.data} type='pie' height={this.props.height} />
                    </View>
        }
    }

    render() {
        return(
            <>
                {this.generateChart()}
            </>
        )
    }
}