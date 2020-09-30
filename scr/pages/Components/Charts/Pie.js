import React, { Component } from "react";
import { ScrollView, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

export default class Pie extends Component {

    generateChart = () => {

        return  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{marginLeft: 20, marginRight: 20}}
                >
                    <PieChart
						data={this.props.data}
						width={Dimensions.get("window").width + this.props.width} 
						height={this.props.height}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="demands"
                        backgroundColor="#eff3ff"
                        absolute
                        style={{
                            borderRadius: 16,
                        }}
					/>
                </ScrollView>
    }

    render() {
        return(
            <>
                {this.generateChart()}
            </>
        )
    }
}