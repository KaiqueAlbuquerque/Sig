import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";

export default function Line(props) {

    let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })

    const generateChart = () => {

        return  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{marginLeft: 20, marginRight: 20}}
                >
                    <LineChart
                        data={{
                            labels: props.labels,
                            datasets: [
                                {
                                    data: props.data,
                                },
                            ],
                        }}
                        width={Dimensions.get("window").width + props.width}
                        height={props.height}
                        chartConfig={{
                            backgroundColor: '#1cc910',
                            backgroundGradientFrom: '#eff3ff',
                            backgroundGradientTo: '#efefef',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                        }}
                        bezier
                        style={{
                            borderRadius: 16,
                        }}  

                        decorator={() => {
                            return tooltipPos.visible ? <View>
                                <Svg>
                                    <Rect x={tooltipPos.x - 15} 
                                        y={tooltipPos.y + 10} 
                                        width="40" 
                                        height="30"
                                        fill="black" />
                                        <TextSVG
                                            x={tooltipPos.x + 5}
                                            y={tooltipPos.y + 30}
                                            fill="white"
                                            fontSize="16"
                                            fontWeight="bold"
                                            textAnchor="middle">
                                            {tooltipPos.value}
                                        </TextSVG>
                                </Svg>
                            </View> : null
                        }}
        
                        onDataPointClick={(data) => {
        
                            let isSamePoint = (tooltipPos.x === data.x 
                                                && tooltipPos.y === data.y)
        
                            isSamePoint ? setTooltipPos((previousState) => {
                                return { 
                                          ...previousState,
                                          value: data.value,
                                          visible: !previousState.visible
                                       }
                            })
                                : 
                            setTooltipPos({ x: data.x, value: data.value, y: data.y, visible: true });
        
                        }}
                    />
                </ScrollView>
    }

    return(
        <>
            {generateChart()}
        </>
    )
}