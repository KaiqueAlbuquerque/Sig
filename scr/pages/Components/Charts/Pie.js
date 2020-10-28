import React, { Component } from "react";
import { View, Text, ScrollView, Alert } from "react-native";

import { VictoryPie } from "victory-native";

import Svg from "react-native-svg";

export default class Pie extends Component {
  generateChart = () => {
    if (this.props.data.length == 0) {
      return (
        <View
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginTop: 40,
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Nenhum registro neste período</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            marginLeft: 20,
            marginRight: 20,
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Svg
              width={this.props.width}
              height={this.props.height}
              viewBox={`0 0 ${this.props.width} ${this.props.height}`}
              style={{ width: "100%", height: "auto" }}
            >
              <VictoryPie
                height={this.props.height}
                width={this.props.width}
                colorScale={this.props.colorScale}
                data={this.props.data}
                standalone={false}
                labelRadius={({ innerRadius }) => innerRadius}
                innerRadius={100}
                style={{ labels: { fill: "black", fontSize: 13 } }}
                labelPosition={({ index }) => "centroid"}
                animate={{ duration: 1500 }}
                events={[
                  {
                    target: "data",
                    eventHandlers: {
                      onPressIn: (event, n) => {
                        Alert.alert(
                          "Dados do gráfico",
                          n.datum.x.split("\n").join(" "),
                          [
                            {
                              text: "Ok",
                              style: "ok",
                            },
                          ],
                          { cancelable: false }
                        );
                      },
                    },
                  },
                ]}
              />
            </Svg>
          </ScrollView>
        </View>
      );
    }
  };

  render() {
    return <>{this.generateChart()}</>;
  }
}
