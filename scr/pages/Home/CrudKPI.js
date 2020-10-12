import React, { Component } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Switch, 
    TouchableOpacity, 
    TouchableWithoutFeedback,
    StyleSheet,  
    View,
    ScrollView, 
    TextInput, 
    Dimensions,
    Picker,
    Alert } from "react-native";
import { Text, Header, Icon } from "react-native-elements";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import RadioForm from 'react-native-simple-radio-button';

import COLORS from '../../styles/Colors.js';
import CrudService from '../../services/Crud/CrudService.js';
const width = Dimensions.get('screen').width;

var radio_props = [ 
    {label: 'Cliente', value: 1 },
    {label: 'Contato', value: 2 }, 
    {label: 'Prioridade', value: 3 },
    {label: 'Área', value: 4 }, 
    {label: 'Categoria', value: 5 },
    {label: 'Assunto', value: 6 }, 
    {label: 'Status', value: 7 },
    {label: 'Nível de Suporte', value: 8 }, 
    {label: 'Produto', value: 9 },
    {label: 'Operador', value: 10 }
];

var radio_props2 = [ 
    {label: 'Linha', value: 1 }, 
    {label: 'Barra', value: 2 }
];

export default class CrudKPI extends Component {
    constructor(props) {
        super(props);

        this.myRef = React.createRef();

        this.state = {
            client: {
                array: [],
                selected: 0,
                arrayCombo: []
            },
            area: {
                array: [],
                selected: 0,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE A ÁREA`} />
                ]
            },
            category: {
                array: [],
                selected: 0,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE A ÁREA`} />
                ]
            },
            multiClients: {
                items: [],
                selectedItems: []
            },
            multiAreas: {
                items: [],
                selectedItems: []
            },
            operators: {
                items: [],
                selectedItems: []
            },
            priority: {
                items: [],
                selectedItems: []
            },
            level: {
                items: [{
                    name: 'Nível Suporte',
                    id: 0,
                    children: [
                        {
                            name: 'Todos',
                            id: 0,
                        },
                        {
                            name: 'Nível 1',
                            id: 1,
                        },
                        {
                            name: 'Nível 2',
                            id: 2,
                        },
                        {
                            name: 'Nível 3',
                            id: 3,
                        }
                    ]
                }],
                selectedItems: []
            },
            status: {
                items: [{
                    name: 'Status',
                    id: 0,
                    children: [
                        {
                            name: 'Todos',
                            id: 0,
                        },
                        {
                            name: 'Aguardando Atendimento',
                            id: 10,
                        },
                        {
                            name: 'Aguardando Retorno Cliente',
                            id: 20,
                        },
                        {
                            name: 'Aviso',
                            id: 30,
                        },
                        {
                            name: 'Cancelado',
                            id: 40,
                        },
                        {
                            name: 'Em Atendimento',
                            id: 50,
                        },
                        {
                            name: 'Finalizado Pelo Cliente',
                            id: 60,
                        },
                        {
                            name: 'Finalizado Pelo Operador',
                            id: 70,
                        },
                        {
                            name: 'Reaberto Pelo Cliente',
                            id: 80,
                        },
                        {
                            name: 'Reaberto Pelo Operador',
                            id: 90,
                        }
                    ]
                }],
                selectedItems: []
            },
            contacts: {
                items: [],
                selectedItems: []
            },
            multiCategory: {
                items: [],
                selectedItems: []
            },
            multiSubject: {
                items: [],
                selectedItems: []
            },
            products: {
                items: [],
                selectedItems: []
            },
            isDatePickerVisible: false,
            endDate: {
                show: "",
                send: ""
            },
            today: {
                isEnabled: false,
                disabled: false
            },
            typePeriod: 0,
            title: "",
            height: "150",
            radio: 0,
            radio2: 0,
            data: this.props.navigation.state.params,
            initial: -1,
            initial2: 0,
        };
    };

    handleConfirm = (datetime) => {
        this.setState({
            isDatePickerVisible: false,
            endDate: {
                show: moment(datetime).format("DD/MM/YYYY HH:mm"),
                send: moment(datetime).format("YYYY/MM/DD HH:mm")
            },
            today: {
                isEnabled: false,
                disabled: this.state.today.disabled
            },
        });
    }
    
    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    };

    onSelectedItemsChangeClients = (selectedItems) => {
        this.setState({ 
            multiClients: {
                items: this.state.multiClients.items,
                selectedItems: selectedItems
            } 
        });
    };

    onSelectedItemsChangeArea = (selectedItems) => {
        this.setState({ 
            multiAreas: {
                items: this.state.multiAreas.items,
                selectedItems: selectedItems
            } 
        });
    };

    onSelectedItemsChangePriority = (selectedItems) => {
        this.setState({ 
            priority: {
                items: this.state.priority.items,
                selectedItems: selectedItems
            } 
        });
    };

    onSelectedItemsChangeOperator = (selectedItems) => {
        this.setState({ 
            operators: {
                items: this.state.operators.items,
                selectedItems: selectedItems
            } 
        });
    };

    onSelectedItemsChangeLevel = (selectedItems) => {
        this.setState({ 
            level: {
                items: this.state.level.items,
                selectedItems: selectedItems
            } 
        });
    };

    onSelectedItemsChangeStatus = (selectedItems) => {
        this.setState({ 
            status: {
                items: this.state.status.items,
                selectedItems: selectedItems
            } 
        });
    };

    onSelectedItemsChangeContact = (selectedItems) => {
        this.setState({ 
            contacts: {
                items: this.state.contacts.items,
                selectedItems: selectedItems
            } 
        });
    };

    onSelectedItemsChangeCategory = (selectedItems) => {
        this.setState({ 
            multiCategory: {
                items: this.state.multiCategory.items,
                selectedItems: selectedItems
            } 
        });
    };

    onSelectedItemsChangeSubject = (selectedItems) => {
        this.setState({ 
            multiSubject: {
                items: this.state.multiSubject.items,
                selectedItems: selectedItems
            } 
        });
    };

    onSelectedItemsChangeProduct = (selectedItems) => {
        this.setState({ 
            products: {
                items: this.state.products.items,
                selectedItems: selectedItems
            } 
        });
    };

    hideDatePicker = () => {
        this.setState({ 
            isDatePickerVisible: false
        });
    };

    showPicker = () => {
        this.setState({ 
            isDatePickerVisible: true
        });
    };

    toggleSwitch = () => {
        this.setState({
            endDate: {
                show: '',
                send: ''
            },
            today: {
                isEnabled: !this.state.today.isEnabled,
                disabled: this.state.today.disabled
            },
        });
    };

    changeClient = async (itemValue, arr = [], searchInList = true) => {
        this.setState({
            client: {
                array: this.state.client.array,
                selected: itemValue,
                arrayCombo: this.state.client.arrayCombo
            }
        });

        let clientInList = {};

        if(searchInList)
        {
            clientInList = this.state.client.array.find((cli) => {
                return cli.clientId == itemValue;
            });
        }
        else
        {
            clientInList.clientHelpDeskId = itemValue;
        }

        if(itemValue != 0){
            let crudService = new CrudService();

            let resultContacts = await crudService.get(`comboDemands/getComboContact/${clientInList.clientHelpDeskId}`, this.state.data.userData.token);
            
            if(resultContacts.status == 200){
                this.setState({
                    contacts: {
                        items: [
                            {
                                name: 'Contatos',
                                id: 0,
                                children: [
                                    {
                                        name: 'Todos',
                                        id: 0,
                                    },
                                    ...resultContacts.data.map((c, i) => {
                                        return {
                                            name: c.contactName,
                                            id: c.contactId
                                        }
                                    })
                                ]
                            }
                        ],
                        selectedItems: arr
                    }
                });
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
                            onPress: () => this.props.navigation.navigate('Home'),
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
                        items: [
                            {
                                name: 'Equipamentos',
                                id: 0,
                                children: [
                                    {
                                        name: 'Todos',
                                        id: 0,
                                    },
                                    ...resultProducts.data.map((p, i) => {
    
                                        let labelEquipment = "";
                                        if(p.internalCode != null && p.internalCode != "" && p.productName != null && p.productName != ""){
                                            labelEquipment = `${p.internalCode} - ${p.productName}`;
                                        }
                                        else if((p.internalCode == null || p.internalCode == "") && (p.productName != null && p.productName != "")){
                                            labelEquipment = `${p.productName}`;
                                        }
                                        else if((p.internalCode != null && p.internalCode != "") && (p.productName == null || p.productName == "")){
                                            labelEquipment = `${p.internalCode}`;
                                        }
    
                                        return {
                                            name: labelEquipment,
                                            id: p.productId
                                        }
                                    })
                                ]
                            }
                        ],
                        selectedItems: []
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
                            onPress: () => this.props.navigation.navigate('Home'),
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
        }
        else{
            this.setState({
                contacts: {
                    items: [],
                    selectedItems: []
                },
                products: {
                    items: [],
                    selectedItems: []
                },
            });
        }
    }

    changeArea = async (itemValue, arr = [], selected = 0) => {  
        this.setState({
            area: {
                array: [...this.state.area.array],
                selected: itemValue,
                arrayCombo: [...this.state.area.arrayCombo]
            }
        });

        if(itemValue != 0){
            this.setState({
                multiSubject: {
                    items: [],
                    selectedItems: []
                }
            });

            let crudService = new CrudService();

            let resultCategory = await crudService.get(`comboDemands/getComboCategory/${itemValue}`, this.state.data.userData.token);
            
            if(resultCategory.status == 200){
                this.setState({
                    category: {
                        array: [...resultCategory.data],
                        selected: 0
                    }
                }, () => {
                    this.setState({
                        category: {
                            array: [...resultCategory.data],
                            selected: selected,
                            arrayCombo: [
                                <Picker.Item key={0} value={0} label={`SELECIONE A CATEGORIA`} />,
                                resultCategory.data.map((c, i) => {
                                    return <Picker.Item key={i} value={c.categoryId} label={c.categoryName} />
                                })
                            ]
                        },
                        multiCategory: {
                            items: [
                                {
                                    name: 'Categorias',
                                    id: 0,
                                    children: [
                                        {
                                            name: 'Todas',
                                            id: 0,
                                        },
                                        ...resultCategory.data.map((c, i) => {
                                            return {
                                                name: c.categoryName,
                                                id: c.categoryId
                                            }
                                        })
                                    ]
                                }
                            ],
                            selectedItems: arr
                        },
                    })
                });
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
                            onPress: () => this.props.navigation.navigate('Home'),
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
        }
        else{
            this.setState({
                multiSubject: {
                    items: [],
                    selectedItems: []
                }
            })
            this.setState({
                category: {
                    array: [],
                    selected: 0
                }
            }, () => {
                this.setState({
                    category: {
                        array: [...this.state.category.array],
                        selected: this.state.category.selected,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE A ÁREA`} />
                        ],
                    },
                    multiCategory: {
                        items: [],
                        selectedItems: []
                    }
                });
            });
        }
    }

    changeCategory = async (itemValue, arr = []) => {
        
        this.setState({
            category: {
                array: [...this.state.category.array],
                selected: itemValue,
                arrayCombo: [...this.state.category.arrayCombo]
            }
        });

        if(itemValue != 0){
            let crudService = new CrudService();

            let resultSubject = await crudService.get(`comboDemands/getComboSubject/${itemValue}`, this.state.data.userData.token);
            
            if(resultSubject.status == 200){
                this.setState({
                    multiSubject: {
                        items: [
                            {
                                name: 'Assuntos',
                                id: 0,
                                children: [
                                    {
                                        name: 'Todos',
                                        id: 0,
                                    },
                                    ...resultSubject.data.map((s, i) => {
                                        return {
                                            name: s.title,
                                            id: s.subjectId
                                        }
                                    })
                                ]
                            }
                        ],
                        selectedItems: arr
                    }
                });
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
                            onPress: () => this.props.navigation.navigate('Home'),
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
        }
        else{
            this.setState({
                multiSubject: {
                    items: [],
                    selectedItems: []
                }
            })
        }
    }

    removeKPI = async () => {

        let crudService = new CrudService();

        let result = await crudService.delete(`kpi/${this.state.data.id}`, this.state.data.userData.token);
            
        if(result.status == 200){
            Alert.alert(
                `Excluído com Sucesso`,
                `KPI Excluído com Sucesso.`,
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
                        onPress: () => this.props.navigation.navigate('Home'),
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
    }

    saveKPI = async () => {

        let idsCombo = "";
        let graphicType = 0;
        
        if(this.state.radio == 1){
            idsCombo = this.state.multiClients.selectedItems.join();

            if(this.state.multiClients.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }
        else if(this.state.radio == 2){
            idsCombo = `${this.state.client.selected};${this.state.contacts.selectedItems.join()}`;

            if(this.state.contacts.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }
        else if(this.state.radio == 3){
            idsCombo = this.state.priority.selectedItems.join();

            if(this.state.priority.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }
        else if(this.state.radio == 4){
            idsCombo = this.state.multiAreas.selectedItems.join();

            if(this.state.multiAreas.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }
        else if(this.state.radio == 5){
            idsCombo = `${this.state.area.selected};${this.state.multiCategory.selectedItems.join()}`;

            if(this.state.multiCategory.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }
        else if(this.state.radio == 6){
            idsCombo = `${this.state.area.selected};${this.state.category.selected};${this.state.multiSubject.selectedItems.join()}`;

            if(this.state.multiSubject.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }
        else if(this.state.radio == 7){
            idsCombo = this.state.status.selectedItems.join();

            if(this.state.status.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }
        else if(this.state.radio == 8){
            idsCombo = this.state.level.selectedItems.join();

            if(this.state.level.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }
        else if(this.state.radio == 9){
            idsCombo = `${this.state.client.selected};${this.state.products.selectedItems.join()}`;

            if(this.state.products.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }
        else if(this.state.radio == 10){
            idsCombo = this.state.operators.selectedItems.join();

            if(this.state.operators.selectedItems.length == 1){
                if(this.state.radio2 == 0){
                    graphicType = 1;
                }
                else{
                    graphicType = this.state.radio2;
                }
            }
        }

        let createKpi = {
            kpiId: this.state.data.id,
            personId: this.state.data.userData.userData.personId,
            signatureId: this.state.data.userData.userData.signatureId,
            idsCombo,
            clients: this.state.radio == 1 ? true : false,
            contact: this.state.radio == 2 ? true : false,
            priority: this.state.radio == 3 ? true : false,
            sector: this.state.radio == 4 ? true : false,
            category: this.state.radio == 5 ? true : false,
            subject: this.state.radio == 6 ? true : false,
            status: this.state.radio == 7 ? true : false,
            supportLevel: this.state.radio == 8 ? true : false,
            product: this.state.radio == 9 ? true : false,
            operator: this.state.radio == 10 ? true : false,
            today: this.state.today.isEnabled,
            graphicType,
            typePeriod: this.state.typePeriod,
            endDate: this.state.endDate.send == '' ? null : this.state.endDate.send,
            height: this.state.height,
            title: this.state.title
        };
        
        let crudService = new CrudService();

        let result; 
        let action = "";

        if(this.state.data.id == 0){
            result = await crudService.post(`kpi`, createKpi, this.state.data.userData.token);
            action = "Criado";
        }
        else{
            result = await crudService.put(`kpi`, createKpi, this.state.data.userData.token);
            action = "Alterado";
        }

        if(result.status == 200){
            Alert.alert(
                `${action} com Sucesso`,
                `KPI ${action} com Sucesso.`,
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
                        onPress: () => this.props.navigation.navigate('Home'),
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
    }

    render() {
        return (
            <>
                <Header
                    leftComponent={<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Home')}>
                                        <Icon
                                            name='keyboard-backspace'
                                            color='#fff'
                                        />
                                    </TouchableWithoutFeedback>
                    }
                    centerComponent={
                        <Text h4 style={{textAlign: "center", color: "#fff" }}>
                            KPI
                        </Text>
                    }
                    containerStyle={{
                        backgroundColor: COLORS.default,
                        paddingTop: 0,
                    }}
                />
                <View style={{flex: 1}}>
                    <ScrollView>
                        <View style={{flex: 5,alignItems: 'center'}}>
                            <View style={{width: width * 0.8, marginTop: 15}}>
                                <DateTimePickerModal
                                    isVisible={this.state.isDatePickerVisible}
                                    onConfirm={this.handleConfirm}
                                    onCancel={this.hideDatePicker}
                                    mode={'datetime'}
                                    is24Hour={true}
                                />

                                <Text style={{marginBottom:5}}>Título:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                    <TextInput style={styles.input} value={this.state.title} onChangeText={text => this.setState({title: text})}/>
                                </View>

                                <Text style={{marginBottom:5}}>Altura: (Default 150)</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                    <TextInput keyboardType='numeric' style={styles.input} value={this.state.height} onChangeText={text => this.setState({height: text})}/>
                                </View>

                                <Text style={{marginBottom:5}}>Data Fim:</Text>
                                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                        <TouchableOpacity onPress={() => this.showPicker()}>
                                            <TextInput style={{ borderBottomWidth: 1,    
                                                                borderBottomColor: '#ddd',
                                                                width: 200,
                                                                textAlign: 'center'
                                                            }} 
                                                editable={false}
                                                value={this.state.endDate.show}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 15, paddingBottom: 10}}>
                                        <Text>Atual:</Text>
                                        <Switch
                                            disabled={this.state.today.disabled}
                                            trackColor={{ false: "#767577", true: COLORS.default }}
                                            thumbColor={this.state.today.isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={this.toggleSwitch}
                                            value={this.state.today.isEnabled}
                                        />
                                    </View>
                                </View>
                                
                                <Text style={{marginBottom:5}}>Tipo Período:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                    <Picker
                                        style={pickerStyle}
                                        selectedValue={this.state.typePeriod}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({typePeriod: itemValue})
                                        }>
                                            <Picker.Item key={0} value={0} label="DIA" />
                                            <Picker.Item key={1} value={1} label="SEMANA" />
                                            <Picker.Item key={2} value={2} label="MÊS" />
                                            <Picker.Item key={3} value={3} label="ANO" />
                                    </Picker>
                                </View>
                                
                                <Text style={{marginBottom:5}}>Tipo de KPI:</Text>
                                <RadioForm
                                    ref={this.myRef}
                                    radio_props={radio_props}
                                    initial={this.state.initial}
                                    formHorizontal={false}
                                    labelHorizontal={true}
                                    animation={true}
                                    onPress={(value) => {this.setState({radio: value})}}
                                    buttonSize={10}
                                    labelStyle={{marginRight: 15}}
                                />
                                {
                                    (this.state.radio == 1) && (
                                        <>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.multiClients.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Clientes selecionados..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangeClients}
                                                    selectedItems={this.state.multiClients.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar clientes"
                                                    selectedText="Selecionados"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>
                                            
                                            {
                                                (this.state.multiClients.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={this.state.initial2}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                {
                                    (this.state.radio == 2) && (
                                        <>
                                            <Text style={{marginBottom:5, marginTop: 10}}>Cliente:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>
                                                <Picker
                                                    style={pickerStyle}
                                                    selectedValue={this.state.client.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.changeClient(itemValue)
                                                    }>
                                                    {this.state.client.arrayCombo}
                                                </Picker>
                                            </View>

                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.contacts.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Contatos selecionados..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangeContact}
                                                    selectedItems={this.state.contacts.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar contatos"
                                                    selectedText="Selecionados"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>
                                            
                                            {
                                                (this.state.contacts.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={0}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                {
                                    (this.state.radio == 3) && (
                                        <>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.priority.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Prioridades selecionadas..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangePriority}
                                                    selectedItems={this.state.priority.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar prioridades"
                                                    selectedText="Selecionadas"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>

                                            {
                                                (this.state.priority.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={0}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                {
                                    (this.state.radio == 4) && (
                                        <>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.multiAreas.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Áreas selecionadas..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangeArea}
                                                    selectedItems={this.state.multiAreas.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar áreas"
                                                    selectedText="Selecionadas"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>
                                            
                                            {
                                                (this.state.multiAreas.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={0}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                {
                                    (this.state.radio == 5) && (
                                        <>
                                            <Text style={{marginBottom:5}}>Área:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                <Picker
                                                    style={pickerStyle}
                                                    selectedValue={this.state.area.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.changeArea(itemValue)
                                                    }>
                                                    {this.state.area.arrayCombo}
                                                </Picker>
                                            </View>

                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.multiCategory.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Categorias selecionadas..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangeCategory}
                                                    selectedItems={this.state.multiCategory.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar categorias"
                                                    selectedText="Selecionadas"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>

                                            {
                                                (this.state.multiCategory.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={0}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                {
                                    (this.state.radio == 6) && (
                                        <>
                                            <Text style={{marginBottom:5}}>Área:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                                <Picker
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
                                                    style={pickerStyle}
                                                    selectedValue={this.state.category.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.changeCategory(itemValue)
                                                    }>
                                                    {this.state.category.arrayCombo}
                                                </Picker>
                                            </View>

                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.multiSubject.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Assuntos selecionados..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangeSubject}
                                                    selectedItems={this.state.multiSubject.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar assuntos"
                                                    selectedText="Selecionados"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>

                                            {
                                                (this.state.multiSubject.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={0}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                {
                                    (this.state.radio == 7) && (
                                        <>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.status.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Status selecionados..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangeStatus}
                                                    selectedItems={this.state.status.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar status"
                                                    selectedText="Selecionados"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>
                                            
                                            {
                                                (this.state.status.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={0}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                {
                                    (this.state.radio == 8) && (
                                        <>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.level.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Níveis selecionados..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangeLevel}
                                                    selectedItems={this.state.level.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar níveis"
                                                    selectedText="Selecionados"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>
                                            
                                            {
                                                (this.state.level.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={0}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                {
                                    (this.state.radio == 9) && (
                                        <>
                                            <Text style={{marginBottom:5, marginTop: 10}}>Cliente:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>
                                                <Picker
                                                    style={pickerStyle}
                                                    selectedValue={this.state.client.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.changeClient(itemValue)
                                                    }>
                                                    {this.state.client.arrayCombo}
                                                </Picker>
                                            </View>
                                            
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.products.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Produtos selecionados..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangeProduct}
                                                    selectedItems={this.state.products.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar produtos"
                                                    selectedText="Selecionados"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>

                                            {
                                                (this.state.products.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={0}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                {
                                    (this.state.radio == 10) && (
                                        <>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10, marginTop: 10, paddingBottom: 10}}> 
                                                <SectionedMultiSelect
                                                    items={this.state.operators.items}
                                                    IconRenderer={MaterialIcons}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Operadores selecionados..."
                                                    showDropDowns={true}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={this.onSelectedItemsChangeOperator}
                                                    selectedItems={this.state.operators.selectedItems}
                                                    confirmText="Selecionar"
                                                    searchPlaceholderText="Filtar operadores"
                                                    selectedText="Selecionados"
                                                    showCancelButton={true}
                                                    showDropDowns={false}
                                                    noResultsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item correspondente a pesquisa</Text>}
                                                    noItemsComponent={<Text style={{marginTop: 10, textAlign: 'center'}}>Nenhum item</Text>}
                                                />
                                            </View>
                                            
                                            {
                                                (this.state.operators.selectedItems.length == 1) && (
                                                    <>
                                                        <Text style={{marginBottom:5}}>Tipo de Gráfico:</Text>
                                                        <RadioForm
                                                            radio_props={radio_props2}
                                                            initial={0}
                                                            formHorizontal={true}
                                                            labelHorizontal={true}
                                                            animation={true}
                                                            onPress={(value) => {this.setState({radio2: value})}}
                                                            buttonSize={10}
                                                            labelStyle={{marginRight: 15}}
                                                        />
                                                    </>
                                                )
                                            }
                                        </>
                                    )
                                }
                                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
                                    {
                                        (this.state.data.id != 0) && (
                                            <TouchableOpacity
                                                style={styles.backButton}
                                                activeOpacity = { .5 }
                                                onPress={() => this.removeKPI()}
                                            >
                                                <Text style={styles.backText}>Excluir</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                
                                    <TouchableOpacity
                                        style={styles.nextButton}
                                        activeOpacity = { .5 }
                                        onPress={() => this.saveKPI()}
                                    >
                                        <Text style={styles.nextText}>{this.state.data.id == 0 ? "Salvar" : "Alterar"}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </>
        );
    }

    async componentDidMount(){
        
        let crudService = new CrudService();
        
        let resultClients = await crudService.get(`comboDemands/getComboClients/${this.state.data.userData.userData.personId}`, this.state.data.userData.token);
        
        if(resultClients.status == 200){
            this.setState({
                client: {
                    array: [...resultClients.data],
                    selected: this.state.client.selected,
                    arrayCombo: [
                        <Picker.Item key={0} value={0} label={`SELECIONE O CLIENTE`} />,
						resultClients.data.map((c, i) => {
							return <Picker.Item key={i} value={c.clientId} label={c.clientName} />
						})
                    ]
                },
                multiClients: {
                    items: [
                        {
                            name: 'Clientes',
                            id: 0,
                            children: [
                                {
                                    name: 'Todos',
                                    id: 0,
                                },
                                ...resultClients.data.map((c, i) => {
                                    return {
                                        name: c.clientName,
                                        id: c.clientId
                                    }
                                }),
                            ]
                        }
                    ],
                    selectedItems: this.state.multiClients.selectedItems
                },
            });
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
                        onPress: () => this.props.navigation.navigate('Home'),
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

        let resultAreas = await crudService.get(`comboDemands/getComboAreaFilter/${this.state.data.userData.userData.personId}`, this.state.data.userData.token);
			
        if(resultAreas.status == 200){
            this.setState({
                area: {
                    array: [...resultAreas.data],
                    selected: 0,
                }
            }, () => {
                this.setState({
                    area: {
                        array: [...resultAreas.data],
                        selected: this.state.area.selected,
                        arrayCombo: [
                            <Picker.Item key={0} value={0} label={`SELECIONE A ÁREA`} />,
                            resultAreas.data.map((a, i) => {
                                return <Picker.Item key={i} value={a.areaId} label={a.areaName} />
                            })
                        ]
                    },
                    multiAreas: {
                        items: [
                            {
                                name: 'Áreas',
                                id: 0,
                                children: [
                                    {
                                        name: 'Todas',
                                        id: 0,
                                    },
                                    ...resultAreas.data.map((a, i) => {
                                        return {
                                            name: a.areaName,
                                            id: a.areaId
                                        }
                                    })
                                ]
                            }
                        ],
                        selectedItems: this.state.multiAreas.selectedItems
                    },
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
                        onPress: () => this.props.navigation.navigate('Home'),
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
        
        let resultPriority = await crudService.get(`comboDemands/getComboPriority/${this.state.data.userData.userData.signatureId}`, this.state.data.userData.token);
        
        if(resultPriority.status == 200){
            this.setState({
                priority: {
                    items: [
                        {
                            name: 'Prioridades',
                            id: 0,
                            children: [
                                {
                                    name: 'Todas',
                                    id: 0,
                                },
                                ...resultPriority.data.map((p, i) => {
                                    return {
                                        name: p.description,
                                        id: p.priorityId
                                    }
                                })
                            ]
                        }
                    ],
                    selectedItems: this.state.priority.selectedItems
                },
            })
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
                        onPress: () => this.props.navigation.navigate('Home'),
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

        let resultOperators = await crudService.get(`comboDemands/getComboOperatorsFilter/${this.state.data.userData.userData.signatureId}`, this.state.data.userData.token);
    
        if(resultOperators.status == 200){
            
            this.setState({
                operators: {
                    items: [
                        {
                            name: 'Operadores',
                            id: 0,
                            children: [
                                {
                                    name: 'Todos',
                                    id: 0,
                                },
                                ...resultOperators.data.map((o, i) => {
                                    return {
                                        name: o.operatorName,
                                        id: o.operatorId
                                    }
                                })
                            ]
                        }
                    ],
                    selectedItems: this.state.operators.selectedItems
                },
            })
        }
        else if(resultOperators.status == 401){
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
        else if(resultOperators.status == 400){
            Alert.alert(
                "Erro",
                resultOperators.data[0],
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

        let idKpi = this.state.data.id;
        
        if(idKpi != 0){
            let kpi = await crudService.get(`kpi/getKpi/${idKpi}`, this.state.data.userData.token);
    
            if(kpi.status == 200){

                let selected = kpi.data.clients ? 1 : kpi.data.contact ? 2 : kpi.data.priority ? 3 : kpi.data.sector ? 4 : kpi.data.category ? 5 : kpi.data.subject ? 6 : kpi.data.status ? 7 : kpi.data.supportLevel ? 8 : kpi.data.product ? 9 : 10;

                this.myRef.current.updateIsActiveIndex(selected - 1);

                this.setState({
                    height: kpi.data.height.toString(),
                    title: kpi.data.title,
                    initial: selected,
                    radio: selected,
                    typePeriod: kpi.data.typePeriod,
                    initial2: kpi.data.typePeriod,
                    radio2: kpi.data.typePeriod,
                    today: {
                        isEnabled: kpi.data.today,
                        disabled: this.state.today.disabled
                    },
                    endDate: {
                        show: kpi.data.endDate != null ? moment(kpi.data.endDate).format("DD/MM/YYYY HH:mm") : null,
                        send: kpi.data.endDate != null ? moment(kpi.data.endDate).format("YYYY/MM/DD HH:mm") : null
                    },
                });

                let arrCombos = kpi.data.idsCombo.split(";");
                
                if(selected == 1){
                    this.setState({
                        multiClients: {
                            items: this.state.multiClients.items,
                            selectedItems: kpi.data.idsCombo.split`,`.map(x=>+x)
                        }
                    })
                }
                else if(selected == 2){
                    this.changeClient(parseInt(arrCombos[0]), arrCombos[1].split`,`.map(x=>+x), false);
                }
                else if(selected == 3){
                    this.setState({
                        priority: {
                            items: this.state.priority.items,
                            selectedItems: kpi.data.idsCombo.split`,`.map(x=>+x)
                        }
                    })
                }
                else if(selected == 4){
                    this.setState({
                        multiAreas: {
                            items: this.state.multiAreas.items,
                            selectedItems: kpi.data.idsCombo.split`,`.map(x=>+x)
                        }
                    })
                }
                else if(selected == 5){
                    this.changeArea(parseInt(arrCombos[0]), arrCombos[1].split`,`.map(x=>+x));
                }
                else if(selected == 6){
                    this.changeArea(parseInt(arrCombos[0]), [], parseInt(arrCombos[1]));
                    this.changeCategory(parseInt(arrCombos[1]), arrCombos[2].split`,`.map(x=>+x));
                }
                else if(selected == 7){
                    this.setState({
                        status: {
                            items: this.state.status.items,
                            selectedItems: kpi.data.idsCombo.split`,`.map(x=>+x)
                        }
                    })
                }
                else if(selected == 8){
                    this.setState({
                        level: {
                            items: this.state.level.items,
                            selectedItems: kpi.data.idsCombo.split`,`.map(x=>+x)
                        }
                    })   
                }
                else if(selected == 9){
                    
                }
                else if(selected == 10){
                    this.setState({
                        operators: {
                            items: this.state.operators.items,
                            selectedItems: kpi.data.idsCombo.split`,`.map(x=>+x)
                        }
                    })  
                }
            }
            else if(kpi.status == 401){
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
            else if(kpi.status == 400){
                Alert.alert(
                    "Erro",
                    kpi.data[0],
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
        }
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
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
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
        backgroundColor:'#ff0000',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#000',
        width: 150
    },
    backText: {
        color: '#fff',
        textAlign:'center'
    }  
});