import React, { Component, PureComponent } from 'react';

import RBSheet from "react-native-raw-bottom-sheet";
import RBSheet2 from "react-native-raw-bottom-sheet";

import { createMaterialTopTabNavigator } from 'react-navigation';

import { View, 
         ScrollView, 
         StyleSheet, 
         Picker, 
         TextInput, 
         TouchableWithoutFeedback, 
         Dimensions, 
         TouchableOpacity,
         FlatList,
         ActivityIndicator,
         Switch,
         Alert } from 'react-native';
import { Card, Header, Text, Icon, ListItem, CheckBox } from 'react-native-elements';
import Icons from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import COLORS from '../../styles/Colors.js';
import CardFiles from '../Components/CardFiles.js';
import ListInteractionsScreen from '../Interactions/ListInteractionsScreen.js';

import CrudService from '../../services/Crud/CrudService.js';

import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import Modal from 'react-native-modal';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

const width = Dimensions.get('screen').width;

class MyListItem extends PureComponent {
	render() {
		return (
			<TouchableOpacity onPress={() => this.props.changeProduct(this.props.item)}>
				<Card containerStyle={{ borderRadius: 15 }}>
                    <Text>
                        <Text style={styles.textBold}>Código interno:</Text> {this.props.item.internalCode}
                    </Text>
                    <Text>
                        <Text style={styles.textBold}>Descrição:</Text> {this.props.item.productName}
                    </Text>
				</Card>
			</TouchableOpacity>
	  	)
	}
}

