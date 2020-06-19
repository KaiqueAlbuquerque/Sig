import React from "react";

import { ScrollView, Dimensions } from "react-native";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text } from "react-native-elements";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";

import { LabelDemands, LabelCommercial } from '../components/LabelMenu.js';

import MenuScreen from '../Menu/MenuScreen.js';
import DemandsListScreen from '../Demands/DemandsListScreen.js';
import OrderListScreen from '../Commercial/OrderListScreen.js';

import COLORS from '../../styles/Colors.js';

function HomeScreen(props) {

	return (
		<ScrollView>
			<Text h3>Chamados</Text>
			<LineChart
				data={{
					labels: ["January", "February", "March", "April", "May", "June"],
					datasets: [
						{
							data: [
								Math.random() * 100,
								Math.random() * 100,
								Math.random() * 100,
								Math.random() * 100,
								Math.random() * 100,
								Math.random() * 100,
							],
						},
					],
				}}
				width={Dimensions.get("window").width}
				height={220}
				yAxisLabel={"$"}
				chartConfig={{
					backgroundColor: "#e26a00",
					backgroundGradientFrom: COLORS.default,
					backgroundGradientTo: "#ffa726",
					decimalPlaces: 2, 
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16,
					},
				}}
				bezier
				style={{
					marginVertical: 8,
					borderRadius: 16,
				}}
			/>

			<Text h3>Equipamentos</Text>
			<BarChart
				data={{
					labels: ["January", "February", "March", "April", "May", "June"],
					datasets: [
						{
							data: [
								Math.random() * 100,
								Math.random() * 100,
								Math.random() * 100,
								Math.random() * 100,
								Math.random() * 100,
								Math.random() * 100,
							],
						},
					],
				}}
				width={Dimensions.get("window").width}
				height={220}
				yAxisLabel={"$"}
				chartConfig={{
					backgroundColor: "#e26a00",
					backgroundGradientFrom: COLORS.default,
					backgroundGradientTo: "#ffa726",
					decimalPlaces: 2, 
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16,
					},
				}}
				bezier
				style={{
					marginVertical: 8,
					borderRadius: 16,
				}}
			/>

			<Text h3>Funcionário</Text>
			<PieChart
				data={[
					{
						name: "Seoul",
						population: 21500000,
						color: "rgba(131, 167, 234, 1)",
						legendFontColor: "#7F7F7F",
						legendFontSize: 15,
					},
					{
						name: "Toronto",
						population: 2800000,
						color: "#F00",
						legendFontColor: "#7F7F7F",
						legendFontSize: 15,
					},
					{
						name: "Beijing",
						population: 527612,
						color: "red",
						legendFontColor: "#7F7F7F",
						legendFontSize: 15,
					},
					{
						name: "New York",
						population: 8538000,
						color: "#ffffff",
						legendFontColor: "#7F7F7F",
						legendFontSize: 15,
					},
					{
						name: "Moscow",
						population: 11920000,
						color: "rgb(0, 0, 255)",
						legendFontColor: "#7F7F7F",
						legendFontSize: 15,
					},
				]}
				width={Dimensions.get("window").width} 
				height={220}
				chartConfig={{
					backgroundColor: "#e26a00",
					backgroundGradientFrom: COLORS.default,
					backgroundGradientTo: "#ffa726",
					decimalPlaces: 2, 
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16,
					},
				}}
				accessor="population"
				backgroundColor="transparent"
				paddingLeft="15"
				absolute
			/>

			<Text h3>Dia</Text>
			<ProgressChart
				data={{
					labels: ["Swim", "Bike", "Run"], 
					data: [0.4, 0.6, 0.8],
				}}
				width={Dimensions.get("window").width} 
				height={220}
				chartConfig={{
					backgroundColor: "#e26a00",
					backgroundGradientFrom: COLORS.default,
					backgroundGradientTo: "#ffa726",
					decimalPlaces: 2, 
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16,
					},
				}}
			/>
		</ScrollView>
	);
}

console.disableYellowBox = true;

export default createMaterialBottomTabNavigator(
  	{
		Home: {
			screen: HomeScreen,
			navigationOptions: {
				tabBarLabel: "Início",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="home" color={tintColor} size={24} />
				),
			},
		},
		DemandsList: {
			screen: DemandsListScreen,
			navigationOptions: {
				tabBarLabel: <LabelDemands />,
				tabBarIcon: ({ tintColor }) => (
					<Icon name="call" color={tintColor} size={24} />
				),
			},
		},
		OrderList: {
			screen: OrderListScreen,
			navigationOptions: {
				tabBarLabel: <LabelCommercial />,
				tabBarIcon: ({ tintColor }) => (
					<Icon name="create" color={tintColor} size={24} />
				),
			},
		},
		Menu: {
			screen: MenuScreen,
			navigationOptions: {
				tabBarLabel: "Menu",
				tabBarIcon: ({ tintColor }) => (
					<Icon name="menu" color={tintColor} size={24} />
				),
			},
		},
	},
	{
		initialRouteName: "Home",
		barStyle: { backgroundColor: COLORS.default },
		shifting: true,
	}
);