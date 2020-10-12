import React, { useState, useEffect, useRef, PureComponent } from "react";

import RBSheet from "react-native-raw-bottom-sheet";

import { ScrollView, 
		 FlatList,
		 Alert, 
		 TouchableWithoutFeedback, 
		 TouchableOpacity, 
		 View, 
		 ActivityIndicator, 
		 StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icons from "react-native-vector-icons/FontAwesome";

import { Text, Header, Card } from "react-native-elements";
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

class MyListItem extends PureComponent {
	render() {
		return (
			<TouchableOpacity onPress={() => this.props.goCrudKpi(this.props.item.kpiId)}>
				<Card containerStyle={{ borderRadius: 15 }}>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Título:</Text> {this.props.item.title}
                    </Text>
				</Card>
			</TouchableOpacity>
	  	)
	}
}

function HomeScreen(props) {

	const refRBSheet = useRef();
	
	const [listCharts, setListCharts] = useState([]);
	const [listKpis, setListKpis] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [noData, setNoData] = useState(false);

	let crudService = new CrudService();

	const data = useSelector(state => state.userData);

	useEffect(() => {
		
		async function getChartsInitial(){
			await getCharts();
		}

		props.navigation.addListener('willFocus', (route) => { 
            setIsLoading(true);
			getChartsInitial();
			setNoData(false);
        });

		getChartsInitial();
	}, []);

	const getCharts = async () => {
		
		let result = await crudService.get(`kpi/${data.userData.signatureId}/${data.userData.personId}`, data.token);
		
		if(result.status == 200){

			if(result.data.length == 0){
				setNoData(true);
			}
			else{
				setListCharts(result.data);
				setNoData(false);
			}
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

		let resultList = await crudService.get(`kpi/getListKpis/${data.userData.signatureId}/${data.userData.personId}`, data.token);
		
		if(resultList.status == 200){

			setListKpis(resultList.data);
		}
		else if(resultList.status == 401){
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
		else if(resultList.status == 400){
			Alert.alert(
				"Erro",
				resultList.data[0],
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

		setIsLoading(false);
	}

	const goCrudKpi = (id) => {
		
		refRBSheet.current.close();
		props.navigation.navigate('CrudKpi', {userData: data, id: id});
	}

	renderItem = ({ item }) => (
		<MyListItem
			item={item}
			goCrudKpi={goCrudKpi}
    	/>
    );

	return (
		<>
			<Header
				centerComponent={
					<Text h4 style={{textAlign: "center", color: "#fff" }}>
						KPIS
					</Text>
				}
				rightComponent={
					<TouchableWithoutFeedback onPress={() => refRBSheet.current.open()}>
						<Icons
							name='plus' 
							style={{fontSize: 20, color: "white", marginRight: 10}}
						/> 
					</TouchableWithoutFeedback>
				}
				containerStyle={{
					backgroundColor: COLORS.default,
					paddingTop: 0,
				}}
			/>
			<RBSheet
				ref={refRBSheet}
				closeOnDragDown={false}
				closeOnPressMask={false}
				animationType={"slide"}
				closeDuration={0}
				customStyles={{
					wrapper: {
						backgroundColor: "rgba(0,0,0,0.5)"
					},
					container: {
						height: "70%",
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20
					},
					draggableIcon: {
						backgroundColor: "#000"
					}
				}}
			>
				<Text h4 style={{marginBottom:10, marginTop:15, textAlign: 'center'}}>Lista de KPIS</Text>
				<View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
					<TouchableOpacity
						style={styles.backButton}
						activeOpacity = { .5 }
						onPress={() => refRBSheet.current.close()}
					>
						<Text style={styles.backText}>Voltar</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.nextButton}
						activeOpacity = { .5 }
						onPress={() => goCrudKpi(0)}
					>
						<Text style={styles.nextText}>Novo</Text>
					</TouchableOpacity>
				</View>	
				<FlatList
					style={{ flex: 1.8, marginBottom: 20 }}
					contentContainerStyle={ styles.list }
					data={ listKpis }
					renderItem={ renderItem }
					keyExtractor={(item, index) => item.kpiId.toString()}
				/>
			</RBSheet>
			{
                isLoading && (
                    <View style={styles.containerLoader}>
                        <ActivityIndicator size="large" color={COLORS.default} />
                    </View>   
                )
            }
            {
				!isLoading && !noData && (
					<ScrollView style={{backgroundColor: "#fff"}}>
						{
							listCharts.map((chart) => {
								
								return <>
										<Text h4 style={{marginLeft: 20, marginRight: 20, marginTop:15, marginBottom: 5}}>{chart.title}</Text>

										{chart.graphicType == 0 && (
											<Pie
												data={chart.pieCharts}
												height={chart.height}
											/>
										)}

										{chart.graphicType == 1 && (
											<Line 
												data={chart.data}
												height={chart.height}
											/>
										)}

										{chart.graphicType == 2 && (
											<Bar 
												data={chart.data}
												height={chart.height}
											/>
										)}
									</>
							})
						}
					</ScrollView>
				)
			}
			{
				!isLoading && noData && (
					<View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
						<Text style={{textAlignVertical: "center", textAlign: "center", fontSize: 15}}>Nenhum KPI Cadastrado.</Text> 
					</View>
				)
			}
		</>
	);
};

const styles = StyleSheet.create({
	containerLoader: {
        flex: 1,
        justifyContent: "center"
	},
	nextButton: {
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:COLORS.default,
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        width: 150
    },    
    nextText:{
        color:'#fff',
        textAlign:'center',
    },
    backButton: {
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#fff',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#000',
        width: 150
    },
    backText: {
        color: '#000',
        textAlign:'center'
	},
	list: {
		paddingHorizontal: 20,
    }	
});

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
		shifting: true
	}
);