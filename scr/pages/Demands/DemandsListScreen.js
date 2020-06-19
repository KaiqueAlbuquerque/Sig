import React, { useState, useEffect, PureComponent } from "react";

import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import ActionButton from "react-native-action-button";
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card, Header, Text } from "react-native-elements";

import { useSelector } from 'react-redux';

import CrudService from '../../services/Crud/CrudService.js';

import COLORS from '../../styles/Colors.js';

class MyListItem extends PureComponent {
	render() {
		return (
			<TouchableOpacity onPress={() => this.props.navigation.navigate("DemandsDetail")}>
				<Card containerStyle={{ borderRadius: 15 }}>
					<Text style={styles.textDemands}>Chamado {this.props.item.ticketId}</Text>
					<Text>
						<Text style={styles.textBold}>Cliente:</Text> {this.props.item.client}
					</Text>
					<Text>
						<Text style={styles.textBold}>Status:</Text> {this.props.item.status}
					</Text>
				</Card>
			</TouchableOpacity>
	  	)
	}
}

export default function DemandsListScreen(props){

	let crudService = new CrudService();
	let havePermission = false;
	const data = useSelector(state => state.userData);
	let render;

	const [listDemands, setListDemands] = useState(
		{
			data: [], 
			page: 0,
			loading: false,
		});

	const [refreshing, setRefreshing] = useState(false);

	const [onEndReachedCalledDuringMomentum , setOnEndReachedCalledDuringMomentum ] = useState(false);
		
	useEffect(() => {
		
		async function getDemandsInitial(){
			await getDemands();
			setRefreshing(false);
		}

		getDemandsInitial();
	}, [refreshing]);

	const getDemands = async () => {
		if (!onEndReachedCalledDuringMomentum) {
			
			if (listDemands.loading) return;

			setListDemands({
				data: [...listDemands.data],
				page: listDemands.page,
				loading: refreshing == true ? false : true,
			})
			
			let result = await crudService.get(`demands?SignatureId=${data.userData.signatureId}&PersonId=${data.userData.personId}&Page=${listDemands.page}`, data.token);
			
			setListDemands({
				data: [...listDemands.data, ...result.data],
				page: listDemands.page + 25,
				loading: false,
			})

			setOnEndReachedCalledDuringMomentum(true);
		}
	}

	const handlerefresh = () => {
		setRefreshing(true);

		setListDemands({
			data: [], 
			page: 0,
			loading: false,
		});
	}

	const renderFooter = () => {
		if (!listDemands.loading) return null;
			return (
				<View style={styles.loading}>
					<ActivityIndicator />
				</View>
		);
	};

	const renderItem = ({ item }) => (
		<MyListItem
			item={item}
			navigation={props.navigation}
    	/>
	);

	const openWhatsapp = () => {
		Linking.canOpenURL("whatsapp://send?text=teste").then(supported => {
			if (supported) {
				return Linking.openURL(
					"whatsapp://send?phone=5511976546401&text=teste"
				);
			} else {
				return Linking.openURL(
					"https://api.whatsapp.com/send?phone=5511976546401&text=teste"
				);
			}
		});
	}

	data.permissionAndMenu.forEach((menu, index) => {
        if(menu.menuId == 24){
			havePermission = true;
		}
	});

	if(havePermission){
		
		render = <>
					<Header
						centerComponent={
							<Text h4 style={styles.title}>
								Lista de Chamados
							</Text>
						}
						rightComponent={{ icon: "filter-list", color: "#fff" }}
						containerStyle={{
							backgroundColor: COLORS.default,
							paddingTop: 0,
						}}
					/>
					<FlatList
						style={{ flex: 1.8, marginBottom: 20 }}
						contentContainerStyle={ styles.list }
						data={ listDemands.data }
						renderItem={ renderItem }
						keyExtractor={(item, index) => item.ticketId.toString()}
						onEndReached={ getDemands }
						onEndReachedThreshold={ 0.1 }
						onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
						ListFooterComponent={ renderFooter }
						onRefresh={ handlerefresh }
						refreshing={ refreshing }
					/>
					<ActionButton buttonColor="rgba(231,76,60,1)" style={styles.actionButton}>
						<ActionButton.Item
							buttonColor="#34af23"
							title="Whatsapp"
							onPress={ openWhatsapp }
						>
							<Icon name='whatsapp' style={styles.actionButtonIcon} />
						</ActionButton.Item>
						<ActionButton.Item
							buttonColor="#fb8c00"
							title="QrCode"
							onPress={() => props.navigation.navigate("QrCode")}
						>
							<Icon name='qrcode' style={styles.actionButtonIcon} />
						</ActionButton.Item>
						<ActionButton.Item
							buttonColor="#9b59b6"
							title="Novo Chamado"
							onPress={() => props.navigation.navigate("DemandsDetail")}
						>
							<Icon name='plus' style={styles.actionButtonIcon} />
						</ActionButton.Item>
					</ActionButton>
				 </>
	}
	else{
		render = <View style={{flex:1,justifyContent: "center",alignItems: "center"}}>
					<Text style={{textAlignVertical: "center", textAlign: "center", fontSize: 15}}>Módulo de Gestão de Processos não habilitado em sua Assinatura.</Text> 
				 </View>
	
	}
    return (
		<View style={{ flex: 1 }}>
			{render}
		</View>
    );
}

const styles = StyleSheet.create({
	textDemands: { 
		fontWeight: "bold", 
		fontSize: 20 
	},
	textBold: { 
		fontWeight: "bold" 
	},
	title:{ 
		textAlign: "center", 
		color: "#fff" 
	},
	list: {
		paddingHorizontal: 20,
	},	
	actionButton: {
		flex: 0.2 
	},	
	actionButtonIcon: {
		fontSize: 20,
		height: 22,
		color: "white",
	},
	loading: {
		alignSelf: 'center',
		marginVertical: 20,
	},
});