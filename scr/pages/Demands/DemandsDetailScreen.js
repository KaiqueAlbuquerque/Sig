import React, { Component, PureComponent } from 'react';

import RBSheet from "react-native-raw-bottom-sheet";

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
import { Card, Header, Text, Icon, Avatar } from 'react-native-elements';

import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import COLORS from '../../styles/Colors.js';
import CardFiles from '../Components/CardFiles.js';

import CrudService from '../../services/Crud/CrudService.js';

import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

const width = Dimensions.get('screen').width;

class MyListItem extends PureComponent {
	render() {
		return (
			<TouchableOpacity onPress={() => console.log("aqui")}>
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
                statusId: 0,
                enabled: true
            },
            level: {
                levelId: 0,
                enabled: true
            },
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
            isLoading: true
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
        })        
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
        })        
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
        })
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
            if(this.state.dataDemands != null)
            {
                this.changeSubject(this.state.dataDemands.subjectId);
            }
        })        
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
            sla: "",
            expectedDateTime: '',
            switch: {
                isEnabled: false,
                disabled: this.state.switch.disabled
            }
        });    

        if(itemValue != 0){
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
                })  
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
                }) 
            })

            let crudService = new CrudService();
            
            let clientInList = this.state.client.array.find((cli) => {
                return cli.clientId == itemValue;
            })
    
            let resultContacts = await crudService.get(`comboDemands/getComboContact/${clientInList.clientHelpDeskId}`, this.state.data.userData.token);
            
            if(resultContacts.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmailScreen'),
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
                            onPress: () => this.props.navigation.navigate('DemandsListScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else{
                this.setState({
                    contact: {
                        array: [...resultContacts.data],
                        selected: this.state.contact.selected,
                        enabled: this.state.contact.enabled
                    }
                }, this.populateContact);
            }

            let resultAreas = await crudService.get(`comboDemands/getComboArea?clientHelpDeskId=${clientInList.clientHelpDeskId}&PersonId=${this.state.data.userData.userData.personId}`, this.state.data.userData.token);
                
            if(resultAreas.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmailScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if(resultAreas.status == 400){
                Alert.alert(
                    "Erro",
                    resultContacts.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('DemandsListScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else{
                this.setState({
                    area:{
                        array: [...resultAreas.data],
                        selected: this.state.area.selected,
                        enabled: this.state.area.enabled
                    }
                }, this.populateArea);
            }

            let resultProducts = await crudService.get(`comboDemands/getComboProduct/${itemValue}`, this.state.data.userData.token);
                
            if(resultProducts.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmailScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if(resultProducts.status == 400){
                Alert.alert(
                    "Erro",
                    resultContacts.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('DemandsListScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else{
                this.setState({
                    products: {
                        listProducts: resultProducts.data,
                        selectOrChange: this.state.products.selectOrChange,
                        selected: this.state.products.selected
                    }
                })
            }
        }
        else{
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
                })
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
                })
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
                })
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
                })
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
            },
            sla: "",
            expectedDateTime: '',
            switch: {
                isEnabled: false,
                disabled: this.state.switch.disabled
            }
        });

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
                })
            });

            let crudService = new CrudService();

            let resultCategory = await crudService.get(`comboDemands/getComboCategory/${itemValue}`, this.state.data.userData.token);
            
            if(resultCategory.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmailScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if(resultCategory.status == 400){
                Alert.alert(
                    "Erro",
                    resultContacts.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('DemandsListScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else{
                this.setState({
                    category: {
                        array: [...resultCategory.data],
                        enabled: this.state.category.enabled,
                        selected: 0
                    }
                }, this.populateCategory);
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
                })
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
                })
            })
        }
    }

    changeCategory = async (itemValue) => {
        
        let enable = true;
        if(this.state.dataDemands != null)
            enable = false;

        this.setState({
            category: {
                array: [...this.state.category.array],
                enabled: enable,
                selected: itemValue,
                arrayCombo: [...this.state.category.arrayCombo]
            },
            sla: "",
            expectedDateTime: '',
            switch: {
                isEnabled: false,
                disabled: this.state.switch.disabled
            }
        });

        if(itemValue != 0){
            let crudService = new CrudService();

            let resultSubject = await crudService.get(`comboDemands/getComboSubject/${itemValue}`, this.state.data.userData.token);
            
            if(resultSubject.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmailScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if(resultSubject.status == 400){
                Alert.alert(
                    "Erro",
                    resultContacts.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('DemandsListScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else{
                this.setState({
                    subject: {
                        array: [...resultSubject.data],
                        enabled: this.state.subject.enabled,
                        selected: 0
                    }
                }, this.populateSubject);
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
                })                
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
            
            if(this.state.dataDemands == null){
                
                this.setState({
                    sla: sla,
                    expectedDateTime: moment(slaReturn.expectedDate).format("DD/MM/YYYY HH:mm"),
                    switch: {
                        isEnabled: false,        
                        disabled: this.state.switch.disabled
                    }
                })
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
                    })
                }
                else{

                    this.setState({
                        sla: sla,
                        expectedDateTime: "",
                        switch: {
                            isEnabled: this.state.dataDemands.noExpectedDate,        
                            disabled: this.state.switch.disabled
                        }         
                    })
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
        })
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
        }, async (datas) => {
            if(datas.customButton == 'photo'){
                ImagePicker.launchCamera({mediaType: 'photo'}, (response) => {
                    console.log(response);
                })
            }
            else if(datas.customButton == 'video'){
                ImagePicker.launchCamera({mediaType: 'video'}, (response) => {
                    console.log(response);
                })
            }
            else if(datas.customButton == 'files'){
                try {
                    const results = await DocumentPicker.pickMultiple({
                      type: [DocumentPicker.types.allFiles],
                    });
                    for (const res of results) {
                      console.log(res);
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
                console.log(datas);
            }
        });
    }

    renderItem = ({ item }) => (
		<MyListItem
			item={item}
    	/>
    );
    
    handleConfirm = (datetime) => {
        this.setState({
            isDatePickerVisible: false,
            expectedDateTime: moment(datetime).format("DD/MM/YYYY HH:mm")
        })
    }

    hideDatePicker = () => {
        this.setState({
            isDatePickerVisible: false
        })
    }

    showPicker = () => {
        
        if(this.state.dataDemands == null){
            this.setState({
                isDatePickerVisible: true
            })
        }
    }

    toggleSwitch = () => {

        this.setState({
            switch: {
                isEnabled: !this.state.switch.isEnabled,        
                disabled: this.state.switch.disabled
            },
            expectedDateTime: ''
        })
    }

    showDemadsId = () => {

        if(this.state.data.demandsId != undefined){
            return <Text style={{marginBottom:10, marginTop:20, fontSize: 20, fontWeight: "bold"}}>Chamado: {this.state.dataDemands.codeId}</Text>
        }
    }

    afterDidMount = () => {
        
        if(this.state.dataDemands.listAttachments.length > 0){
            
            var listAttachments = this.state.dataDemands.listAttachments.map((attachment, index) => {
                
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
                            name={attachment.fileName}
                            left={number}
                        />
            });

            let component = <View style={{ height: 130, marginTop: 20 }}>
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
                statusId: this.state.status.statusId,
                enabled: false
            },
            level: {
                levelId: this.state.level.levelId,
                enabled: false
            },
            switch: {
                isEnabled: this.state.switch.isEnabled,
                disabled: true
            },
            isLoading: false
        })
        
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
                                    centerComponent={<Text h4 style={{textAlign: 'center', color: '#fff'}}>Detalhes</Text>}
                                    containerStyle={{
                                        backgroundColor: COLORS.default,
                                        paddingTop: 0
                                    }}
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <ScrollView>
                                    <View style={{flex: 5,alignItems: 'center'}}>
                                        <View style={{lex: 1, width: width * 0.8, marginTop: 15}}>
                                            
                                            <Text h4 style={{marginBottom:10}}>Informações:</Text>
                                            {this.showDemadsId()}
                                            
                                            <Text style={{marginBottom:5}}>Cliente:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>
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
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>
                                                <Picker
                                                    enabled={this.state.contact.enabled}
                                                    style={pickerStyle}
                                                    selectedValue={this.state.contact.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.setState({
                                                            contact: {
                                                                array: [...this.state.contact.array],
                                                                selected: itemValue,
                                                                enabled: this.state.contact.enabled,
                                                                arrayCombo: [...this.state.contact.arrayCombo]
                                                            }
                                                        })
                                                    }>
                                                    {this.state.contact.arrayCombo}
                                                </Picker>
                                            </View>
                
                                            <Text style={{marginBottom:5}}>Prioridade:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
                                                <Picker
                                                    enabled={this.state.priority.enabled}
                                                    style={pickerStyle}
                                                    selectedValue={this.state.priority.selected}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.setState({
                                                            priority: {
                                                                array: [...this.state.priority.array],
                                                                selected: itemValue,
                                                                enabled: this.state.priority.enabled,
                                                                arrayCombo: [...this.state.priority.arrayCombo]
                                                            }
                                                        })
                                                    }>
                                                    {this.state.priority.arrayCombo}
                                                </Picker>
                                            </View>
                
                                            <Text style={{marginBottom:5}}>Área:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
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
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
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
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
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
                
                                            <Text style={{marginBottom:5}}>Status:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
                                                <Picker
                                                    enabled={this.state.status.enabled}
                                                    style={pickerStyle}
                                                    selectedValue={this.state.status.statusId}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.setState({
                                                            status: {
                                                                statusId: itemValue,
                                                                enabled: this.state.status.enabled
                                                            }
                                                        })
                                                    }>
                                                    <Picker.Item key={0} value={0} label="SELECIONE O STATUS" />
                                                    <Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />
                                                    <Picker.Item key={50} value={50} label="EM ATENDIMENTO" />
                                                </Picker>
                                            </View>
                
                                            <Text style={{marginBottom:5}}>Nível Suporte:</Text>
                                            <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
                                                <Picker
                                                    enabled={this.state.level.enabled}
                                                    style={pickerStyle}
                                                    selectedValue={this.state.level.levelId}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.setState({
                                                            level: {
                                                                levelId: itemValue,
                                                                enabled: this.state.level.enabled
                                                            }
                                                        })
                                                    }>
                                                    <Picker.Item key={1} value={1} label="NIVEL 1" />
                                                    <Picker.Item key={2} value={2} label="NIVEL 2" />
                                                    <Picker.Item key={3} value={3} label="NIVEL 3" />
                                                </Picker>
                                            </View>

                                            <Text style={{marginBottom:10, fontSize: 20, fontWeight: "bold"}}>SLA: {this.state.sla}</Text>
                                            
                                            <DateTimePickerModal
                                                isVisible={this.state.isDatePickerVisible}
                                                onConfirm={this.handleConfirm}
                                                onCancel={this.hideDatePicker}
                                                mode={'datetime'}
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
                                                
                                            <Text h4 style={{marginBottom:10, marginTop: 20}}>Equipamento:</Text>
                                            {this.state.products.selected}
                                            <View style={{marginTop:10, marginBottom:10}}>
                                                <TouchableOpacity onPress={() => this.RBSheet.open()}>
                                                    <Text>{this.state.products.selectOrChange} o equipamento</Text>
                                                </TouchableOpacity>
                                            </View>
                                                
                                            <Text h4 style={{marginBottom:10}}>Anexos:</Text>
                                            {this.state.attachmentsList}
                
                                            <View style={{marginTop:10, marginBottom:10}}>
                                                <TouchableOpacity onPress={this.openPicker}>
                                                    <Text>Selecione os arquivos</Text>
                                                </TouchableOpacity>
                                            </View>
                
                                            <RBSheet
                                                ref={ref => {
                                                    this.RBSheet = ref;
                                                }}
                                                closeOnDragDown={true}
                                                closeOnPressMask={false}
                                                animationType={"slide"}
                                                customStyles={{
                                                    wrapper: {
                                                        backgroundColor: "rgba(0,0,0,0.5)"
                                                    },
                                                    container: {
                                                        height: "50%",
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
                                                <FlatList
                                                    style={{ flex: 1.8, marginBottom: 20 }}
                                                    contentContainerStyle={ styles.list }
                                                    data={ this.state.products.listProducts }
                                                    renderItem={ this.renderItem }
                                                    keyExtractor={(item, index) => item.productId.toString()}
                                                />
                                            </RBSheet>
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
        let crudService = new CrudService();
        
        let resultClients = await crudService.get(`comboDemands/getComboClients/${this.state.data.userData.userData.personId}`, this.state.data.userData.token);
        
        if(resultClients.status == 401){
            Alert.alert(
                "Sessão Expirada",
                "Sua sessão expirou. Por favor, realize o login novamente.",
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('LoginEmailScreen'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else if(resultClients.status == 400){
            Alert.alert(
                "Erro",
                resultContacts.data[0],
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('DemandsListScreen'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else{
            this.setState({
                client: {
                    array: [...resultClients.data],
                    selected: this.state.client.selected,
                    enabled: true,
                    arrayCombo: this.state.client.arrayCombo
                }
            }, this.populateClient);
        }

        let resultPriority = await crudService.get(`comboDemands/getComboPriority/${this.state.data.userData.userData.signatureId}`, this.state.data.userData.token);
        
        if(resultPriority.status == 401){
            Alert.alert(
                "Sessão Expirada",
                "Sua sessão expirou. Por favor, realize o login novamente.",
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('LoginEmailScreen'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else if(resultPriority.status == 400){
            Alert.alert(
                "Erro",
                resultContacts.data[0],
                [
                    {
                        text: "Ok",
                        onPress: () => this.props.navigation.navigate('DemandsListScreen'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else{
            this.setState({
                priority: {
                    array: [...resultPriority.data],
                    selected: this.state.priority.selected,
                    enabled: true,
                    arrayCombo: this.state.priority.arrayCombo
                }
            }, this.populatePriority);
        }

        if(this.state.data.demandsId != undefined){
            let getDemands = await crudService.get(`demands/${this.state.data.demandsId}`, this.state.data.userData.token);
            
            if(getDemands.status == 401){
                Alert.alert(
                    "Sessão Expirada",
                    "Sua sessão expirou. Por favor, realize o login novamente.",
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('LoginEmailScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if(getDemands.status == 400){
                Alert.alert(
                    "Erro",
                    resultContacts.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => this.props.navigation.navigate('DemandsListScreen'),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else{
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
                        statusId: getDemands.data.statusId,
                        enabled: false
                    },
                    level: {
                        levelId: getDemands.data.supportLevelId,
                        enabled: false
                    },
                    products: {
                        listProducts: this.state.products.listProducts,
                        selectOrChange: "Trocar",
                        selected: <Text style={{marginBottom:10, fontSize: 15}}>{labelEquipment}</Text>
                    }
                }, this.afterDidMount);
            }
        }
        else{
            this.setState({
                isLoading: false
            })
        }
    }
}

function UselessTextInput(props) {
    return ( 
      <TextInput style={styles.textArea}
        placeholder="Digite a interação..."
        placeholderTextColor="grey"
        {...props} 
        editable
      />
    );
  }
  
function UselessTextInputMultiline() {
    const [value, onChangeText] = React.useState('');
    return(
        <View style={styles.textAreaContainer}>
            <UselessTextInput
                multiline
                numberOfLines={4}
                onChangeText={text => onChangeText(text)}
                value={value}
            />
        </View>
    );
}

class Interacao extends Component{
    render(){
        var lista = [];
        for(var i = 0; i < 10; i++){
            if (i % 2 == 0) {
                lista.push(
                    <View>
                        <View style={{flexDirection: 'row', marginLeft:15, marginTop:15}}>
                            <View style={{flex:1}}>
                                <Avatar size="medium" rounded title="KA" />                        
                            </View>
                            <View style={{flex:5, justifyContent:'center'}}>
                                <Text style={{fontSize:15, fontWeight: 'bold'}}>Kaique Albuquerque</Text>
                                <Text style={{fontSize:10, fontWeight: 'bold'}}>kaiquealbuqueque@hotmail.com</Text>
                            </View>
                        </View>
                        <Card containerStyle={{borderRadius:30}}>
                            <Text style={{fontSize:15}}>Lorem {'\n'}Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de 
                                impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido 
                                pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. 
                                Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração 
                                eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, 
                                quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente 
                                quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker. {i}
                            </Text>
                        </Card>
                    </View>  
                )      
            }
            else{
                lista.push(
                    <View>
                        <View style={{flexDirection: 'row-reverse', marginRight:20, marginTop:15}}>
                            <View style={{flex:1}}>
                                <Avatar size="medium" rounded title="KA" />                        
                            </View>
                            <View style={{flex:5, justifyContent:'center', alignItems:'flex-end', marginRight:15}}>
                                <Text style={{fontSize:15, fontWeight: 'bold'}}>Kaique Albuquerque</Text>
                                <Text style={{fontSize:10, fontWeight: 'bold'}}>kaiquealbuqueque@hotmail.com</Text>
                            </View>
                        </View>
                        <Card containerStyle={{borderRadius:30}}>
                            <Text style={{fontSize:15}}>Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de 
                                impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido 
                                pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. 
                                Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração 
                                eletrônica, permanecendo essencialmente inalterado. Se popularizou na década de 60, 
                                quando a Letraset lançou decalques contendo passagens de Lorem Ipsum, e mais recentemente 
                                quando passou a ser integrado a softwares de editoração eletrônica como Aldus PageMaker. {i}
                            </Text>
                        </Card>
                    </View> 
                )
            }
            
        }
        return(
            <View style={{flex:1}}>
                <View style={{flex:7}}>
                    <Header
                        leftComponent={<Icon
                                        name='keyboard-backspace'
                                        color='#fff'
                                        onPress={() => this.props.navigation.navigate('DemandsList')} />}
                        centerComponent={<Text h4 style={{textAlign: 'center', color: '#fff'}}>Interações</Text>}
                        containerStyle={{
                            backgroundColor: COLORS.default,
                            paddingTop: 0
                    }}
                    />
                    <ScrollView>
                        {lista}
                    </ScrollView>
                </View>
                <View style={{flex:1, flexDirection: 'row', marginTop:20, marginBottom:5, backgroundColor: "#efefef", borderRadius:40}}>
                    <View style={{flex:10, paddingLeft:10, justifyContent: 'center'}}>
                        <AutoGrowingTextInput placeholder={'Digite sua Interação'} />                
                    </View>
                    <View style={{flex:2, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon
                            name='send'
                            color='#000'
                            onPress={() => console.log("aqui")} />
                    </View>
                </View>
            </View> 
        );
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
    textAreaContainer: {
      borderColor: '#bdc3c7',
      borderWidth: 1,
      padding: 5
    },
    textArea: {
      height: 150,
      justifyContent: "flex-start"
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
    }
  })

export default createMaterialTopTabNavigator({
    DemandsDetail:{ 
        screen: DemandsDetailScreen,
        navigationOptions:{
          tabBarLabel:'Detalhes'
        }   
    },
    Interacao: { 
        screen: Interacao,
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