import React, { Component } from "react";
import { ScrollView, Dimensions } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";

export default class Bar extends Component {

    generateChart = () => {

        let colors = [];

        for(let i = 0; i < this.props.labels.length; i++){
            colors.push("#a4b0be");
        }

        return  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{marginLeft: 20, marginRight: 20}}
                >
                    <StackedBarChart
                        data={{
                            labels: this.props.labels,
                            data: this.props.data,
                            barColors: colors,
                            legend: [],
                        }}
                        width={Dimensions.get("window").width + this.props.width}
                        height={this.props.height}
                        chartConfig={{
                            backgroundColor: '#1cc910',
                            backgroundGradientFrom: '#eff3ff',
                            backgroundGradientTo: '#efefef',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        showLegend={false}
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