export class DemandsDetailScreen extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            client: {
                array: [],
                selected: 0,
                enabled: true,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />
                ]
            },
            contact: {
                array: [],
                selected: 0,
                enabled: true,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />
                ]
            },
            priority: {
                array: [],
                selected: 0,
                enabled: true,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE A PRIORIDADE`} />
                ]
            },
            area: {
                array: [],
                selected: 0,
                enabled: true,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />
                ]
            },
            category: {
                array: [],
                selected: 0,
                enabled: true,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />
                ]
            },
            subject: {
                array: [],
                selected: 0,
                enabled: true,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />
                ]
            },
            products: {
                selectOrChange: "Selecione",
                listProducts: [],
                selected: []
            },
            status: {
                arrayCombo: [
                    <Picker.Item key={0} value={0} label="SELECIONE O STATUS" />,
                    <Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />,
                    <Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
                ],
                statusId: 0,
                enabled: true
            },
            level: {
                levelId: 0,
                enabled: true,
                arrayCombo: [
                    <Picker.Item key={1} value={1} label="NIVEL 1" />,
                    <Picker.Item key={2} value={2} label="NIVEL 2" />,
                    <Picker.Item key={3} value={3} label="NIVEL 3" />
                ]
            },
            descriptionEditable: false,
            canShowPicker: false,
            data: this.props.navigation.state.params,
            dataDemands: null,
            attachmentsList: [],
            sla: "",
            expectedDateTime: "",
            isDatePickerVisible: false,
            switch: {
                isEnabled: false,
                disabled: false
            },
            isLoading: true,
            filesSend: [],
            savedHere: false,
            productsFilter: {
                listProductsBackup: [],
                filterProdut: ""
            },
            updateSupportLevel: false,
            finishDemands: false,
            editDemands: false,
            forwardDemandsOperator: false,
            forwardDemandsArea: false,
            isModalVisible: false,
            operator: {
                array: [],
                selected: 0,
                enabled: false,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`NENHUM OPERADOR RESPONSÁVEL`} />
                ]
            },
            subjectNotFound: false
        }
    }

    pressSubjectNotFound = () => {
        
        this.setState({
            subjectNotFound: !this.state.subjectNotFound,
            subject: {
                array: this.state.subject.array,
                selected: this.state.subjectNotFound ? 0 : null,
                enabled: this.state.subjectNotFound,
                arrayCombo: this.state.subject.arrayCombo
            }  
        });

        if(!this.state.subjectNotFound){
            this.props.navigation.state.params.createDemands.problemId = null;
        }
        else{
            this.props.navigation.state.params.createDemands.problemId = 0;
        }
    }

    confirmChangeProduct = async (productId, labelEquipment) => {

        this.RBSheet.close();

        this.setState({
            isLoading: true
        });

        let demandsId = this.state.data.demandsId == undefined ? this.state.dataDemands : this.state.data.demandsId;

        let crudService = new CrudService();
    
        let result = await crudService.patch(`demands/changeProductDemands/${demandsId}/${productId}`, {}, this.state.data.userData.token);
        
        if(result.status == 200){
            this.setState({
                products: {
                    listProducts: this.state.products.listProducts,
                    selectOrChange: "Trocar",
                    selected: <Text style={{marginBottom:10, fontSize: 15}}>{labelEquipment}</Text>
                }
            });
    
            Alert.alert(
                "Alterado com Sucesso",
                "Equipamento alterado com sucesso.",
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
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );

            this.RBSheet.open();
        }
        else{
            Alert.alert(
                "Erro",
                "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        this.setState({
            isLoading: false
        });
    }

    changeProduct = (product) => {

        let labelEquipment = "Nenhum Equipamento!";
        if(product.internalCode != null && product.internalCode != "" && product.productName != null && product.productName != ""){
            labelEquipment = `${product.internalCode} - ${product.productName}`;
        }
        else if((product.internalCode == null || product.internalCode == "") && (product.productName != null && product.productName != "")){
            labelEquipment = `${product.productName}`;
        }
        else if((product.internalCode != null && product.internalCode != "") && (product.productName == null || product.productName == "")){
            labelEquipment = `${product.internalCode}`;
        }

        if(this.state.data.demandsId == undefined && this.state.dataDemands == undefined){
            this.setState({
                products: {
                    listProducts: this.state.products.listProducts,
                    selectOrChange: "Trocar",
                    selected: <Text style={{marginBottom:10, fontSize: 15}}>{labelEquipment}</Text>
                }
            });
    
            this.props.navigation.state.params.createDemands.productId = product.productId;
    
            this.RBSheet.close();
        }
        else{
            Alert.alert(
                "Troca de produto",
                "Confirma troca do produto?",
                [
                    {
                        text: "Não",
                        style: "nok"
                    },
                    {
                        text: "Sim",
                        onPress: () => this.confirmChangeProduct(product.productId, labelEquipment),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
    }

    populateClient = () => {

        this.setState({
            client: {
                array: [...this.state.client.array],
                selected: this.state.client.selected,
                enabled: this.state.client.enabled,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />,
                    this.state.client.array.map((c, i) => {
                        return <Picker.Item key={i} value={c.clientId} label={c.clientName} />
                    })
                ]
            }
        })
    }

    populatePriority = () => {

        this.setState({
            priority: {
                array: [...this.state.priority.array],
                selected: this.state.priority.selected,
                enabled: this.state.priority.enabled,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE A PRIORIDADE`} />,
                    this.state.priority.array.map((p, i) => {
                        return <Picker.Item key={i} value={p.priorityId} label={p.description} />
                    })
                ]
            }
        })        
    }

    populateContact = () => {

        this.setState({
            contact: {
                array: [...this.state.contact.array],
                selected: this.state.contact.selected,
                enabled: this.state.contact.enabled,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O CONTATO`} />,
                    this.state.contact.array.map((c, i) => {
                        return <Picker.Item key={i} value={c.contactId} label={c.contactName} />
                    })   
                ]
            }
        });
        
        this.props.navigation.state.params.createDemands.contactId = this.state.contact.selected;
    }

    populateArea = () => {

        this.setState({
            area: {
                array: [...this.state.area.array],
                selected: this.state.area.selected,
                enabled: this.state.area.enabled,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE A ÁREA`} />,
                    this.state.area.array.map((a, i) => {
                        return <Picker.Item key={i} value={a.areaId} label={a.areaName} />
                    })   
                ]
            }
        });
        
        this.props.navigation.state.params.createDemands.sectorHelpDeskId = this.state.area.selected;     
    }

    populateCategory = () => {

        this.setState({
            category: {
                array: [...this.state.category.array],
                selected: this.state.category.selected,
                enabled: this.state.category.enabled,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE A CATEGORIA`} />,
                    this.state.category.array.map((c, i) => {
                        return <Picker.Item key={i} value={c.categoryId} label={c.categoryName} />
                    })
                ]
            }
        }, () => {
            if(this.state.dataDemands != null)
            {
                this.changeCategory(this.state.dataDemands.categoryId);
            }
        });

        this.props.navigation.state.params.createDemands.categoryId = this.state.category.selected;
    }
    
    populateSubject = () => {

        this.setState({
            subject: {
                array: [...this.state.subject.array],
                enabled: this.state.subject.enabled,
                selected: this.state.subject.selected,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O ASSUNTO`} />,
                    this.state.subject.array.map((s, i) => {
                        return <Picker.Item key={i} value={s.subjectId} label={s.title} />
                    })
                ]
            }
        }, () => {
            if(this.state.dataDemands != null && !this.state.canShowPicker && !this.state.forwardDemandsArea)
            {
                this.changeSubject(this.state.dataDemands.subjectId);
            }
        });
        
        this.props.navigation.state.params.createDemands.problemId = this.state.subject.selected;
    }

    changeLevel = (itemValue) => {

        this.setState({
            level: {
                levelId: itemValue,
                enabled: this.state.level.enabled,
                arrayCombo: this.state.level.arrayCombo
            }
        });

        this.props.navigation.state.params.createDemands.supportLevel = itemValue;
    }

    changeStatus = (itemValue) => {

        this.setState({
            status: {
                statusId: itemValue,
                enabled: this.state.status.enabled,
                arrayCombo: [...this.state.status.arrayCombo]
            }
        });

        this.props.navigation.state.params.createDemands.currentStatusId = itemValue;
    }

    changePriority = (itemValue) => {

        this.setState({
            priority: {
                array: [...this.state.priority.array],
                selected: itemValue,
                enabled: this.state.priority.enabled,
                arrayCombo: [...this.state.priority.arrayCombo]
            }
        });

        this.props.navigation.state.params.createDemands.priorityId = itemValue;
    }

    changeContact = (itemValue) => {

        this.setState({
            contact: {
                array: [...this.state.contact.array],
                selected: itemValue,
                enabled: this.state.contact.enabled,
                arrayCombo: [...this.state.contact.arrayCombo]
            }
        });

        this.props.navigation.state.params.createDemands.contactId = itemValue;
    }

    changeClient = async (itemValue) => {
        
        this.setState({
            client: {
                array: [...this.state.client.array],
                arrayCombo: [...this.state.client.arrayCombo],
                enabled: this.state.client.enabled,
                selected: itemValue
            },
            products: {
                selectOrChange: this.state.products.selectOrChange,
                listProducts: [],
                selected: this.state.products.selected
            },
            productsFilter: {
                listProductsBackup: [],
                filterProdut: ""
            },
            sla: "",
            expectedDateTime: '',
            switch: {
                isEnabled: false,
                disabled: this.state.switch.disabled
            }
        });    

        let clientInList = this.state.client.array.find((cli) => {
            return cli.clientId == itemValue;
        })

        this.props.navigation.state.params.createDemands.forecast = '';
        
        if(itemValue != 0){

            if(clientInList != null){
                this.props.navigation.state.params.createDemands.clientHelpDeskId = clientInList.clientHelpDeskId;
            }

            this.setState({
                category: {
                    array: [...this.state.category.array],
                    enabled: this.state.category.enabled,
                    selected: this.state.category.selected
                },
            }, () => {
                this.setState({
                    category: {
                        array: [...this.state.category.array],
                        enabled: this.state.category.enabled,
                        selected: this.state.category.selected,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE A ÁREA`} />
                        ]
                    }
                });
                
                this.props.navigation.state.params.createDemands.categoryId = this.state.category.selected;
            })
            this.setState({
                subject: {
                    array: [...this.state.subject.array],
                    enabled: this.state.subject.enabled,
                    selected: this.state.subject.selected
                }
            }, () => {
                this.setState({
                    subject: {
                        array: [...this.state.subject.array],
                        enabled: this.state.subject.enabled,
                        selected: this.state.subject.selected,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE A ÁREA`} />
                        ]
                    }
                });
                
                this.props.navigation.state.params.createDemands.problemId = this.state.subject.selected;
            })

            let crudService = new CrudService();
            let resultAreas;

            if(this.state.data.userData.userData.userType == 1){
                let resultContacts = await crudService.get(`comboDemands/getComboContact/${clientInList.clientHelpDeskId}`, this.state.data.userData.token);
            
                if(resultContacts.status == 200){
                    this.setState({
                        contact: {
                            array: [...resultContacts.data],
                            selected: this.state.contact.selected,
                            enabled: this.state.contact.enabled
                        }
                    }, this.populateContact);
                }
                else if(resultContacts.status == 401){
                    Alert.alert(
                        "Sessão Expirada",
                        "Sua sessão expirou. Por favor, realize o login novamente.",
                        [
                            {
                                text: "Ok",
                                onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                                onPress: () => this.props.navigation.navigate('DemandsList'),
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
                                onPress: () => this.props.navigation.navigate('DemandsList'),
                                style: "ok"
                            }
                        ],
                        { cancelable: false }
                    );
                }

                resultAreas = await crudService.get(`comboDemands/getComboArea?clientHelpDeskId=${clientInList.clientHelpDeskId}&PersonId=${this.state.data.userData.userData.personId}&UserType=${this.state.data.userData.userData.userType}`, this.state.data.userData.token);
            }
            else{
                resultAreas = await crudService.get(`comboDemands/getComboArea?clientHelpDeskId=${this.state.data.userData.userData.clientHelpDeskId}&PersonId=${this.state.data.userData.userData.personId}&UserType=${this.state.data.userData.userData.userType}`, this.state.data.userData.token);
            }
            
            if(resultAreas.status == 200){
                this.setState({
                    area:{
                        array: [...resultAreas.data],
                        selected: this.state.area.selected,
                        enabled: this.state.area.enabled
                    }
                }, this.populateArea);
            }
            else if(resultAreas.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }

            let resultProducts;

            if(this.state.data.userData.userData.userType == 1){
                resultProducts = await crudService.get(`comboDemands/getComboProduct/${itemValue}`, this.state.data.userData.token);
            }
            else{
                resultProducts = await crudService.get(`comboDemands/getComboProduct/${this.state.data.userData.userData.clientId}`, this.state.data.userData.token);
            }
                
            if(resultProducts.status == 200){
                this.setState({
                    products: {
                        listProducts: resultProducts.data,
                        selectOrChange: this.state.products.selectOrChange,
                        selected: this.state.products.selected
                    },
                    productsFilter: {
                        listProductsBackup: resultProducts.data,
                        filterProdut: ""
                    }
                })
            }
            else if(resultProducts.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmail'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if(resultProducts.status == 400){
                Alert.alert(
                    "Erro",
                    resultProducts.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('DemandsList'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
        }
        else{
            this.props.navigation.state.params.createDemands.clientHelpDeskId = 0;

            this.setState({
                contact: {
                    array: [],
                    selected: 0,
                    enabled: true,
                }
            }, () => {
                this.setState({
                    contact: {
                        array: [...this.state.contact.array],
                        selected: this.state.contact.selected,
                        enabled: this.state.contact.enabled,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />
                        ]
                    }
                });

                this.props.navigation.state.params.createDemands.contactId = this.state.contact.selected;
            })
            this.setState({
                area: {
                    array: [],
                    selected: 0,
                    enabled: true
                }
            }, () => {
                this.setState({
                    area: {
                        array: [...this.state.area.array],
                        selected: this.state.area.selected,
                        enabled: this.state.area.enabled,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />
                        ]
                    }
                });

                this.props.navigation.state.params.createDemands.sectorHelpDeskId = this.state.area.selected;
            })
            this.setState({
                category: {
                    array: [],
                    enabled: true,
                    selected: 0
                }
            }, () => {
                this.setState({
                    category: {
                        array: [...this.state.category.array],
                        enabled: this.state.category.enabled,
                        selected: this.state.category.selected,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />
                        ]
                    }
                });

                this.props.navigation.state.params.createDemands.categoryId = this.state.category.selected;
            })
            this.setState({
                subject: {
                    array: [],
                    enabled: true,
                    selected: 0
                }
            }, () => {
                this.setState({
                    subject: {
                        array: [...this.state.subject.array],
                        selected: this.state.subject.selected,
                        enabled: this.state.subject.enabled,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />
                        ]
                    }
                });

                this.props.navigation.state.params.createDemands.problemId = this.state.subject.selected;
            })
        }
    }

    changeArea = async (itemValue) => {
        
        this.setState({
            area: {
                array: [...this.state.area.array],
                selected: itemValue,
                enabled: this.state.area.enabled,
                arrayCombo: [...this.state.area.arrayCombo]
            }
        });

        if(!this.state.forwardDemandsArea){
            this.setState({
                sla: "",
                expectedDateTime: '',
                switch: {
                    isEnabled: false,
                    disabled: this.state.switch.disabled
                }
            });
        }

        this.props.navigation.state.params.createDemands.forecast = '';
        this.props.navigation.state.params.createDemands.sectorHelpDeskId = itemValue;

        if(itemValue != 0){
            this.setState({
                subject: {
                    array: [...this.state.subject.array],
                    enabled: this.state.subject.enabled,
                    selected: 0
                }
            }, () => {
                this.setState({
                    subject: {
                        array: [...this.state.subject.array],
                        enabled: this.state.subject.enabled,
                        selected: this.state.subject.selected,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE A CATEGORIA`} />,
                        ],
                    }                    
                });

                this.props.navigation.state.params.createDemands.problemId = this.state.subject.selected;
            });

            let crudService = new CrudService();

            let resultCategory = await crudService.get(`comboDemands/getComboCategory/${itemValue}`, this.state.data.userData.token);
            
            if(resultCategory.status == 200){
                this.setState({
                    category: {
                        array: [...resultCategory.data],
                        enabled: this.state.category.enabled,
                        selected: 0
                    }
                }, this.populateCategory);
            }
            else if(resultCategory.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
        }
        else{
            this.setState({
                subject: {
                    array: [],
                    enabled: true,
                    selected: 0,
                }
            }, () => {
                this.setState({
                    subject: {
                        array: [...this.state.subject.array],
                        enabled: this.state.subject.enabled,
                        selected: this.state.subject.selected,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE A ÁREA`} />
                        ],
                    }
                });

                this.props.navigation.state.params.createDemands.problemId = this.state.subject.selected;
            })
            this.setState({
                category: {
                    array: [],
                    enabled: true,
                    selected: 0
                }
            }, () => {
                this.setState({
                    category: {
                        array: [...this.state.category.array],
                        enabled: this.state.category.enabled,
                        selected: this.state.category.selected,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE A ÁREA`} />
                        ],
                    }
                });

                this.props.navigation.state.params.createDemands.categoryId = this.state.category.selected;
            })
        }
    }

    changeCategory = async (itemValue) => {
        
        let enable = true;
        if(this.state.dataDemands != null && !this.state.canShowPicker && !this.state.forwardDemandsArea)
            enable = false;

        this.setState({
            category: {
                array: [...this.state.category.array],
                enabled: enable,
                selected: itemValue,
                arrayCombo: [...this.state.category.arrayCombo]
            }
        });

        if(!this.state.forwardDemandsArea){
            this.setState({
                sla: "",
                expectedDateTime: '',
                switch: {
                    isEnabled: false,
                    disabled: this.state.switch.disabled
                }
            });
        }

        this.props.navigation.state.params.createDemands.forecast = '';
        this.props.navigation.state.params.createDemands.categoryId = itemValue;

        if(itemValue != 0){
            let crudService = new CrudService();

            let resultSubject = await crudService.get(`comboDemands/getComboSubject/${itemValue}`, this.state.data.userData.token);
            
            if(resultSubject.status == 200){
                this.setState({
                    subject: {
                        array: [...resultSubject.data],
                        enabled: this.state.subject.enabled,
                        selected: 0
                    }
                }, this.populateSubject);
            }
            else if(resultSubject.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
        }
        else{
            this.setState({
                subject: {
                    array: [],
                    enabled: true,
                    selected: 0
                }
            }, () => {
                this.setState({
                    subject: {
                        array: [...this.state.subject.array],
                        enabled: this.state.subject.enabled,
                        selected: this.state.subject.selected,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE A CATEGORIA`} />,
                        ],
                    }
                });
                
                this.props.navigation.state.params.createDemands.problemId = this.state.subject.selected;
            })
        }
    }

    changeSubject = (itemValue) => {
        
        let slaReturn = this.state.subject.array.find((obj) => {
            return obj.subjectId == itemValue;
        });
            
        let sla = "";
        let enable = true;
        
        if(slaReturn != undefined){
            
            if(slaReturn.days > 0)
                sla = slaReturn.days == 1 ? `${slaReturn.days} dia` : `${slaReturn.days} dias`;
            else
                sla = slaReturn.time;
            
            if(this.state.dataDemands == null || this.state.canShowPicker || this.state.forwardDemandsArea){
                
                if(!this.state.forwardDemandsArea){
                    this.setState({
                        sla: sla,
                        expectedDateTime: moment(slaReturn.expectedDate).format("DD/MM/YYYY HH:mm"),
                        switch: {
                            isEnabled: false,        
                            disabled: this.state.switch.disabled
                        }
                    });
    
                    this.props.navigation.state.params.createDemands.forecast = moment(slaReturn.expectedDate).format("YYYY/MM/DD HH:mm");
                }
            }
            else{
                if(this.state.dataDemands.forecast != null){
                    
                    this.setState({
                        sla: sla,
                        expectedDateTime: moment(this.state.dataDemands.forecast).format("DD/MM/YYYY HH:mm"),
                        switch: {
                            isEnabled: this.state.dataDemands.noExpectedDate,        
                            disabled: this.state.switch.disabled
                        }      
                    });

                    this.props.navigation.state.params.createDemands.forecast = moment(this.state.dataDemands.forecast).format("YYYY/MM/DD HH:mm");
                }
                else{

                    this.setState({
                        sla: sla,
                        expectedDateTime: "",
                        switch: {
                            isEnabled: this.state.dataDemands.noExpectedDate,        
                            disabled: this.state.switch.disabled
                        }         
                    });

                    this.props.navigation.state.params.createDemands.forecast = "";
                }

                enable = false;
            }
        }
        else{
            enable = false;
        }

        this.setState({
            subject: {
                array: [...this.state.subject.array],
                enabled: enable,
                selected: itemValue, 
                arrayCombo: [...this.state.subject.arrayCombo]   
            }     
        }, () => {
            if(itemValue == null){
                this.setState({
                    subject: {
                        array: [...this.state.subject.array],
                        enabled: this.state.subject.enabled,
                        selected: this.state.subject.selected, 
                        arrayCombo: [
                            <Picker.Item key={null} value={null} label={`NÃO DEFINIDO!`} />,
                            ...this.state.subject.arrayCombo
                        ]   
                    },
                    sla: "Não definido!"     
                });
            }
        });

        this.props.navigation.state.params.createDemands.problemId = itemValue;
    }

    removeAttachment = (index) => {
        
        this.setState({
            filesSend: this.state.filesSend.filter((attachment) => {
                if(attachment.index != index){
                    return attachment;
                };
            })
        }, () => {
            this.insertFileGallery();
            this.props.navigation.state.params.createDemands.filesSend = this.state.filesSend;
        })
    }

    insertFileGallery = () => {
        
        if(this.state.filesSend.length >= 0){
            
            let listAttachments = this.state.filesSend.map((attachment, index) => {
                
                attachment.index = index;

                let number = 20;
                if(index == 0){
                    number = 0
                }

                let arrayName = attachment.name.split('.');
                let iconName = arrayName[arrayName.length-1];
                iconName = iconName.toLowerCase();
                let path = '';

                if(iconName == "csv"){
                    path = require("../../assets/img/icons/csv.png");
                }
                else if(iconName == "doc" || iconName == "docx"){
                    path = require("../../assets/img/icons/doc.png");
                }
                else if(iconName == "exe"){
                    path = require("../../assets/img/icons/exe.png");
                }
                else if(iconName == "jpg" || iconName == "jpeg"){
                    path = require("../../assets/img/icons/jpg.png");
                }
                else if(iconName == "mp3"){
                    path = require("../../assets/img/icons/mp3.png");
                }
                else if(iconName == "iso" ){
                    path = require("../../assets/img/icons/iso.png");
                }
                else if(iconName == "mp4"){
                    path = require("../../assets/img/icons/mp4.png");
                }
                else if(iconName == "pdf"){
                    path = require("../../assets/img/icons/pdf.png");
                }
                else if(iconName == "png"){
                    path = require("../../assets/img/icons/png.png");
                }
                else if(iconName == "ppt" || iconName == "pptx"){
                    path = require("../../assets/img/icons/ppt.png");
                }
                else if(iconName == "txt"){
                    path = require("../../assets/img/icons/txt.png");
                }
                else if(iconName == "xls" || iconName == "xlsx"){
                    path = require("../../assets/img/icons/xls.png");
                }
                else if(iconName == "xml"){
                    path = require("../../assets/img/icons/xml.png");
                }
                else if(iconName == "zip" || iconName == "7z"){
                    path = require("../../assets/img/icons/zip.png");
                }
                else{
                    path = require("../../assets/img/icons/documento.png");
                }

                return <CardFiles 
                            imageUri={path}
                            attachment={attachment}
                            left={number}
                            userData={this.state.data.userData}
                            navigation={this.props.navigation}
                            removeAttachment={this.removeAttachment}
                        />
            });

            if(this.state.filesSend.length > 0){
                let component = <View style={{ height: 130, marginTop: 10 }}>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {listAttachments}
                                    </ScrollView>
                                </View>

                this.setState({
                    attachmentsList: component
                });
            }
            else{
                this.setState({
                    attachmentsList: []
                });
            }
        }
    }

    openPicker = () => {
            
        ImagePicker.showImagePicker({
            title: 'Anexos',
            customButtons: [
                {name: 'photo', title: 'Tirar foto...'},
                {name: 'video', title: 'Gravar vídeo...'},
                {name: 'files', title: 'Enviar arquivos...'},
            ],
            chooseFromLibraryButtonTitle: null,
            takePhotoButtonTitle: null,
            cancelButtonTitle: "CANCELAR"
        }, async (datas) => {
            if(datas.customButton == 'photo'){
                ImagePicker.launchCamera({mediaType: 'photo'}, (response) => {
                    
                })
            }
            else if(datas.customButton == 'video'){
                ImagePicker.launchCamera({mediaType: 'video'}, (response) => {
                    if((response.didCancel == undefined) || (response.didCancel != undefined && !response.didCancel)){
                        let arrayPath = response.path.split("/");

                        let file = {
                            uri: response.uri,
                            name: arrayPath[arrayPath.length-1],
                            type: "video/mp4"
                        };
        
                        this.setState({
                            filesSend: [...this.state.filesSend, file]
                        }, () => {
                            this.insertFileGallery();
                            this.props.navigation.state.params.createDemands.filesSend = this.state.filesSend;
                        });
                    }
                })
            }
            else if(datas.customButton == 'files'){
                try {
                    const results = await DocumentPicker.pickMultiple({
                        type: [DocumentPicker.types.allFiles],
                    });
                    for (const res of results) {
                        let file = {
                            uri: res.uri,
                            name: res.name,
                            type: res.type
                        };
        
                        this.setState({
                            filesSend: [...this.state.filesSend, file]
                        }, () => {
                            this.insertFileGallery();
                            this.props.navigation.state.params.createDemands.filesSend = this.state.filesSend;
                        });
                    }
                } 
                catch (err) {
                    if (DocumentPicker.isCancel(err)) {
                        // User cancelled the picker, exit any dialogs or menus and move on
                    } 
                    else {
                        throw err;
                    }
                }
            }
            else{
                if((datas.didCancel == undefined) || (datas.didCancel != undefined && !datas.didCancel)){
                    let file = {
                        uri: datas.uri,
                        name: datas.fileName,
                        type: datas.type
                    };
    
                    this.setState({
                        filesSend: [...this.state.filesSend, file]
                    }, () => {
                        this.insertFileGallery();
                        this.props.navigation.state.params.createDemands.filesSend = this.state.filesSend;
                    });
                }
            }
        });
    }

    renderItem = ({ item }) => (
		<MyListItem
            item={item}
            changeProduct={this.changeProduct}
    	/>
    );
    
    handleConfirm = (datetime) => {
        this.setState({
            isDatePickerVisible: false,
            expectedDateTime: moment(datetime).format("DD/MM/YYYY HH:mm"),
            switch: {
                isEnabled: false,        
                disabled: this.state.switch.disabled
            }
        });

        this.props.navigation.state.params.createDemands.forecast = moment(datetime).format("YYYY/MM/DD HH:mm");
    }

    hideDatePicker = () => {
        this.setState({
            isDatePickerVisible: false
        })
    }

    showPicker = () => {
        
        if(this.state.dataDemands == null || this.state.canShowPicker){
            this.setState({
                isDatePickerVisible: true
            })
        }
    }

    toggleSwitch = () => {

        this.props.navigation.state.params.createDemands.noExpectedDate = !this.state.switch.isEnabled;
        this.props.navigation.state.params.createDemands.forecast = '';

        this.setState({
            switch: {
                isEnabled: !this.state.switch.isEnabled,        
                disabled: this.state.switch.disabled
            },
            expectedDateTime: ''
        });
    }

    showDemandsId = () => {
        
        if(this.state.data.demandsId != undefined && this.state.dataDemands != undefined){
            return  <>
                        <Text style={{marginBottom:5}}>Número:</Text>
                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                            <TextInput style={styles.input} 
                                editable={false}
                                value={this.state.dataDemands.codeId.toString()}/>
                        </View>
                    </>
        }
    }

    showCreationDate = () => {
        
        if(this.state.data.demandsId != undefined && this.state.dataDemands != undefined){
            return  <>
                        <Text style={{marginBottom:5}}>Data Criação:</Text>
                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                            <TextInput style={styles.input} 
                                editable={false}
                                value={moment(this.state.dataDemands.creationDate).format("DD/MM/YYYY HH:mm")}/>
                        </View>
                    </>
        }
    }

    showCreatedBy = () => {
        
        if(this.state.data.demandsId != undefined && this.state.dataDemands != undefined){
            return  <>
                        <Text style={{marginBottom:5}}>Criado Por:</Text>
                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                            <TextInput style={styles.input} 
                                editable={false}
                                value={this.state.dataDemands.createdBy}/>
                        </View>
                    </>
        }
    }

    showResponsibleOperator = () => {
        
        if(this.state.data.demandsId != undefined && this.state.dataDemands != undefined){
            
            return  <>
                        <Text style={{marginBottom:5}}>Operador Responsável:</Text>
                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                            <Picker
                                enabled={this.state.operator.enabled}
                                style={pickerStyle}
                                selectedValue={this.state.operator.selected}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({
                                        operator: {
                                            array: this.state.operator.array,
                                            selected: itemValue,
                                            enabled: this.state.operator.enabled,
                                            arrayCombo: this.state.operator.arrayCombo
                                        }
                                    })
                                }>
                                    {this.state.operator.arrayCombo}
                            </Picker>
                        </View>
                    </>
        }
    }

    showEndDate = () => {
        
        if(this.state.data.demandsId != undefined && this.state.dataDemands != undefined && (this.state.dataDemands.statusId == 70 || this.state.dataDemands.statusId == 60)){
            return  <>
                        <Text style={{marginBottom:5}}>Data de Finalização:</Text>
                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                            <TextInput style={styles.input} 
                                editable={false}
                                value={moment(this.state.dataDemands.endDate).format("DD/MM/YYYY HH:mm")}/>
                        </View>
                    </>
        }
    }

    showFinishingUser = () => {
        
        if(this.state.data.userData.userData.userType == 1 && this.state.data.demandsId != undefined && this.state.dataDemands != undefined && (this.state.dataDemands.statusId == 70 || this.state.dataDemands.statusId == 60)){
            return  <>
                        <Text style={{marginBottom:5}}>Finalizado Por:</Text>
                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                            <TextInput style={styles.input} 
                                editable={false}
                                value={this.state.dataDemands.finishingUser}/>
                        </View>
                    </>
        }
    }

    showTotalService = () => {
        
        if(this.state.data.userData.userData.userType == 1 && this.state.data.demandsId != undefined && this.state.dataDemands != undefined && (this.state.dataDemands.statusId == 70 || this.state.dataDemands.statusId == 60)){
            return  <>
                        <Text style={{marginBottom:5, marginTop:10}}>Tempo de Duração:</Text>
                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                            <TextInput style={styles.input} 
                                editable={false}
                                value={this.state.dataDemands.totalService}/>
                        </View>
                    </>
        }
    }

    showDescription = () => {

        if(this.state.data.demandsId != undefined && this.state.dataDemands != undefined){
            return  <>
                        <Text style={{marginBottom:5, marginTop: 10}}>Descrição:</Text>
                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>             
                            <TextInput
                                editable={this.state.descriptionEditable}
                                multiline={true}
                                numberOfLines={3}
                                onChangeText={(text) => this.setState(prevState => ({
                                    dataDemands: {
                                        ...prevState.dataDemands,
                                        description: text    
                                    }
                                }))}
                                value={this.state.dataDemands.description}/>
                        </View>
                    </>
        }
    }

    closeForwardDemandsOperator = () => {

        this.setState({
            forwardDemandsOperator: false,
            operator: {
                array: this.state.operator.array,
                selected: this.state.operator.selected,
                enabled: false,
                arrayCombo: this.state.operator.arrayCombo
            },
        });
    }

    closeForwardDemandsArea = async () => {
        
        this.setState({
            forwardDemandsArea: false,
            isLoading: true
        });

        await this.commonDidMount();

        this.setState({
            isLoading: false
        });
    }

    saveForwardDemandsOperator = async () => {

        this.setState({
            isLoading: true
        });

        let operatorObj = this.state.operator.array.find(operator => {
            return operator.operatorId === this.state.operator.selected;
        });

        let label = this.props.navigation.state.params.userData.labels.find((lbl) => {
            return lbl.typeLabel == 1
        });

        let data = {
            signatureId: this.state.data.userData.userData.signatureId,
            demandsId: this.state.data.demandsId,
            operatorId: this.state.operator.selected,
            name: operatorObj.operatorName,
            userHelpDeskId: this.state.data.userData.userData.userHelpDeskId,
            userType: this.state.data.userData.userData.userType,
            term: label.name
        }

        let crudService = new CrudService();
        
        let result = await crudService.patch(`demands/forwardDemandsOperator/${this.state.data.demandsId}`, data, this.state.data.userData.token);
        
        if(result.status == 200){
            
            this.setState({
                forwardDemandsOperator: false,
                operator: {
                    array: this.state.operator.array,
                    selected: this.state.operator.selected,
                    enabled: false,
                    arrayCombo: this.state.operator.arrayCombo
                },
            })

            await this.commonDidMount();
            
            Alert.alert(
                "Encaminhado com Sucesso.",
                `${label.name} encaminhado com sucesso.`,
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
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        this.setState({
            isLoading: false
        });
    }

    saveForwardDemandsArea = async () => {

        this.setState({
            isLoading: true
        });

        let areaObj = this.state.area.array.find(area => {
            return area.areaId === this.state.area.selected;
        });

        let label = this.props.navigation.state.params.userData.labels.find((lbl) => {
            return lbl.typeLabel == 1
        });

        let data = {
            demandsId: this.state.data.demandsId,
            areaId: this.state.area.selected,
            categoryId: this.state.category.selected,
            subjectId: this.state.subject.selected,
            name: areaObj.areaName,
            userHelpDeskId: this.state.data.userData.userData.userHelpDeskId,
            userType: this.state.data.userData.userData.userType,
            term: label.name
        }

        let crudService = new CrudService();
        
        let result = await crudService.patch(`demands/forwardDemandsArea/${this.state.data.demandsId}`, data, this.state.data.userData.token);
        
        if(result.status == 200){
            
            this.setState({
                forwardDemandsArea: false,
                area: {
                    array: this.state.area.array,
                    selected: this.state.area.selected,
                    enabled: false,
                    arrayCombo: this.state.area.arrayCombo
                },
                category: {
                    array: this.state.category.array,
                    selected: this.state.category.selected,
                    enabled: false,
                    arrayCombo: this.state.category.arrayCombo
                },
                subject: {
                    array: this.state.subject.array,
                    selected: this.state.subject.selected,
                    enabled: false,
                    arrayCombo: this.state.subject.arrayCombo
                }
            })

            await this.commonDidMount();
            
            Alert.alert(
                "Encaminhado com Sucesso.",
                `${label.name} encaminhado com sucesso.`,
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('DemandsList'),
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
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        this.setState({
            isLoading: false
        });
    }

    clickForwardArea = async () => {

        let clientInList = this.state.client.array.find((cli) => {
            return cli.clientId == this.state.client.selected;
        });

        let crudService = new CrudService();
        let result = await crudService.get(`comboDemands/getComboAreaForward/${clientInList.clientHelpDeskId}`, this.state.data.userData.token);
        
        if(result.status == 200){

            if(this.state.subject.selected == null){
                this.state.subject.arrayCombo.shift();
            }

            this.setState({
                area:{
                    array: [...result.data],
                    selected: this.state.area.selected,
                    enabled: this.state.area.enabled
                }
            }, this.populateArea);
        }
        else if(result.status == 401){
            Alert.alert(
                "Sessão Expirada",
                "Sua sessão expirou. Por favor, realize o login novamente.",
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        this.setState({
            isModalVisible: false,
            forwardDemandsArea: true,
            area: {
                array: this.state.area.array,
                selected: this.state.area.selected,
                enabled: true,
                arrayCombo: this.state.area.arrayCombo
            },
            category: {
                array: this.state.category.array,
                selected: this.state.category.selected,
                enabled: true,
                arrayCombo: this.state.category.arrayCombo
            },
            subject: {
                array: this.state.subject.array,
                selected: this.state.subject.selected,
                enabled: true,
                arrayCombo: this.state.subject.arrayCombo
            }
        });

        this.downButtonHandler(-40);
    }

    showSaveButton = () => {
        
        if(this.state.updateSupportLevel == true){
            
            return  <View style={{flexDirection: 'row'}}>
                        <TouchableWithoutFeedback onPress={() => this.closeUpdateSupportLevel()}>
                            <Icon
                                name='close'
                                color='#fff'
                            />
                        </TouchableWithoutFeedback>
                        
                        <View style={{marginLeft: 10}}>
                            <TouchableWithoutFeedback onPress={() => this.saveUpdateSupportLevel()}>
                                <Icon
                                    name='save'
                                    color='#fff'
                                />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
        }
        else if(this.state.finishDemands == true){
            
            return  <View style={{flexDirection: 'row'}}>
                        <TouchableWithoutFeedback onPress={() => this.closeFinishDemands()}>
                            <Icon
                                name='close'
                                color='#fff'
                            />
                        </TouchableWithoutFeedback>
                        
                        <View style={{marginLeft: 10}}>
                            <TouchableWithoutFeedback onPress={() => this.clickSaveFinishDemands()}>
                                <Icon
                                    name='save'
                                    color='#fff'
                                />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
        }
        else if(this.state.editDemands == true){
            
            return  <View style={{flexDirection: 'row'}}>
                        <TouchableWithoutFeedback onPress={() => this.closeEditDemands()}>
                            <Icon
                                name='close'
                                color='#fff'
                            />
                        </TouchableWithoutFeedback>
                        
                        <View style={{marginLeft: 10}}>
                            <TouchableWithoutFeedback onPress={() => this.clickSaveEditDemands()}>
                                <Icon
                                    name='save'
                                    color='#fff'
                                />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
        }
        else if(this.state.forwardDemandsOperator == true){
            
            return  <View style={{flexDirection: 'row'}}>
                        <TouchableWithoutFeedback onPress={() => this.closeForwardDemandsOperator()}>
                            <Icon
                                name='close'
                                color='#fff'
                            />
                        </TouchableWithoutFeedback>
                        
                        <View style={{marginLeft: 10}}>
                            <TouchableWithoutFeedback onPress={() => this.saveForwardDemandsOperator()}>
                                <Icon
                                    name='save'
                                    color='#fff'
                                />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
        }
        else if(this.state.forwardDemandsArea == true){
            
            return  <View style={{flexDirection: 'row'}}>
                        <TouchableWithoutFeedback onPress={() => this.closeForwardDemandsArea()}>
                            <Icon
                                name='close'
                                color='#fff'
                            />
                        </TouchableWithoutFeedback>
                        
                        <View style={{marginLeft: 10}}>
                            <TouchableWithoutFeedback onPress={() => this.saveForwardDemandsArea()}>
                                <Icon
                                    name='save'
                                    color='#fff'
                                />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
        }
        else if(this.state.data.demandsId == undefined){
            return  <TouchableWithoutFeedback onPress={() => this.saveDemands()}>
                        <Icon
                            name='save'
                            color='#fff'
                        />
                    </TouchableWithoutFeedback>
        }
        else{
            if(this.state.data.userData.userData.userType == 1){
                return  <TouchableWithoutFeedback onPress={() => this.RBSheet2.open()}>
                            <Icons
                                name='plus' 
                                style={{fontSize: 20, color: "white"}}
                            /> 
                        </TouchableWithoutFeedback>
            }
        }
    }

    saveUpdateSupportLevel = async () => {
        
        this.setState({
            isLoading: true
        });

        let data = {
            demandId: this.state.data.demandsId,
            supportLevel: this.state.level.levelId
        }

        let crudService = new CrudService();
        
        let result = await crudService.patch(`demands/changeSupportLevel/${this.state.data.demandsId}`, data, this.state.data.userData.token);
        
        if(result.status == 200){
            
            this.setState({
                savedHere: true,
                updateSupportLevel: false,
            })

            await this.commonDidMount();
            
            Alert.alert(
                "Alterado com Sucesso.",
                `Nível de suporte alterado com sucesso.`,
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
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        this.setState({
            isLoading: false
        });
    }

    saveFinishDemands = () => {

        let label = this.state.data.userData.labels.find((lbl) => {
            return lbl.typeLabel == 1
        });

        this.RBSheet2.close();

        Alert.alert(
            `Finalizar ${label.name}`,
            "Deseja inserir mais alguma interação?",
            [
                {
                    text: "Não Finalizar",
                    style: "nof"
                },
                {
                    text: "Não",
                    onPress: () => this.finishWithoutInteraction(),
                    style: "nok"
                },
                {
                    text: "Sim",
                    onPress: () => this.finishWithInteraction(),
                    style: "ok"
                }
            ],
            { cancelable: false }
        );
    }

    clickSaveEditDemands = async () => {

        this.setState({
            isLoading: true
        });

        let label = this.props.navigation.state.params.userData.labels.find((lbl) => {
            return lbl.typeLabel == 1
        });

        let clientInList = this.state.client.array.find((cli) => {
            return cli.clientId == this.state.client.selected;
        })

        let data = {
            demandId: this.state.data.demandsId,
            priorityId: this.state.priority.selected,
            description: this.state.dataDemands.description,
            forecast: this.state.expectedDateTime == '' ? null : moment(this.state.expectedDateTime, "DD/MM/YYYY HH:mm").format("YYYY/MM/DD HH:mm"),
            noExpectedDate: this.state.switch.isEnabled,
            clientHelpDeskId: clientInList.clientHelpDeskId,
            contactId: this.state.contact.selected,
            sectorHelpDeskId: this.state.area.selected,
            categoryId: this.state.category.selected,
            problemId: this.state.subject.selected
        }
        
        let crudService = new CrudService();
        
        let result = await crudService.patch(`demands/${this.state.data.demandsId}`, data, this.state.data.userData.token);
        
        if(result.status == 200){
            
            this.setState({
                isLoading: true,
                editDemands: false,
                priority: {
                    array: this.state.priority.array,
                    selected: this.state.priority.selected,
                    enabled: false,
                    arrayCombo: this.state.priority.arrayCombo
                },
                descriptionEditable: false,
                canShowPicker: false,
                switch: {
                    isEnabled: this.state.switch.isEnabled,
                    disabled: false
                },
                client: {
                    array: this.state.client.array,
                    selected: this.state.client.selected,
                    enabled: false,
                    arrayCombo: this.state.client.arrayCombo
                },
                contact: {
                    array: this.state.contact.array,
                    selected: this.state.contact.selected,
                    enabled: false,
                    arrayCombo: this.state.contact.arrayCombo
                },
                area: {
                    array: this.state.area.array,
                    selected: this.state.area.selected,
                    enabled: false,
                    arrayCombo: this.state.area.arrayCombo
                },
                category: {
                    array: this.state.category.array,
                    selected: this.state.category.selected,
                    enabled: false,
                    arrayCombo: this.state.category.arrayCombo
                },
                subject: {
                    array: this.state.subject.array,
                    enabled: false,
                    selected: this.state.subject.selected,
                    arrayCombo: this.state.subject.arrayCombo
                }
            });        

            await this.commonDidMount();
            
            Alert.alert(
                `Alterado com Sucesso.`,
                `${label.name} alterado com sucesso.`,
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
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        this.setState({
            isLoading: false
        });
    }

    finishDemandsFunction = async (interaction) => {
        
        this.setState({
            isLoading: true
        });

        let label = this.props.navigation.state.params.userData.labels.find((lbl) => {
            return lbl.typeLabel == 1
        });

        let data = {
            demandsId: this.state.data.demandsId,
            userHelpDeskId: this.state.data.userData.userData.userHelpDeskId,
            userType: this.state.data.userData.userData.userType,
            interaction: interaction,
            term: label.name
        }

        let crudService = new CrudService();
        
        let result = await crudService.patch(`demands/finishDemands/${this.state.data.demandsId}`, data, this.state.data.userData.token);
        
        if(result.status == 200){
            
            this.setState({
                finishDemands: false
            });        
            
            this.props.navigation.state.params.createDemands.finishDemands = false;
            await this.commonDidMount();
            Alert.alert(
                `Finalizado com Sucesso.`,
                `${label.name} finalizado com sucesso.`,
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
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        this.setState({
            isLoading: false
        });
    }

    finishWithoutInteraction = async () => {
        await this.finishDemandsFunction("");
    }

    finishWithInteraction = () => {

        this.setState({
            finishDemands: true
        });
        
        this.props.navigation.state.params.createDemands.finishDemands = true;
        this.props.navigation.navigate('Interaction');
    }

    closeUpdateSupportLevel = async () => {
        
        this.setState({
            updateSupportLevel: false,
            level: {
                levelId: this.state.level.levelId,
                enabled: false,
                arrayCombo: this.state.level.arrayCombo
            },
            isLoading: true
        });
        
        await this.commonDidMount();
        
        this.setState({
            isLoading: false
        });
    }

    closeFinishDemands = () => {

        this.setState({
            finishDemands: false
        });        
        
        this.props.navigation.state.params.createDemands.finishDemands = false;
    }

    closeEditDemands = async () => {

        this.setState({
            isLoading: true,
            editDemands: false,
            priority: {
                array: this.state.priority.array,
                selected: this.state.priority.selected,
                enabled: false,
                arrayCombo: this.state.priority.arrayCombo
            },
            descriptionEditable: false,
            canShowPicker: false,
            switch: {
                isEnabled: this.state.switch.isEnabled,
                disabled: false
            },
            client: {
                array: this.state.client.array,
                selected: this.state.client.selected,
                enabled: false,
                arrayCombo: this.state.client.arrayCombo
            },
            contact: {
                array: this.state.contact.array,
                selected: this.state.contact.selected,
                enabled: false,
                arrayCombo: this.state.contact.arrayCombo
            },
            area: {
                array: this.state.area.array,
                selected: this.state.area.selected,
                enabled: false,
                arrayCombo: this.state.area.arrayCombo
            },
            category: {
                array: this.state.category.array,
                selected: this.state.category.selected,
                enabled: false,
                arrayCombo: this.state.category.arrayCombo
            },
            subject: {
                array: this.state.subject.array,
                enabled: false,
                selected: this.state.subject.selected,
                arrayCombo: this.state.subject.arrayCombo
            }
        });

        await this.commonDidMount();
        
        this.setState({
            isLoading: false
        });
    }

    clickSaveFinishDemands = async () => {

        await this.finishDemandsFunction(this.props.navigation.state.params.createDemands.description);
    }

    forwardDemandsFunction = () => {

        this.RBSheet2.close();
        this.setState({isModalVisible: true});
    }

    editDemandsFunction = () => {

        this.RBSheet2.close();

        if(this.state.subject.selected == null){
            this.state.subject.arrayCombo.shift();
        }

        this.setState({
            editDemands: true,
            priority: {
                array: this.state.priority.array,
                selected: this.state.priority.selected,
                enabled: true,
                arrayCombo: this.state.priority.arrayCombo
            },
            descriptionEditable: true,
            canShowPicker: true,
            switch: {
                isEnabled: this.state.switch.isEnabled,
                disabled: false
            },
            client: {
                array: this.state.client.array,
                selected: this.state.client.selected,
                enabled: true,
                arrayCombo: this.state.client.arrayCombo
            },
            contact: {
                array: this.state.contact.array,
                selected: this.state.contact.selected,
                enabled: true,
                arrayCombo: this.state.contact.arrayCombo
            },
            area: {
                array: this.state.area.array,
                selected: this.state.area.selected,
                enabled: true,
                arrayCombo: this.state.area.arrayCombo
            },
            category: {
                array: this.state.category.array,
                selected: this.state.category.selected,
                enabled: true,
                arrayCombo: this.state.category.arrayCombo
            },
            subject: {
                array: this.state.subject.array,
                enabled: true,
                selected: this.state.subject.selected,
                arrayCombo: this.state.subject.arrayCombo
            }
        })
    }

    showListActions = () => {

        let actions = [];

        let label = this.state.data.userData.labels.find((lbl) => {
            return lbl.typeLabel == 1
        });
        
        this.state.data.userData.permissionAndMenu.forEach((menu, index) => {
            
            if((this.state.data.userData.userData.userType == 1 && menu.menuId == 36) || this.state.data.userData.userData.userType == 2){
                
                if(this.state.status.statusId != 30 && this.state.status.statusId != 40 && this.state.status.statusId != 60 && this.state.status.statusId != 70){
            
                    actions.push(
                        <ListItem
                            button onPress={() => this.saveFinishDemands() }
                            key={1}
                            title={`Finalizar ${label.name}`}
                            leftElement={ 
                                <Icons
                                    name='power-off' 
                                    style={styles.styleIcon}
                                /> 
                            }
                            bottomDivider
                        />
                    );
                }
            }
            else if((this.state.data.userData.userData.userType == 1 && menu.menuId == 37) || this.state.data.userData.userData.userType == 2){
                
                if(this.state.status.statusId == 60 || this.state.status.statusId == 70){
                    actions.push(
                        <ListItem
                            button onPress={() => this.reopenDemands() }
                            key={2}
                            title={`Reabrir ${label.name}`}
                            leftElement={ 
                                <Icons
                                    name='undo' 
                                    style={styles.styleIcon}
                                /> 
                            }
                            bottomDivider
                        />
                    );
                }
            }
            else if(this.state.data.userData.userData.userType == 1 && menu.menuId == 40){

                if(this.state.status.statusId != 30 && this.state.status.statusId != 40 && this.state.status.statusId != 60 && this.state.status.statusId != 70){
            
                    actions.push(
                        <ListItem
                            button onPress={() => this.forwardDemandsFunction() }
                            key={3}
                            title={`Encaminhar ${label.name}`}
                            leftElement={ 
                                <Icons
                                    name='mail-forward' 
                                    style={styles.styleIcon}
                                /> 
                            }
                            bottomDivider
                        />
                    );
                }
            }
            else if(this.state.data.userData.userData.userType == 1 && menu.menuId == 41){

                if(this.state.status.statusId != 30 && this.state.status.statusId != 40 && this.state.status.statusId != 60 && this.state.status.statusId != 70){
            
                    actions.push(
                        <ListItem
                            button onPress={() => this.changeSupportLevel() }
                            key={4}
                            title="Alterar Nível Suporte"
                            leftElement={ 
                                <Icons
                                    name='users' 
                                    style={styles.styleIcon}
                                /> 
                            }
                            bottomDivider
                        />
                    );
                }
            }
            else if(this.state.data.userData.userData.userType == 1 && menu.menuId == 44){

                if(this.state.status.statusId != 30 && this.state.status.statusId != 40 && this.state.status.statusId != 60 && this.state.status.statusId != 70){
            
                    actions.push(
                        <ListItem
                            button onPress={() => this.editDemandsFunction() }
                            key={5}
                            title={`Editar ${label.name}`}
                            leftElement={ 
                                <Icons
                                    name='edit' 
                                    style={styles.styleIcon}
                                /> 
                            }
                            bottomDivider
                        />
                    );
                }
            }
        });

        return actions;
    }

    reopenDemands = async () => {

        this.setState({
            isLoading: true
        });

        let label = this.state.data.userData.labels.find((lbl) => {
            return lbl.typeLabel == 1
        });

        let data = {
            demandsId: this.state.data.demandsId,
            userHelpDeskId: this.state.data.userData.userData.userHelpDeskId,
            status: 10,
            userType: this.state.data.userData.userData.userType,
            term: label.name
        }

        let crudService = new CrudService();

        let result = await crudService.patch(`demands/reopenDemands/${this.state.data.demandsId}`, data, this.state.data.userData.token);
        
        if(result.status == 200){
            
            this.setState({
                savedHere: true
            })

            await this.commonDidMount();
            this.RBSheet2.close();

            Alert.alert(
                "Reaberto com Sucesso.",
                `${label.name} ${result.data.codeId} reaberto com sucesso.`,
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
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        this.setState({
            isLoading: false
        });
    }

    changeSupportLevel = async () => {
        
        if(this.state.dataDemands.supportLevelId == 0){
            while(this.state.level.arrayCombo.length > 3){
                this.state.level.arrayCombo.shift();
            }
        }

        this.setState({
            updateSupportLevel: true,
            level: {
                levelId: this.state.level.levelId,
                enabled: true,
                arrayCombo: this.state.level.arrayCombo
            },
        });
        
        this.RBSheet2.close();

        this.downButtonHandler(150);
    }

    downButtonHandler = (moveHeight) => {

        const windowHeight = Dimensions.get('window').height;

        this.scrollview_ref.scrollTo({
            x: 0,
            y: windowHeight + moveHeight,
            animated: true,
        });
    };

    onChangeFilterText = (text) => {

        this.setState({
            productsFilter: {
                listProductsBackup: this.state.productsFilter.listProductsBackup,
                filterProdut: text
            },
            products: {
                listProducts: this.state.productsFilter.listProductsBackup.filter((product) => {
                    if(product.internalCode.toUpperCase().includes(text.toUpperCase()) || product.productName.toUpperCase().includes(text.toUpperCase()))
                        return product;
                }),
                selectOrChange: this.state.products.selectOrChange,
                selected: this.state.products.selected
            },
        });         
    }

    saveDemands = async () => {
        
        this.setState({
            isLoading: true
        });

        this.props.navigation.state.params.createDemands.signatureId = this.props.navigation.state.params.userData.userData.signatureId;
        this.props.navigation.state.params.createDemands.userHelpDeskId = this.props.navigation.state.params.userData.userData.userHelpDeskId;
        this.props.navigation.state.params.createDemands.userType = this.props.navigation.state.params.userData.userData.userType;
        let label = this.state.data.userData.labels.find((lbl) => {
            return lbl.typeLabel == 1
        });
        
        this.props.navigation.state.params.createDemands.term = label.name;
        
        if(this.props.navigation.state.params.userData.userData.userType == 2){
            
            this.props.navigation.state.params.createDemands.contactId = this.props.navigation.state.params.userData.userData.contactClientHelpDeskId;
        }

        let data = new FormData();
        data.append('Request', JSON.stringify(this.props.navigation.state.params.createDemands));

        this.state.filesSend.forEach((file) => {
            data.append('Files', file);
        });
        
        let crudService = new CrudService();

        let result = await crudService.postWithFile(`demands`, data, this.state.data.userData.token);
        
        if(result.status == 200){
            
            this.setState({
                savedHere: true
            })

            this.state.data.demandsId = result.data.demandsId;
            this.props.navigation.state.params.createDemands.demandsId = result.data.demandsId;
            await this.commonDidMount();

            if(this.props.navigation.state.params.userData.userData.userType == 2){
                Alert.alert(
                    "Cadastrado com Sucesso.",
                    `Você criou um novo ${label.name} de número: ${result.data.codeId}. Recebemos um email e breve o atenderemos.`,
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('DemandsDetail'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else{
                Alert.alert(
                    "Cadastrado com Sucesso.",
                    `${label.name} ${result.data.codeId} criado com sucesso.`,
                    [
                        {
                            text: "Ok",
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
        }
        else if(result.status == 401){
            this.setState({
                isLoading: false
            });

            Alert.alert(
                "Sessão Expirada",
                "Sua sessão expirou. Por favor, realize o login novamente.",
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else if(result.status == 400){
            this.setState({
                isLoading: false
            });

            Alert.alert(
                "Erro",
                result.data[0],
                [
                    {
                        text: "Ok",
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else{
            this.setState({
                isLoading: false
            });

            Alert.alert(
                "Erro",
                "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
    }

    commonDidMount = async () => {

        let crudService = new CrudService();
        
        if(this.state.data.userData.userData.userType == 1){
            let resultClients = await crudService.get(`comboDemands/getComboClients/${this.state.data.userData.userData.personId}`, this.state.data.userData.token);
        
            if(resultClients.status == 200){
                this.setState({
                    client: {
                        array: [...resultClients.data],
                        selected: this.state.client.selected,
                        enabled: true,
                        arrayCombo: this.state.client.arrayCombo
                    }
                }, this.populateClient);
            }
            else if(resultClients.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
        }
        else{
            if(this.state.data.demandsId == undefined && this.props.navigation.state.params.createDemands.clientHelpDeskId == undefined){
                this.props.navigation.state.params.createDemands.clientHelpDeskId = this.state.data.userData.userData.clientHelpDeskId;
                this.changeClient(this.state.data.userData.userData.clientHelpDeskId);
            }
        }

        let resultPriority = await crudService.get(`comboDemands/getComboPriority/${this.state.data.userData.userData.signatureId}`, this.state.data.userData.token);
        
        if(resultPriority.status == 200){
            this.setState({
                priority: {
                    array: [...resultPriority.data],
                    selected: this.state.priority.selected,
                    enabled: true,
                    arrayCombo: this.state.priority.arrayCombo
                }
            }, this.populatePriority);
        }
        else if(resultPriority.status == 401){
            Alert.alert(
                "Sessão Expirada",
                "Sua sessão expirou. Por favor, realize o login novamente.",
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        this.props.navigation.state.params.createDemands.supportLevel = 1;
        
        if(this.state.data.demandsId != undefined){
            
            let getDemands = await crudService.get(`demands/${this.state.data.demandsId}`, this.state.data.userData.token);

            if(getDemands.status == 200){
                
                this.props.navigation.state.params.createDemands.getDemands = getDemands.data;

                this.changeClient(getDemands.data.clientId);
                this.changeArea(getDemands.data.areaId);
    
                let labelEquipment = "Nenhum Equipamento!";
                if(getDemands.data.internalCodeEquipment != null && getDemands.data.internalCodeEquipment != "" && getDemands.data.equipment != null && getDemands.data.equipment != ""){
                    labelEquipment = `${getDemands.data.internalCodeEquipment} - ${getDemands.data.equipment}`;
                }
                else if((getDemands.data.internalCodeEquipment == null || getDemands.data.internalCodeEquipment == "") && (getDemands.data.equipment != null && getDemands.data.equipment != "")){
                    labelEquipment = `${getDemands.data.equipment}`;
                }
                else if((getDemands.data.internalCodeEquipment != null && getDemands.data.internalCodeEquipment != "") && (getDemands.data.equipment == null || getDemands.data.equipment == "")){
                    labelEquipment = `${getDemands.data.internalCodeEquipment}`;
                }
                
                this.setState({
                    dataDemands: getDemands.data,
                    client: {
                        array: [...this.state.client.array],
                        selected: getDemands.data.clientId,
                        enabled: this.state.client.enabled,
                        arrayCombo: [...this.state.client.arrayCombo]
                    },
                    priority: {
                        array: [...this.state.priority.array],
                        selected: getDemands.data.priorityId,
                        enabled: this.state.priority.enabled,
                        arrayCombo: [...this.state.priority.arrayCombo]
                    },
                    contact: {
                        array: [...this.state.contact.array],
                        selected: getDemands.data.contactId,
                        enabled: this.state.contact.enabled,
                        arrayCombo: [...this.state.contact.arrayCombo]
                    },
                    area: {
                        array: [...this.state.area.array],
                        selected: getDemands.data.areaId,
                        enabled: this.state.area.enabled,
                        arrayCombo: [...this.state.area.arrayCombo]
                    },
                    status: {
                        arrayCombo: [...this.state.status.arrayCombo, 
                            <Picker.Item key={60} value={60} label="FINALIZADO PELO CLIENTE" />,
                            <Picker.Item key={70} value={70} label="FINALIZADO PELO OPERADOR" />
                        ],
                        statusId: getDemands.data.statusId,
                        enabled: false
                    },
                    level: {
                        levelId: getDemands.data.supportLevelId,
                        enabled: false,
                        arrayCombo: this.state.level.arrayCombo
                    },
                    products: {
                        listProducts: this.state.products.listProducts,
                        selectOrChange: "Trocar",
                        selected: <Text style={{marginBottom:10, fontSize: 15}}>{labelEquipment}</Text>
                    },
                    productsFilter: {
                        listProductsBackup: this.state.products.listProducts,
                        filterProdut: ""
                    }
                }, this.afterDidMount);

                let result = await crudService.get(`comboDemands/getComboOperators/${getDemands.data.areaId}`, this.state.data.userData.token);
                
                let arrCombo = [];
                let arr = [];
                
                if(result.status == 200){
                    
                    result.data.forEach(operator => {
                        arrCombo.push(<Picker.Item key={operator.operatorId} value={operator.operatorId} label={operator.operatorName} />);
                        arr.push(operator);
                    });

                    this.setState({
                        operator: {
                            array: arr,
                            enabled: false,
                            selected: getDemands.data.responsibleOperatorId,
                            arrayCombo: [<Picker.Item key={0} value={0} label={`NENHUM OPERADOR RESPONSÁVEL`} />, 
                                         ...arrCombo
                            ],
                        }
                    });
                }
                else if(result.status == 401){
                    
                    Alert.alert(
                        "Sessão Expirada",
                        "Sua sessão expirou. Por favor, realize o login novamente.",
                        [
                            {
                                text: "Ok",
                                onPress: () => this.props.navigation.navigate('LoginEmail'),
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
                                onPress: () => this.props.navigation.navigate('DemandsList'),
                                style: "ok"
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
            else if(getDemands.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmail'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if(getDemands.status == 400){
                Alert.alert(
                    "Erro",
                    getDemands.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('DemandsList'),
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
                            onPress: () => this.props.navigation.navigate('DemandsList'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
        }
        else{
            this.setState({
                isLoading: false
            })
        }
    }

    afterDidMount = () => {
        
        if(this.state.dataDemands.listAttachments.length > 0){
            
            let listAttachments = this.state.dataDemands.listAttachments.map((attachment, index) => {
                
                let number = 20;
                if(index == 0){
                    number = 0
                }

                let arrayName = attachment.fileName.split('.');
                let iconName = arrayName[arrayName.length-1];
                iconName = iconName.toLowerCase();
                let path = '';

                if(iconName == "csv"){
                    path = require("../../assets/img/icons/csv.png");
                }
                else if(iconName == "doc" || iconName == "docx"){
                    path = require("../../assets/img/icons/doc.png");
                }
                else if(iconName == "exe"){
                    path = require("../../assets/img/icons/exe.png");
                }
                else if(iconName == "jpg" || iconName == "jpeg"){
                    path = require("../../assets/img/icons/jpg.png");
                }
                else if(iconName == "mp3"){
                    path = require("../../assets/img/icons/mp3.png");
                }
                else if(iconName == "iso" ){
                    path = require("../../assets/img/icons/iso.png");
                }
                else if(iconName == "mp4"){
                    path = require("../../assets/img/icons/mp4.png");
                }
                else if(iconName == "pdf"){
                    path = require("../../assets/img/icons/pdf.png");
                }
                else if(iconName == "png"){
                    path = require("../../assets/img/icons/png.png");
                }
                else if(iconName == "ppt" || iconName == "pptx"){
                    path = require("../../assets/img/icons/ppt.png");
                }
                else if(iconName == "txt"){
                    path = require("../../assets/img/icons/txt.png");
                }
                else if(iconName == "xls" || iconName == "xlsx"){
                    path = require("../../assets/img/icons/xls.png");
                }
                else if(iconName == "xml"){
                    path = require("../../assets/img/icons/xml.png");
                }
                else if(iconName == "zip" || iconName == "7z"){
                    path = require("../../assets/img/icons/zip.png");
                }
                else{
                    path = require("../../assets/img/icons/documento.png");
                }

                return <CardFiles 
                            imageUri={path}
                            attachment={attachment}
                            left={number}
                            userData={this.state.data.userData}
                            navigation={this.props.navigation}
                        />
            });

            let component = <View style={{ height: 130, marginTop: 10 }}>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {listAttachments}
                                </ScrollView>
                            </View>

            this.setState({
                attachmentsList: component
            });
        }
        
        this.setState({
            client: {
                array: [...this.state.client.array],
                selected: this.state.client.selected,
                enabled: false,
                arrayCombo: [...this.state.client.arrayCombo]
            },
            priority: {
                array: [...this.state.priority.array],
                selected: this.state.priority.selected,
                enabled: false,
                arrayCombo: [...this.state.priority.arrayCombo]
            },
            contact: {
                array: [...this.state.contact.array],
                selected: this.state.contact.selected,
                enabled: false,
                arrayCombo: [...this.state.contact.arrayCombo]
            },
            area: {
                array: [...this.state.area.array],
                selected: this.state.area.selected,
                enabled: false,
                arrayCombo: [...this.state.area.arrayCombo]
            },
            status: {
                arrayCombo: [...this.state.status.arrayCombo],
                statusId: this.state.status.statusId,
                enabled: false
            },
            level: {
                levelId: this.state.level.levelId,
                enabled: false,
                arrayCombo: this.state.level.arrayCombo
            },
            switch: {
                isEnabled: this.state.switch.isEnabled,
                disabled: true
            },
            isLoading: false
        }, () => {
            
            if(this.state.dataDemands.supportLevelId == 0){
                this.setState({
                    level: {
                        levelId: this.state.level.levelId,
                        enabled: this.state.level.enabled,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label="NENHUM" />,
                            ...this.state.level.arrayCombo
                        ]
                    },
                })
            }
        });
    }

	render(){
        
        return(
            <View style={{flex:1}}>
                {
                    this.state.isLoading && (
                        <View style={styles.containerLoader}>
                            <ActivityIndicator size="large" color={COLORS.default} />
                        </View>
                    )
                }
                {
                    !this.state.isLoading && (
                        <React.Fragment>
                            <View>
                                <Header
                                    leftComponent={<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('DemandsList')}>
                                                        <Icon
                                                            name='keyboard-backspace'
                                                            color='#fff'
                                                        />
                                                    </TouchableWithoutFeedback>
                                    }
                                    rightComponent={this.showSaveButton()}
                                    centerComponent={<Text h4 style={{textAlign: 'center', color: '#fff'}}>Detalhes</Text>}
                                    containerStyle={{
                                        backgroundColor: COLORS.default,
                                        paddingTop: 0
                                    }}
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <ScrollView
                                    ref={ref => {
                                        this.scrollview_ref = ref;
                                    }}>
                                    <View style={{flex: 5,alignItems: 'center'}}>
                                        <View style={{lex: 1, width: width * 0.8, marginTop: 15}}>
                                            
                                            <Text h4 style={{marginBottom:10}}>Informações:</Text>
                                            {this.showDemandsId()}
                                            {this.showCreationDate()}
                                            {this.showCreatedBy()}
                                            {this.showResponsibleOperator()}
                                            
                                            {this.state.data.userData.userData.userType == 1 && (
                                                <>
                                                    <Text style={{marginBottom:5}}>Cliente:</Text>
                                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>
                                                        <Picker
                                                            enabled={this.state.client.enabled}
                                                            style={pickerStyle}
                                                            selectedValue={this.state.client.selected}
                                                            onValueChange={(itemValue, itemIndex) =>
                                                                this.changeClient(itemValue)
                                                            }>
                                                            {this.state.client.arrayCombo}
                                                        </Picker>
                                                    </View>
                        
                                                    <Text style={{marginBottom:5}}>Contato Cliente:</Text>
                                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>
                                                        <Picker
                                                            enabled={this.state.contact.enabled}
                                                            style={pickerStyle}
                                                            selectedValue={this.state.contact.selected}
                                                            onValueChange={(itemValue, itemIndex) =>
                                                                this.changeContact(itemValue)
                                                            }>
                                                            {this.state.contact.arrayCombo}
                                                        </Picker>
                                                    </View>
                                                </>
                                            )}
                
                                            <Text style={{marginBottom:5}}>Prioridade:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                <Picker
                                                    enabled={this.state.priority.enabled}
                                                    style={pickerStyle}
                                                    selectedValue={this.state.priority.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.changePriority(itemValue)
                                                    }>
                                                    {this.state.priority.arrayCombo}
                                                </Picker>
                                            </View>
                
                                            <Text style={{marginBottom:5}}>Área:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                <Picker
                                                    enabled={this.state.area.enabled}
                                                    style={pickerStyle}
                                                    selectedValue={this.state.area.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.changeArea(itemValue)
                                                    }>
                                                    {this.state.area.arrayCombo}
                                                </Picker>
                                            </View>
                
                                            <Text style={{marginBottom:5}}>Categoria:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                <Picker
                                                    enabled={this.state.category.enabled}
                                                    style={pickerStyle}
                                                    selectedValue={this.state.category.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.changeCategory(itemValue)
                                                    }>
                                                    {this.state.category.arrayCombo}
                                                </Picker>
                                            </View>
                                            
                                            <Text style={{marginBottom:5}}>Assunto:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                <Picker
                                                    enabled={this.state.subject.enabled}
                                                    style={pickerStyle}
                                                    selectedValue={this.state.subject.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.changeSubject(itemValue)
                                                    }>
                                                    {this.state.subject.arrayCombo}
                                                </Picker>
                                            </View>
                                            
                                            {(this.state.data.userData.userData.userType == 2 && this.state.data.demandsId == undefined) && (
                                                <CheckBox
                                                    title='Não encontrei o assunto nessa lista!'
                                                    checked={this.state.subjectNotFound}
                                                    onPress={() => this.pressSubjectNotFound()}
                                                />
                                            )}
                                            
                                            {((this.state.data.userData.userData.userType == 1) || (this.state.data.userData.userData.userType == 2 && this.state.data.demandsId != undefined)) && (
                                                <>
                                                    <Text style={{marginBottom:5}}>Status:</Text>
                                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                        <Picker
                                                            enabled={this.state.status.enabled}
                                                            style={pickerStyle}
                                                            selectedValue={this.state.status.statusId}
                                                            onValueChange={(itemValue, itemIndex) =>
                                                                this.changeStatus(itemValue)
                                                            }>
                                                            {this.state.status.arrayCombo}
                                                        </Picker>
                                                    </View>
                                                </>
                                            )}
                                            
                                            {this.state.data.userData.userData.userType == 1 && (
                                                <>
                                                    <Text style={{marginBottom:5}}>Nível Suporte:</Text>
                                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                        <Picker
                                                            enabled={this.state.level.enabled}
                                                            style={pickerStyle}
                                                            selectedValue={this.state.level.levelId}
                                                            onValueChange={(itemValue, itemIndex) =>
                                                                this.changeLevel(itemValue)
                                                            }>
                                                            {this.state.level.arrayCombo}
                                                        </Picker>
                                                    </View>
                                                </>
                                            )}

                                            <Text style={{marginBottom:10, fontSize: 20, fontWeight: "bold"}}>SLA: {this.state.sla}</Text>
                                            
                                            {this.state.data.userData.userData.userType == 1 && (
                                                <>
                                                    <DateTimePickerModal
                                                        isVisible={this.state.isDatePickerVisible}
                                                        onConfirm={this.handleConfirm}
                                                        onCancel={this.hideDatePicker}
                                                        mode={'datetime'}
                                                        is24Hour={true}
                                                    />

                                                    <Text style={{marginBottom:5}}>Data Prevista:</Text>
                                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                        <TouchableOpacity onPress={() => this.showPicker()}>
                                                            <TextInput style={styles.input} 
                                                                editable={false}
                                                                value={this.state.expectedDateTime}/>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                                        <Text>Sem Data Prevista:</Text>
                                                        <Switch
                                                            disabled={this.state.switch.disabled}
                                                            trackColor={{ false: "#767577", true: COLORS.default }}
                                                            thumbColor={this.state.switch.isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                                            ios_backgroundColor="#3e3e3e"
                                                            onValueChange={this.toggleSwitch}
                                                            value={this.state.switch.isEnabled}
                                                        />
                                                    </View>
                                                </>
                                            )}

                                            {this.showTotalService()}
                                            {this.showEndDate()}
                                            {this.showFinishingUser()}
                                                
                                            <Text h4 style={{marginBottom:10, marginTop: 20}}>Equipamento:</Text>
                                            {this.state.products.selected}
                                            
                                            {
                                                (this.state.data.userData.userData.userType == 1 ||
                                                (this.state.data.demandsId == undefined && 
                                                 this.state.dataDemands == undefined)) && 
                                                (
                                                    <View style={{marginTop:10, marginBottom:10}}>
                                                        <TouchableOpacity onPress={() => this.RBSheet.open()}>
                                                            <Text>{this.state.products.selectOrChange} o equipamento</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                                
                                            <Text h4 style={{marginTop: 10}}>Anexos:</Text>
                                            {this.state.attachmentsList}
                                            {this.state.attachmentsList.length == 0 && 
                                            (
                                                <Text style={{marginTop:10}}>Nenhum anexo.</Text>
                                            )}
                                            
                                            {
                                                this.state.data.demandsId == undefined && 
                                                this.state.dataDemands == undefined &&
                                                (
                                                    <View style={{marginTop:10, marginBottom:10}}>
                                                        <TouchableOpacity onPress={this.openPicker}>
                                                            <Text>Selecione os arquivos</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                            
                                            {this.showDescription()}
                
                                            <RBSheet
                                                ref={ref => {
                                                    this.RBSheet = ref;
                                                }}
                                                closeOnDragDown={true}
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
                                                        paddingLeft: 25,
                                                        paddingRight: 25
                                                    },
                                                    draggableIcon: {
                                                        backgroundColor: "#000"
                                                    }
                                                }}
                                            >
                                                <Text h4 style={{marginBottom:10, textAlign: 'center'}}>Selecione o Equipamento</Text>
                                                
                                                <Text style={{marginBottom:5}}>Filtro equipamento:</Text>
                                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                    <TextInput style={styles.input} 
                                                        value={this.state.productsFilter.filterProdut}
                                                        onChangeText={text => this.onChangeFilterText(text)}/>
                                                </View>
                                                
                                                <FlatList
                                                    style={{ flex: 1.8, marginBottom: 20 }}
                                                    contentContainerStyle={ styles.list }
                                                    data={ this.state.products.listProducts }
                                                    renderItem={ this.renderItem }
                                                    keyExtractor={(item, index) => item.productId.toString()}
                                                />
                                            </RBSheet>
                                            
                                            <RBSheet
                                                ref={ref => {
                                                    this.RBSheet2 = ref;
                                                }}
                                                closeOnDragDown={false}
                                                closeOnPressMask={true}
                                                animationType={"slide"}
                                                closeDuration={0}
                                                customStyles={{
                                                    wrapper: {
                                                        backgroundColor: "rgba(0,0,0,0.5)"
                                                    },
                                                    container: {
                                                        height: "30%",
                                                    },
                                                    draggableIcon: {
                                                        backgroundColor: "#000"
                                                    }
                                                }}
                                            >
                                                <ScrollView>
                                                    {this.showListActions()}
                                                </ScrollView>
                                            </RBSheet>

                                            <Modal 
                                                isVisible={this.state.isModalVisible}
                                                onBackdropPress={() => this.setState({isModalVisible: false})}    
                                            >
                                                <View style={{backgroundColor: "white"}}>
                                                    <Text style={{textAlign: "center", marginBottom:20, marginTop: 20, fontSize: 20}}>Encaminhar para:</Text>
                                                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                                        <TouchableOpacity onPress={() => this.clickForwardArea()}>
                                                            <MaterialIcons
                                                                name='business' 
                                                                style={{fontSize: 50, color: "black"}}
                                                            />
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => {
                                                            this.setState({
                                                                isModalVisible: false,
                                                                forwardDemandsOperator: true,
                                                                operator: {
                                                                    array: this.state.operator.array,
                                                                    selected: this.state.operator.selected,
                                                                    enabled: true,
                                                                    arrayCombo: this.state.operator.arrayCombo
                                                                },
                                                            });
                                                        }}>
                                                            <MaterialIcons
                                                                name='person' 
                                                                style={{fontSize: 50, color: "black", marginLeft: 5}}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                                        <Text style={{marginBottom:30, marginLeft: 15}}>Área</Text>
                                                        <Text style={{marginBottom:30, marginLeft: 30}}>Operador</Text>
                                                    </View>
                                                </View>
                                            </Modal>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </React.Fragment>
                    )
                }                 
            </View>
        );  
    }
    
    async componentDidMount(){
        
        this.props.navigation.addListener('willFocus', async (route) => { 
            
            this.setState({
                isLoading: true
            });
            
            if(this.props.navigation.state.params.demandsId != undefined)
            {
                this.state.data.demandsId = this.props.navigation.state.params.demandsId;
            }
            if(this.props.navigation.state.params.createDemands.finishDemands == false)
            {
                this.setState({
                    finishDemands: false
                });
            }
            await this.commonDidMount();
            this.showDemandsId();
            this.showCreationDate();
            this.showCreatedBy();
            this.showResponsibleOperator();
            this.showTotalService();
            this.showEndDate();
            this.showFinishingUser();
            this.showDescription();
            
            this.setState({
                isLoading: false
            });
        });

        await this.commonDidMount();
    }
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
    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },
    textBold: { 
		fontWeight: "bold" 
	},
    list: {
		paddingHorizontal: 20,
    },	
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    styleIcon: {
        fontSize: 25,
        color: "black"
    },
})

export default createMaterialTopTabNavigator({
    DemandsDetail:{ 
        screen: DemandsDetailScreen,
        navigationOptions:{
          tabBarLabel:'Detalhes'
        }   
    },
    Interaction: { 
        screen: ListInteractionsScreen,
        navigationOptions:{
          tabBarLabel:'Interações'
        }
    },
},
{
    initialRouteName: 'DemandsDetail',
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeTintColor: 'orange',
        style: { backgroundColor: COLORS.default },
        indicatorStyle: {
            height: 0
        }
    }
});