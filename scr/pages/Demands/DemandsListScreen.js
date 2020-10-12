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

import { useStateWithCallbackLazy } from 'use-state-with-callback';

import moment from 'moment';

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
		}
	);

	const [listClients, setListClients] = useStateWithCallbackLazy(
		{
			array: [],
			selected: null,
			arrayCombo: []
		}
	);

	const [listPriority, setListPriority] = useState(
		{
			array: [],
			selected: null,
			arrayCombo: []
		}
	);

	const [listOperators, setListOperators] = useState(
		{
			array: [],
			selected: null,
			arrayCombo: []
		}
	);

	const [listContacts, setListContacts] = useStateWithCallbackLazy(
		{
			array: [],
			selected: null,
			arrayCombo: [
				<Picker.Item key={null} value={null} label={`TODOS`} />
			]
		}
	);

	const [listAreas, setListAreas] = useStateWithCallbackLazy(
		{
			array: [],
			selected: null,
			arrayCombo: [
				<Picker.Item key={null} value={null} label={`TODAS`} />
			]
		}
	);

	const [listCategory, setListCategory] = useStateWithCallbackLazy(
		{
			array: [],
			selected: null,
			arrayCombo: [
				<Picker.Item key={null} value={null} label={`TODAS`} />
			]
		}
	);

	const [listSubject, setListSubject] = useStateWithCallbackLazy(
		{
			array: [],
			selected: null,
			arrayCombo: [
				<Picker.Item key={null} value={null} label={`TODOS`} />
			]
		}
	);

	const [status, setStatus] = useState(null);
	const [term, setTerm] = useState("");

	const [refreshing, setRefreshing] = useState(false);
	const [radio, setRadio] = useState(0);
	const [isDatePickerVisibleInitial, setIsDatePickerVisibleInitial] = useState(
		{
			dateShow: null,
			dateSend: null,
			showPicker: false
		}
	);
	const [isDatePickerVisibleEnd, setIsDatePickerVisibleEnd] = useState(
		{
			dateShow: null,
			dateSend: null,
			showPicker: false
		}
	);
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
			
			let result;

			let hasFilter = false;
			let url = "";

			if(term.trim() != ""){
				hasFilter = true;
				url += `&text=${term}`
			}
			if(isDatePickerVisibleInitial.dateSend != null){
				hasFilter = true;

				if(radio == 0){
					url += `&creationInitialDate=${isDatePickerVisibleInitial.dateSend}`;
				}
				else{
					url += `&forecastInitialDate=${isDatePickerVisibleInitial.dateSend}`;
				}
			}
			if(isDatePickerVisibleEnd.dateSend != null){
				hasFilter = true;

				if(radio == 0){
					url += `&creationEndDate=${isDatePickerVisibleEnd.dateSend}`;
				}
				else{
					url += `&forecastEndDate=${isDatePickerVisibleEnd.dateSend}`;
				}
			}
			if(status != null){
				hasFilter = true;
				url += `&status=${status}`;
			}
			if(listPriority.selected != null){
				hasFilter = true;
				url += `&priority=${listPriority.selected}`;
			}
			if(listOperators.selected != null){
				hasFilter = true;
				url += `&operator=${listOperators.selected}`;
			}
			if(listClients.selected != null){
				
				let clientInList = listClients.array.find((cli) => {
					return cli.clientId == listClients.selected;
				});

				hasFilter = true;
				url += `&client=${clientInList.clientHelpDeskId}`;
			}
			if(listContacts.selected != null){
				hasFilter = true;
				url += `&contact=${listContacts.selected}`;
			}
			if(listAreas.selected != null){
				hasFilter = true;
				url += `&area=${listAreas.selected}`;
			}
			if(listCategory.selected != null){
				hasFilter = true;
				url += `&category=${listCategory.selected}`;
			}
			if(listSubject.selected != null){
				hasFilter = true;
				url += `&subject=${listSubject.selected}`;
			}

			if(hasFilter){
				
				if(data.userData.userType == 1){
					result = await crudService.get(`demands/GetDemandsFilter?SignatureId=${data.userData.signatureId}&PersonId=${data.userData.personId}&Page=${listDemands.page}&UserType=1${url}`, data.token);
				}
				else{
					result = await crudService.get(`demands/GetDemandsFilter?Client=${data.userData.clientHelpDeskId}&SignatureId=${data.userData.signatureId}&PersonId=${data.userData.personId}&Page=${listDemands.page}&UserType=2${url}`, data.token);
				}
			}
			else{
				if(data.userData.userType == 1){
					result = await crudService.get(`demands?SignatureId=${data.userData.signatureId}&PersonId=${data.userData.personId}&Page=${listDemands.page}`, data.token);
				}
				else{
					result = await crudService.get(`demands/GetDemandsFilter?Client=${data.userData.clientHelpDeskId}&SignatureId=${data.userData.signatureId}&PersonId=${data.userData.personId}&Page=${listDemands.page}&UserType=2`, data.token);
				}
			}
			
			if(result.status == 200){
				setListDemands({
					data: [...listDemands.data, ...result.data],
					page: listDemands.page + 25,
					loading: false,
				})	
			}
			else if(result.status == 204){
				setListDemands({
					data: [...listDemands.data],
					page: listDemands.page,
					loading: false,
				})	

				let label = data.labels.find((lbl) => {
					return lbl.typeLabel == 1
				});

				Alert.alert(
                    `Sem ${label.name}`,
                    `Ainda não há nenhum ${label.name} para ser listado.`,
                    [
                        {
                            text: "Ok",
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
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

			setOnEndReachedCalledDuringMomentum(true);
		}

		if(data.userData.userType == 1){
			
            let resultClients = await crudService.get(`comboDemands/getComboClients/${data.userData.personId}`, data.token);
        
            if(resultClients.status == 200){
				
				setListClients({
					array: [...resultClients.data],
					selected: listClients.selected,
					arrayCombo: [
						<Picker.Item key={null} value={null} label={`TODOS`} />,
						resultClients.data.map((c, i) => {
							return <Picker.Item key={i} value={c.clientId} label={c.clientName} />
						})
					]
				})
            }
            else if(resultClients.status == 401){
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
            else if(resultClients.status == 400){
                Alert.alert(
                    "Erro",
                    resultClients.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => props.navigation.navigate('DemandsList'),
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
                            onPress: () => props.navigation.navigate('DemandsList'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
			}

			let resultAreas = await crudService.get(`comboDemands/getComboAreaFilter/${data.userData.personId}`, data.token);
			
			if(resultAreas.status == 200){
				setListAreas({
					array: [...resultAreas.data],
					selected: null,
				}, () => {
					setListAreas({
						array: [...resultAreas.data],
						selected: listAreas.selected,
						arrayCombo: [
							<Picker.Item key={null} value={null} label={`TODAS`} />,
							resultAreas.data.map((a, i) => {
								return <Picker.Item key={i} value={a.areaId} label={a.areaName} />
							})
						]
					})
				});
			}
			else if(resultAreas.status == 401){
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
			else if(resultAreas.status == 400){
				Alert.alert(
					"Erro",
					resultAreas.data[0],
					[
						{
							text: "Ok",
							onPress: () => props.navigation.navigate('DemandsList'),
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
							onPress: () => props.navigation.navigate('DemandsList'),
							style: "ok"
						}
					],
					{ cancelable: false }
				);
			}
			
			let resultPriority = await crudService.get(`comboDemands/getComboPriority/${data.userData.signatureId}`, data.token);
        
			if(resultPriority.status == 200){
				setListPriority({
					array: [...resultPriority.data],
					selected: listPriority.selected,
					arrayCombo: [
						<Picker.Item key={null} value={null} label={`TODAS`} />,
						resultPriority.data.map((p, i) => {
							return <Picker.Item key={i} value={p.priorityId} label={p.description} />
						})
					]
				});
			}
			else if(resultPriority.status == 401){
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
			else if(resultPriority.status == 400){
				Alert.alert(
					"Erro",
					resultPriority.data[0],
					[
						{
							text: "Ok",
							onPress: () => props.navigation.navigate('DemandsList'),
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
							onPress: () => props.navigation.navigate('DemandsList'),
							style: "ok"
						}
					],
					{ cancelable: false }
				);
			}

			let resultOperators = await crudService.get(`comboDemands/getComboOperatorsFilter/${data.userData.signatureId}`, data.token);
        
			if(resultOperators.status == 200){
				setListOperators({
					array: [...resultOperators.data],
					selected: listOperators.selected,
					arrayCombo: [
						<Picker.Item key={null} value={null} label={`TODOS`} />,
						resultOperators.data.map((o, i) => {
							return <Picker.Item key={i} value={o.operatorId} label={o.operatorName} />
						})
					]
				});
			}
			else if(resultOperators.status == 401){
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
			else if(resultOperators.status == 400){
				Alert.alert(
					"Erro",
					resultOperators.data[0],
					[
						{
							text: "Ok",
							onPress: () => props.navigation.navigate('DemandsList'),
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
							onPress: () => props.navigation.navigate('DemandsList'),
							style: "ok"
						}
					],
					{ cancelable: false }
				);
			}
        }
        else{
			changeClient(data.userData.clientHelpDeskId);

            setListClients({
				array: listClients.array,
				selected: data.userData.clientHelpDeskId,
				arrayCombo: listClients.arrayCombo
			});

			setListPriority({
				array: listPriority.array,
				selected: null,
				arrayCombo: listPriority.arrayCombo
			});

			setListOperators({
				array: listOperators.array,
				selected: null,
				arrayCombo: listOperators.arrayCombo
			});
        }
	}

	const handleConfirmInitial = (datetime) => {
		
		setIsDatePickerVisibleInitial({
			dateShow: moment(datetime).format("DD/MM/YYYY"),
			dateSend: moment(datetime).format("YYYY/MM/DD 00:00:00"),
			showPicker: false
		});
	}
	
	const handleConfirmEnd = (datetime) => {

		setIsDatePickerVisibleEnd({
			dateShow: moment(datetime).format("DD/MM/YYYY"),
			dateSend: moment(datetime).format("YYYY/MM/DD 23:59:59"),
			showPicker: false
		});
    }

	const changeCategory = async (itemValue) => {

		setListCategory({
			array: [...listCategory.array],
			selected: itemValue,
			arrayCombo: [...listCategory.arrayCombo]
		});

		if(itemValue != null){
			let resultSubject = await crudService.get(`comboDemands/getComboSubject/${itemValue}`, data.token);
            
            if(resultSubject.status == 200){
				
				setListSubject({
					array: [...resultSubject.data],
					selected: null
				}, () => {
					setListSubject({
						array: [...resultSubject.data],
						selected: resultSubject.selected,
						arrayCombo: [
							<Picker.Item key={null} value={null} label={`TODOS`} />,
							resultSubject.data.map((s, i) => {
								return <Picker.Item key={i} value={s.subjectId} label={s.title} />
							})
						]
					})
				});
            }
            else if(resultSubject.status == 401){
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
            else if(resultSubject.status == 400){
                Alert.alert(
                    "Erro",
                    resultSubject.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => props.navigation.navigate('DemandsList'),
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
                            onPress: () => props.navigation.navigate('DemandsList'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
		}
		else{
			setListSubject({
				array: [],
				selected: null
			}, () => {
				setListSubject({
					array: [...listSubject.array],
					selected: listSubject.selected,	
					arrayCombo: [
						<Picker.Item key={null} value={null} label={`TODOS`} />
					]
				});
			});
		}
	}

	const changeArea = async (itemValue) => {

		setListAreas({
			array: listAreas.array,
			selected: itemValue,
			arrayCombo: listAreas.arrayCombo
		});	
		
		if(itemValue != null){

			setListSubject({
				array: [...listSubject.array],
				selected: null
			}, () => {
				setListSubject({
					array: [...listSubject.array],
					selected: listSubject.selected,	
					arrayCombo: [
						<Picker.Item key={null} value={null} label={`TODOS`} />
					]
				});
			});
			
			let resultCategory = await crudService.get(`comboDemands/getComboCategory/${itemValue}`, data.token);
            
            if(resultCategory.status == 200){
                setListCategory({
					array: [...resultCategory.data],
					selected: null,
					arrayCombo: [
						<Picker.Item key={null} value={null} label={`TODAS`} />,
						resultCategory.data.map((c, i) => {
							return <Picker.Item key={i} value={c.categoryId} label={c.categoryName} />
						})
					]
				});
            }
            else if(resultCategory.status == 401){
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
            else if(resultCategory.status == 400){
                Alert.alert(
                    "Erro",
                    resultCategory.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => props.navigation.navigate('DemandsList'),
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
                            onPress: () => props.navigation.navigate('DemandsList'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
		}
		else{
			setListSubject({
				array: [],
				selected: null
			}, () => {
				setListSubject({
					array: [...listSubject.array],
					selected: listSubject.selected,	
					arrayCombo: [
						<Picker.Item key={null} value={null} label={`TODOS`} />
					]
				});
			});

			setListCategory({
				array: [],
				selected: null
			}, () => {
				setListCategory({
					array: [...listCategory.array],
					selected: listCategory.selected,	
					arrayCombo: [
						<Picker.Item key={null} value={null} label={`TODAS`} />
					]
				});
			});
		}
	}

	const changeClient = async (itemValue) => {

		let clientInList = listClients.array.find((cli) => {
			return cli.clientId == itemValue;
		});
		
		setListClients({
			array: listClients.array,
			selected: itemValue,
			arrayCombo: listClients.arrayCombo
		});
		
		if(itemValue != null){
			let resultContacts;
			
            if(data.userData.userType == 1){

				setListCategory({
					array: [...listCategory.array],
					selected: null
				}, () => {
					setListCategory({
						array: [...listCategory.array],
						selected: listCategory.selected,
						arrayCombo: [
							<Picker.Item key={null} value={null} label={`TODAS`} />
						]
					});
				});
	
				setListSubject({
					array: [...listSubject.array],
					selected: null
				}, () => {
					setListSubject({
						array: [...listSubject.array],
						selected: listSubject.selected,
						arrayCombo: [
							<Picker.Item key={null} value={null} label={`TODOS`} />
						]
					});
				});

				resultContacts = await crudService.get(`comboDemands/getComboContact/${clientInList.clientHelpDeskId}`, data.token);
            }
            else{
				resultContacts = await crudService.get(`comboDemands/getComboContact/${itemValue}`, data.token);
			}
			
			if(data.userData.userType == 1 || (data.userData.userType == 2 && listContacts.array.length == 0)){
				if(resultContacts.status == 200){
					setListContacts({
						array: [...resultContacts.data],
						selected: null,
					}, () => {
						setListContacts({
							array: [...resultContacts.data],
							selected: listContacts.selected,
							arrayCombo: [
								<Picker.Item key={null} value={null} label={`TODOS`} />,
								resultContacts.data.map((c, i) => {
									return <Picker.Item key={i} value={c.contactId} label={c.contactName} />
								})
							]
						});
					});
				}
				else if(resultContacts.status == 401){
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
				else if(resultContacts.status == 400){
					Alert.alert(
						"Erro",
						resultContacts.data[0],
						[
							{
								text: "Ok",
								onPress: () => props.navigation.navigate('DemandsList'),
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
								onPress: () => props.navigation.navigate('DemandsList'),
								style: "ok"
							}
						],
						{ cancelable: false }
					);
				}
			}            
		}
		else{
			setListContacts({
				array: [],
				selected: null
			}, () => {
				setListContacts({
					array: [...listContacts.array],
					selected: listContacts.selected,	
					arrayCombo: [
						<Picker.Item key={null} value={null} label={`TODOS`} />
					]
				});
			});
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

		refRBSheet.current.close();
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

	const showQrAndDemandsDetail = (actionsButtons) => {
		
		let label = data.labels.find((lbl) => {
			return lbl.typeLabel == 1
		});

		actionsButtons.push(
			<ActionButton.Item
				buttonColor="#fb8c00"
				title="QrCode"
				onPress={() => props.navigation.navigate("QrCode", {userData: data})}
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

	const listActionsButtons = () => {

		let actionsButtons = [];
		/*actionsButtons.push(
			<ActionButton.Item
				buttonColor="#34af23"
				title="Whatsapp"
				onPress={ openWhatsapp }
			>
				<Icon name='whatsapp' style={styles.actionButtonIcon} />
			</ActionButton.Item>
		)*/

		data.permissionAndMenu.forEach((menu, index) => {
			if(data.userData.userType == 1 && menu.menuId == 26){
				showQrAndDemandsDetail(actionsButtons);
			}
		});

		if(data.userData.userType == 2){
			showQrAndDemandsDetail(actionsButtons);
		}

		return actionsButtons;
	}

	data.permissionAndMenu.forEach((menu, index) => {
        if(menu.menuId == 24){
			havePermission = true;
		}
	});

	var radio_props = data.userData.userType == 1 ? [ {label: 'Criação', value: 0 }, {label: 'Previsão', value: 1 }]
												  : [ {label: 'Criação', value: 0 } ];

	if(havePermission || data.userData.userType == 2){
		
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
						style={{ flex: 1.8, marginBottom: 20, backgroundColor: "#fff" }}
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
										numberOfLines={2}
										value={term}
										onChangeText={text => setTerm(text)}/>
								</View>

								<DateTimePickerModal
									isVisible={isDatePickerVisibleInitial.showPicker}
									mode={'date'}
									onConfirm={handleConfirmInitial}
									onCancel={() => setIsDatePickerVisibleInitial({
										dateShow: null,
										dateSend: null,
										showPicker: false
									})}
								/>

								<DateTimePickerModal
									isVisible={isDatePickerVisibleEnd.showPicker}
									mode={'date'}
									onConfirm={handleConfirmEnd}
									onCancel={() => setIsDatePickerVisibleEnd({
										dateShow: null,
										dateSend: null,
										showPicker: false	
									})}
								/>

								<View style={{flexDirection: 'row', marginTop:10}}>
									<Text style={{marginBottom:5}}>Tipo de data:</Text>
								</View>
								<RadioForm
									radio_props={radio_props}
									initial={0}
									formHorizontal={true}
									labelHorizontal={true}
									animation={true}
									onPress={(value) => {setRadio(value)}}
									buttonSize={15}
									labelStyle={{marginRight: 15}}
								/>
								<View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:10}}>
									<Text style={{marginBottom:5, marginRight:42}}>Data Inicial:</Text>
									<Text style={{marginBottom:5, marginRight:65}}>Data Final:</Text>
								</View>
								<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
									<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
										<TouchableOpacity onPress={() => setIsDatePickerVisibleInitial({
											dateShow: isDatePickerVisibleInitial.dateShow,
											dateSend: isDatePickerVisibleInitial.dateSend,
											showPicker: true
										})}>
											<TextInput style={styles.input} editable={false} value={isDatePickerVisibleInitial.dateShow}/>
										</TouchableOpacity>
									</View>
									<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
										<TouchableOpacity onPress={() => setIsDatePickerVisibleEnd({
											dateShow: isDatePickerVisibleEnd.dateShow,
											dateSend: isDatePickerVisibleEnd.dateSend,
											showPicker: true
										})}>
											<TextInput style={styles.input} editable={false} value={isDatePickerVisibleEnd.dateShow}/>
										</TouchableOpacity>
									</View>
								</View>

								<Text style={{marginBottom:10, marginTop:10}}>Status:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										selectedValue={status}
										onValueChange={(itemValue, itemIndex) =>
											setStatus(itemValue)
										}>
										<Picker.Item key={null} value={null} label="TODOS" />
										<Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
										<Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
										<Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
										<Picker.Item key={60} value={60} label="FINALIZADO PELO CLIENTE" />
										<Picker.Item key={70} value={70} label="FINALIZADO PELO OPERADOR" />
										<Picker.Item key={80} value={80} label="REABERTO PELO CLIENTE" />
										<Picker.Item key={90} value={90} label="REABERTO PELO OPERADOR" />
									</Picker>
								</View>

								{data.userData.userType == 1 && (
									<>
										<Text style={{marginBottom:10}}>Prioridade:</Text>
										<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
											<Picker
												style={pickerStyle}
												selectedValue={listPriority.selected}
												onValueChange={(itemValue, itemIndex) =>
													setListPriority({
														array: listPriority.array,
														selected: itemValue,
														arrayCombo: listPriority.arrayCombo
													})
												}>
												{listPriority.arrayCombo}
											</Picker>
										</View>

										<Text style={{marginBottom:10}}>Operador Responsável:</Text>
										<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
											<Picker
												style={pickerStyle}
												selectedValue={listOperators.selected}
												onValueChange={(itemValue, itemIndex) =>
													setListOperators({
														array: listOperators.array,
														selected: itemValue,
														arrayCombo: listOperators.arrayCombo
													})
												}>
												{listOperators.arrayCombo}
											</Picker>
										</View>

										<Text style={{marginBottom:10}}>Cliente:</Text>
										<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
											<Picker
												style={pickerStyle}
												selectedValue={listClients.selected}
												onValueChange={(itemValue, itemIndex) =>
													changeClient(itemValue)
												}>
												{listClients.arrayCombo}
											</Picker>
										</View>
									</>
								)}

								<Text style={{marginBottom:10}}>Contato:</Text>
								<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
									<Picker
										style={pickerStyle}
										selectedValue={listContacts.selected}
										onValueChange={(itemValue, itemIndex) =>
											setListContacts({
												array: listContacts.array,
												selected: itemValue,
												arrayCombo: listContacts.arrayCombo
											})
										}>
										{listContacts.arrayCombo}
									</Picker>
								</View>
								
								{data.userData.userType == 1 && (
									<>
										<Text style={{marginBottom:10}}>Área:</Text>
										<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
											<Picker
												style={pickerStyle}
												selectedValue={listAreas.selected}
												onValueChange={(itemValue, itemIndex) =>
													changeArea(itemValue)
												}>
												{listAreas.arrayCombo}
											</Picker>
										</View>

										<Text style={{marginBottom:10}}>Categoria:</Text>
										<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
											<Picker
												style={pickerStyle}
												selectedValue={listCategory.selected}
												onValueChange={(itemValue, itemIndex) =>
													changeCategory(itemValue)
												}>
												{listCategory.arrayCombo}
											</Picker>
										</View>

										<Text style={{marginBottom:10}}>Assunto:</Text>
										<View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
											<Picker
												style={pickerStyle}
												selectedValue={listSubject.selected}
												onValueChange={(itemValue, itemIndex) =>
													setListSubject({
														array: [...listSubject.array],
														selected: itemValue,	
														arrayCombo: [...listSubject.arrayCombo]
													})
												}>
												{listSubject.arrayCombo}
											</Picker>
										</View>
									</>
								)}

								<View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
									<TouchableOpacity
										style={styles.nextButton}
										activeOpacity = { .5 }
										onPress={ handlerefresh }
									>
										<Text style={styles.nextText}>Aplicar Filtro</Text>
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
        width: 130
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