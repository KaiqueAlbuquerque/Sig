import React, { useState, useEffect, PureComponent, useRef } from "react";

import { View, 
		 FlatList, 
		 StyleSheet, 
		 ActivityIndicator, 
		 TouchableOpacity,
		 TouchableWithoutFeedback, 
		 Linking, 
		 Alert,
		 ScrollView,
		 Picker,
		 TextInput } from "react-native";

import ActionButton from "react-native-action-button";
import Icon from 'react-native-vector-icons/FontAwesome';
import RadioForm from 'react-native-simple-radio-button';

import { Card, Header, Text } from "react-native-elements";

import { useSelector } from 'react-redux';

import CrudService from '../../services/Crud/CrudService.js';

import COLORS from '../../styles/Colors.js';

import RBSheet from "react-native-raw-bottom-sheet";

import DateTimePickerModal from "react-native-modal-datetime-picker";

class MyListItem extends PureComponent {
	render() {
		
		let label = this.props.data.labels.find((lbl) => {
			return lbl.typeLabel == 1
		});

		return (
			<TouchableOpacity onPress={() => this.props.navigation.navigate('DemandsDetail', {userData: this.props.data, demandsId: this.props.item.ticketId, createDemands: {}})}>
				<Card containerStyle={{ borderRadius: 15 }}>
					<Text style={styles.textDemands}>{label.name} {this.props.item.code}</Text>
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

	const refRBSheet = useRef();

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
	const [radio, setRadio] = useState(0);
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
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
			
			if(result.status == 200){
				setListDemands({
					data: [...listDemands.data, ...result.data],
					page: listDemands.page + 25,
					loading: false,
				})	
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
                            onPress: () => this.props.navigation.navigate('Home'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }

			setOnEndReachedCalledDuringMomentum(true);
		}
	}

	const handlerefresh = async () => {
		setRefreshing(true);

		setListDemands({
			data: [], 
			page: 0,
			loading: false,
		});

		setOnEndReachedCalledDuringMomentum(false);

		await getDemands();
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
			data={data}
    	/>
	);

	const openWhatsapp = () => {
		Linking.canOpenURL("whatsapp://send?text=teste").then(supported => {
			if (supported) {
				return Linking.openURL(
					"whatsapp://send?phone=5511987511520&text=teste"
				);
			} else {
				return Linking.openURL(
					"https://api.whatsapp.com/send?phone=5511987511520&text=teste"
				);
			}
		});
	}

	const listActionsButtons = () => {

		let actionsButtons = [];
		actionsButtons.push(
			<ActionButton.Item
				buttonColor="#34af23"
				title="Whatsapp"
				onPress={ openWhatsapp }
			>
				<Icon name='whatsapp' style={styles.actionButtonIcon} />
			</ActionButton.Item>
		)

		data.permissionAndMenu.forEach((menu, index) => {
			if((data.userData.userType == 1 && menu.menuId == 26) || data.userData.userType == 2){

				let label = data.labels.find((lbl) => {
					return lbl.typeLabel == 1
				});

				actionsButtons.push(
					<ActionButton.Item
						buttonColor="#fb8c00"
						title="QrCode"
						onPress={() => props.navigation.navigate("QrCode")}
					>
						<Icon name='qrcode' style={styles.actionButtonIcon} />
					</ActionButton.Item>
				);

				actionsButtons.push(
					<ActionButton.Item
						buttonColor="#9b59b6"
						title={`Novo ${label.name}`}
						onPress={() => props.navigation.navigate("DemandsDetail", {userData: data, createDemands: {}})}
					>
						<Icon name='plus' style={styles.actionButtonIcon} />
					</ActionButton.Item>
				);
			}
		});

		return actionsButtons;
	}

	data.permissionAndMenu.forEach((menu, index) => {
        if(menu.menuId == 24){
			havePermission = true;
		}
	});

	var radio_props = [
		{label: 'Criação', value: 0 },
		{label: 'Previsão', value: 1 }
	];

	if(havePermission){
		
		let label = data.labels.find((lbl) => {
			return lbl.typeLabel == 1
		});

		render = <>
					<Header
						centerComponent={
							<Text h4 style={styles.title}>
								Lista de {label.name}
							</Text>
						}
						rightComponent={<TouchableWithoutFeedback onPress={() => refRBSheet.current.open()}>
											<Icon size={25} name='filter' style={{color: "white", marginRight: 10}}/>	
										</TouchableWithoutFeedback>
						}
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
						{ listActionsButtons() }
					</ActionButton>
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
								height: "100%",
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								paddingLeft: 25
							},
							draggableIcon: {
								backgroundColor: "#000"
							}
						}}
					>
						<ScrollView>
							<View style={{paddingRight: 25}}>
								<Text h4 style={{marginBottom:10, marginTop:15, textAlign: 'center'}}>Filtro</Text>

								<Text style={{marginBottom:10}}>Termo:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<TextInput
										multiline={true}
										numberOfLines={2}/>
								</View>

								<DateTimePickerModal
									isVisible={isDatePickerVisible}
									mode={'date'}
									onConfirm={() => setIsDatePickerVisible(false)}
									onCancel={() => setIsDatePickerVisible(false)}
								/>

								<View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:10}}>
									<Text style={{marginBottom:5}}>Tipo de data:</Text>
									<Text style={{marginBottom:5, marginRight:42}}>Data Inicial:</Text>
									<Text style={{marginBottom:5, marginRight:58}}>Data Final:</Text>
								</View>
								<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
									<RadioForm
										radio_props={radio_props}
										initial={0}
										formHorizontal={false}
										labelHorizontal={true}
										animation={true}
										onPress={(value) => {setRadio(value)}}
										buttonSize={15}
									/>
									<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
										<TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
											<TextInput style={styles.input} editable={false}/>
										</TouchableOpacity>
									</View>
									<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
										<TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
											<TextInput style={styles.input} editable={false}/>
										</TouchableOpacity>
									</View>
								</View>

								<Text style={{marginBottom:10, marginTop:10}}>Status:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										onValueChange={(itemValue, itemIndex) =>
											console.log(itemValue)
										}>
										<Picker.Item key={0} value={0} label="TODOS" />
										<Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
										<Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
										<Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
										<Picker.Item key={60} value={60} label="FINALIZADO PELO CLIENTE" />
										<Picker.Item key={70} value={70} label="FINALIZADO PELO OPERADOR" />
										<Picker.Item key={80} value={80} label="REABERTO PELO CLIENTE" />
										<Picker.Item key={90} value={90} label="REABERTO PELO OPERADOR" />
									</Picker>
								</View>

								<Text style={{marginBottom:10}}>Prioridade:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										onValueChange={(itemValue, itemIndex) =>
											console.log(itemValue)
										}>
										<Picker.Item key={0} value={0} label="TODAS" />
										<Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
										<Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
										<Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
									</Picker>
								</View>

								<Text style={{marginBottom:10}}>Operador Responsável:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										onValueChange={(itemValue, itemIndex) =>
											console.log(itemValue)
										}>
										<Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
										<Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
										<Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
									</Picker>
								</View>

								<Text style={{marginBottom:10}}>Cliente:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										onValueChange={(itemValue, itemIndex) =>
											console.log(itemValue)
										}>
										<Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
										<Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
										<Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
									</Picker>
								</View>

								<Text style={{marginBottom:10}}>Contato:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										onValueChange={(itemValue, itemIndex) =>
											console.log(itemValue)
										}>
										<Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
										<Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
										<Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
									</Picker>
								</View>

								<Text style={{marginBottom:10}}>Área:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										onValueChange={(itemValue, itemIndex) =>
											console.log(itemValue)
										}>
										<Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
										<Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
										<Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
									</Picker>
								</View>

								<Text style={{marginBottom:10}}>Categoria:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										onValueChange={(itemValue, itemIndex) =>
											console.log(itemValue)
										}>
										<Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
										<Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
										<Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
									</Picker>
								</View>

								<Text style={{marginBottom:10}}>Assunto:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										onValueChange={(itemValue, itemIndex) =>
											console.log(itemValue)
										}>
										<Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
										<Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
										<Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
									</Picker>
								</View>

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
									>
										<Text style={styles.nextText}>Consultar</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ScrollView>
					</RBSheet>
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

const pickerStyle = {
	inputIOS: {
		color: 'white',
		paddingTop: 13,
		paddingHorizontal: 10,
		paddingBottom: 12,
	},
	inputAndroid: {
		color: 'white',
    },
    fontSize: 30,
	placeholderColor: 'white',
	underline: { borderTopWidth: 0 },
	icon: {
		position: 'absolute',
		backgroundColor: 'transparent',
		borderTopWidth: 5,
		borderTopColor: '#00000099',
		borderRightWidth: 5,
		borderRightColor: 'transparent',
		borderLeftWidth: 5,
		borderLeftColor: 'transparent',
		width: 0,
		height: 0,
		top: 20,
		right: 15,
	},
};

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
	input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: 120
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
    } 
});