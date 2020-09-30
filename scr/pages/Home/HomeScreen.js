import React, { useState, useEffect } from "react";

import { ScrollView, Alert } from "react-native";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text } from "react-native-elements";
import { LabelDemands, LabelCommercial } from '../Components/LabelMenu';

import MenuScreen from '../Menu/MenuScreen.js';
import DemandsListScreen from '../Demands/DemandsListScreen.js';
import OrderListScreen from '../Commercial/OrderListScreen.js';

import Line from '../Components/Charts/Line.js';
import Bar from '../Components/Charts/Bar.js';
import Pie from '../Components/Charts/Pie.js';

import COLORS from '../../styles/Colors.js';
import { useSelector } from 'react-redux';

import CrudService from '../../services/Crud/CrudService.js';

function HomeScreen(props) {
	
	const [listCharts, setListCharts] = useState([]);

	let crudService = new CrudService();

	const data = useSelector(state => state.userData);

	useEffect(() => {
		
		async function getChartsInitial(){
			await getCharts();
		}

		getChartsInitial();
	}, []);

	const getCharts = async () => {
		
		let result = await crudService.get(`kpi/${data.userData.signatureId}/${data.userData.personId}`, data.token);

		if(result.status == 200){
			setListCharts(result.data);
		}
		else if(result.status == 401){
			Alert.alert(
				"Sessão Expirada",
				"Sua sessão expirou. Por favor, realize o login novamente.",
				[
					{
						text: "Ok",
						onPress: () => props.navigation.navigate('LoginEmail'),
						style: "ok"
					}
				],
				{ cancelable: false }
			);
		}
		else if(result.status == 400){
			Alert.alert(
				"Erro",
				result.data[0],
				[
					{
						text: "Ok",
						onPress: () => props.navigation.navigate('Home'),
						style: "ok"
					}
				],
				{ cancelable: false }
			);
		}
		else{
			Alert.alert(
				"Erro",
				"Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
				[
					{
						text: "Ok",
						onPress: () => props.navigation.navigate('Home'),
						style: "ok"
					}
				],
				{ cancelable: false }
			);
		}
	}

	return (
		<ScrollView>
			{
				listCharts.map((chart) => {
					
					return <>
					
						<Text h4 style={{marginLeft: 20, marginRight: 20, marginTop:15, marginBottom: 5}}>{chart.title}</Text>

						{chart.graphicType == 0 && (
							<Pie
								data={chart.pieCharts}
								height={chart.height}
								width={chart.width}
							/>
						)}

						{chart.graphicType == 1 && (
							<Line 
								labels={chart.labels}
								data={chart.data}
								height={chart.height}
								width={chart.width}
							/>
						)}

						{chart.graphicType == 2 && (
							<Bar 
								labels={chart.labels}
								data={chart.data.map((dataChart) => {
									let array = [];
									array.push(dataChart)
									return array
								})}
								height={chart.height}
								width={chart.width}
							/>
						)}
					</>
				})
			}
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