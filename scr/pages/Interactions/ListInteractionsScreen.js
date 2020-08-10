import React, { useEffect, useState, PureComponent, useRef } from 'react';

import { View, 
         ActivityIndicator, 
         FlatList, 
         StyleSheet, 
         Alert, 
         TouchableWithoutFeedback, 
         TouchableOpacity,
         Picker,
         TextInput,
         ScrollView } from 'react-native';
import { Card, Header, Text, Icon, Avatar, CheckBox } from 'react-native-elements';

import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import COLORS from '../../styles/Colors.js';
import CardFiles from '../Components/CardFiles.js';

import CrudService from '../../services/Crud/CrudService.js';
import moment from 'moment';

import RBSheet from "react-native-raw-bottom-sheet";
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

class MyListItem extends PureComponent {
	render() {
        
        let textInteraction = "";
        let initials = "";
        let email = this.props.interaction.login.toLowerCase();
        let arrInitials = this.props.interaction.name.split(" ");
        let render;

        if(arrInitials.length >= 2)
            initials = `${arrInitials[0].substr(0,1).toUpperCase()}${arrInitials[1].substr(0,1).toUpperCase()}`;
        else if(arrInitials.length == 1)
            initials = arrInitials[0].substr(0,2).toUpperCase();

        textInteraction = this.props.interaction.comment.replace("\\r\\n", "{'\\n'}");

        if (this.props.interaction.userTypeId != 1) {
            render = <View style={{ marginBottom:5 }}>
                        <View style={{flexDirection: 'row', marginLeft:15, marginTop:15}}>
                            <View style={{flex:1}}>
                                <Avatar size="medium" rounded title={initials} />                        
                            </View>
                            <View style={{flex:5, justifyContent:'center'}}>
                                <Text style={{fontSize:15, fontWeight: 'bold'}}>{this.props.interaction.name}</Text>
                                <Text style={{fontSize:10, fontWeight: 'bold'}}>{email}</Text>
                                <Text style={{fontSize:10, fontWeight: 'bold'}}>{moment(this.props.interaction.dateHour).format("DD/MM/YYYY HH:mm")}</Text>
                            </View>
                        </View>
                        <Card containerStyle={{borderRadius:15}}>
                            <Text style={{fontSize:15}}>{textInteraction}</Text>
                        </Card>
                    </View> 
        }
        else{
            render = <View style={{ marginBottom:5 }}>
                        <View style={{flexDirection: 'row-reverse', marginStart:8, marginTop:15}}>
                            <View style={{flex:1}}>
                                <Avatar size="medium" rounded title={initials} />                        
                            </View>
                            <View style={{flex:5, justifyContent:'center', alignItems:'flex-end', marginRight:15}}>
                                <Text style={{fontSize:15, fontWeight: 'bold'}}>{this.props.interaction.name}</Text>
                                <Text style={{fontSize:10, fontWeight: 'bold'}}>{email}</Text>
                                <Text style={{fontSize:10, fontWeight: 'bold'}}>{moment(this.props.interaction.dateHour).format("DD/MM/YYYY HH:mm")}</Text>
                            </View>
                        </View>
                        <Card containerStyle={{borderRadius:15}}>
                            <Text style={{fontSize:15}}>{textInteraction}</Text>
                        </Card>
                    </View>
        }
		return (
			<>
                {render}
            </>
	  	)
	}
}

export default function ListInteractionsScreen(props){
    
    const refRBSheet = useRef();
    const refRBSheetAttachments = useRef();

    let crudService = new CrudService();
    const [listInteractions, setListInteractions] = useState(
        {
            data: [], 
			page: 0,
			loading: false,
        }
    );

    const [interaction, setInteraction] = useState("");
    const [typeService, setTypeService] = useState(0);
    const [listContacts, setListContacts] = useState(
        {
            array: [],
            selected: 0,
            arrayCombo: [
                <Picker.Item key={0} value={0} label={`SELECIONE O CONTATO`} />
            ]
        }
    )
    const [listOperators, setListOperators] = useState(
        {
            array: [],
            selected: 0,
            arrayCombo: [
                <Picker.Item key={0} value={0} label={`SELECIONE O OPERADOR`} />
            ]
        }
    )
    const [listStatus, setListStatus] = useState(
        {
            selected: 50,
            arrayCombo: [
                <Picker.Item key={50} value={50} label={`EM ATENDIMENTO`} />
            ]
        }
    )
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [sendContact, setSendContact] = useState(true);
    const [filesSendInteraction, setFilesSendInteraction] = useState([]);
    const [attachmentsList, setAttachmentsList] = useState([]);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum ] = useState(false);

    useEffect(() => {

        async function getInteractionsInitial(){
            await getInteractions();
            setRefreshing(false);
            console.log(props.navigation.state.params)
		}

        props.navigation.addListener('willFocus', (route) => { 
            getInteractionsInitial();
        });

        props.navigation.addListener('didBlur', (route) => { 
            setInteraction("");
        });

        getInteractionsInitial();
        insertFileGallery();
	}, [refreshing, filesSendInteraction]);

	const getInteractions = async () => {
        
        if (!onEndReachedCalledDuringMomentum) {

            if (listInteractions.loading) return;
            
            setListInteractions({
				data: [...listInteractions.data],
				page: listInteractions.page,
				loading: refreshing == true ? false : true,
            })
            
            if(props.navigation.state.params.demandsId != undefined || props.navigation.state.params.createDemands.demandsId != undefined){
                
                let idDemands = props.navigation.state.params.demandsId != undefined ? props.navigation.state.params.demandsId : props.navigation.state.params.createDemands.demandsId;

                let result = await crudService.get(`interactions?DemandsId=${idDemands}&page=${listInteractions.page}`, props.navigation.state.params.userData.token);
            
                if(result.status == 200){
                    setListInteractions(result.data);

                    setListInteractions({
                        data: [...listInteractions.data, ...result.data],
                        page: listInteractions.page + 25,
                        loading: false,
                    });	
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
                                onPress: () => this.props.navigation.navigate('DemandsList'),
                                style: "ok"
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
            else{
                setListInteractions({
                    data: [...listInteractions.data],
                    page: listInteractions.page,
                    loading: false,
                })
            }
            setIsLoading(false);
            setOnEndReachedCalledDuringMomentum(true);
        }
    }
    
    const renderFooter = () => {
		if (!listInteractions.loading) return null;
			return (
				<View style={styles.loading}>
					<ActivityIndicator />
				</View>
		);
    };
    
    const renderItem = ({ item }) => (
		<MyListItem
			interaction={item}
    	/>
    );
    
    const showSaveButton = () => {

        if(props.navigation.state.params.demandsId == undefined && props.navigation.state.params.createDemands.demandsId == undefined){
            return (
                    <TouchableWithoutFeedback onPress={() => saveDemands()}>
                        <Icon
                            name='save'
                            color='#fff'
                        />
                    </TouchableWithoutFeedback>
            )
        }        
    }

    const saveDemands = async () => {
        
        setIsLoading(true);
        
        props.navigation.state.params.createDemands.signatureId = props.navigation.state.params.userData.userData.signatureId;
        props.navigation.state.params.createDemands.userHelpDeskId = props.navigation.state.params.userData.userData.userHelpDeskId;
        props.navigation.state.params.createDemands.userType = props.navigation.state.params.userData.userData.userType;
        let label = props.navigation.state.params.userData.labels.find((lbl) => {
            return lbl.typeLabel == 1
        });

        props.navigation.state.params.createDemands.term = label.name;

        let objSend = {...props.navigation.state.params.createDemands};
        delete objSend.filesSend;

        var data = new FormData();
        data.append('Request', JSON.stringify(objSend));

        if(props.navigation.state.params.createDemands.filesSend != undefined){
            props.navigation.state.params.createDemands.filesSend.forEach((file) => {
                data.append('Files', file);
            });
        }

        let crudService = new CrudService();

        let result = await crudService.postWithFile(`demands`, data, props.navigation.state.params.userData.token);
        
        if(result.status == 200){            
            props.navigation.state.params.createDemands.demandsId = result.data.demandsId;
            props.navigation.state.params.createDemands.getDemands = result.data;

            setInteraction("");
            getInteractions();
            setRefreshing(false);
            setIsLoading(false);

            Alert.alert(
                "Cadastrado com Sucesso.",
                `${label.name} ${result.data.codeId} criado com sucesso.`,
                [
                    {
                        text: "Ok",
                        onPress: () => props.navigation.navigate('DemandsDetail', {userData: props.navigation.state.params.userData, demandsId: result.data.demandsId, createDemands: {}}),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else if(result.status == 401){
            setIsLoading(false);

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
            setIsLoading(false);

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
            setIsLoading(false);

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

    const changeComment = (value) => {
        
        setInteraction(value);
        
        if(props.navigation.state.params.createDemands != undefined){
            props.navigation.state.params.createDemands.description = value;
        }
    }

    const openSendDetails = async () => {

        refRBSheet.current.open();

        if(props.navigation.state.params.createDemands.getDemands.statusId == 50){
            setListStatus({
                selected: listStatus.selected,
                arrayCombo: [
                    <Picker.Item key={50} value={50} label="EM ATENDIMENTO" />,
                    <Picker.Item key={10} value={10} label="AGUARDANDO ATENDIMENTO" />,
                    <Picker.Item key={20} value={20} label="AGUARDANDO RETORNO CLIENTE" />
                ]
            })
        }

        let getComboContact = await crudService.get(`comboDemands/getComboContact/${props.navigation.state.params.createDemands.getDemands.clientHelpDeskId}`, props.navigation.state.params.userData.token);
        if(getComboContact.status == 200){
            setListContacts({
                array: [...getComboContact.data],
                selected: props.navigation.state.params.createDemands.getDemands.contactId,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O CONTATO`} />,
                    getComboContact.data.map((c, i) => {
                        return <Picker.Item key={i} value={c.contactId} label={c.contactName} />
                    })
                ]
            })
        }
        else if(getComboContact.status == 401){
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
        else if(getComboContact.status == 400){
            Alert.alert(
                "Erro",
                getComboContact.data[0],
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }

        let getComboOperators = await crudService.get(`comboDemands/getComboOperators/${props.navigation.state.params.createDemands.getDemands.areaId}`, props.navigation.state.params.userData.token);
        if(getComboOperators.status == 200){
            setListOperators({
                array: [...getComboOperators.data],
                selected: props.navigation.state.params.createDemands.getDemands.responsibleOperatorId != null ? props.navigation.state.params.createDemands.getDemands.responsibleOperatorId : 0,
                arrayCombo: [
                    <Picker.Item key={0} value={0} label={`SELECIONE O OPERADOR`} />,
                    getComboOperators.data.map((o, i) => {
                        return <Picker.Item key={i} value={o.operatorId} label={o.operatorName} />
                    })
                ]
            })
        }
        else if(getComboOperators.status == 401){
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
        else if(getComboOperators.status == 400){
            Alert.alert(
                "Erro",
                getComboOperators.data[0],
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
                        onPress: () => this.props.navigation.navigate('DemandsList'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
    }

    const showSendButton = () => {
        
        if(props.navigation.state.params.createDemands.getDemands != undefined){

            let status = props.navigation.state.params.createDemands.getDemands.statusId;

            if(status != 30 && status != 40 && status != 60 && status != 70){
                return (
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon
                            name='send'
                            color='#000'
                            onPress={() => openSendDetails()} />
                    </View>
                )
            }
        }
    }

    const showAttachmentButton = () => {
        
        if(props.navigation.state.params.createDemands.getDemands != undefined){

            let status = props.navigation.state.params.createDemands.getDemands.statusId;

            if(status != 30 && status != 40 && status != 60 && status != 70){
                return (
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon
                            name='attachment'
                            color='#000'
                            onPress={() => openPicker()} />
                    </View>
                )
            }
        }
    }

    const openPicker = () => {
        
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
                        
                        setFilesSendInteraction([...filesSendInteraction, file]);
                    }
                })
            }
            else if(datas.customButton == 'files'){
                try {
                    let arrayFiles = [];
                    const results = await DocumentPicker.pickMultiple({
                        type: [DocumentPicker.types.allFiles],
                    });
                    for (const res of results) {
                        let file = {
                            uri: res.uri,
                            name: res.name,
                            type: res.type
                        };
                        arrayFiles.push(file);
                    }
                    
                    setFilesSendInteraction([...filesSendInteraction, ...arrayFiles]);
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
                    
                    setFilesSendInteraction([...filesSendInteraction, file]);
                }
            }
        });
    }

    const showQtdAttachment = () => {
        if(filesSendInteraction.length > 0){
            return (
                <TouchableWithoutFeedback onPress={() => refRBSheetAttachments.current.open()}>
                    <View style={{marginLeft: 10}}>
                        <Text>{filesSendInteraction.length} {filesSendInteraction.length == 1 ? "Anexo" : "Anexos"}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }

    const insertFileGallery = () => {
        
        if(filesSendInteraction.length >= 0){
            
            let listAttachments = filesSendInteraction.map((attachment, index) => {
                
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
                            userData={props.navigation.state.params.userData.userData}
                            navigation={props.navigation}
                            removeAttachment={removeAttachment}
                        />
            });

            if(filesSendInteraction.length > 0){
                let component = <View style={{ height: 130, marginTop: 10 }}>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {listAttachments}
                                    </ScrollView>
                                </View>

                setAttachmentsList(component);
            }
            else{
                setAttachmentsList([]);
            }
        }
    }

    const removeAttachment = (index) => {
        
        setFilesSendInteraction(
            filesSendInteraction.filter((attachment) => {
                if(attachment.index != index){
                    return attachment;
                };
            })
        )
    }

    const backPress = () => {
        getInteractions();
        refRBSheet.current.close();
        setTypeService(0);
        setSendContact(true);
        setHours(0);
        setMinutes(0);
        setListStatus({
            selected: 50,
            arrayCombo: [
                <Picker.Item key={50} value={50} label={`EM ATENDIMENTO`} />
            ]
        });
    }

    const saveInteraction = async () => {

        let demandsId = props.navigation.state.params.demandsId != undefined ? props.navigation.state.params.demandsId : props.navigation.state.params.createDemands.demandsId;

        refRBSheet.current.close();
        setIsLoading(true);

        let hoursValidate = hours == "" ? 0 : hours.trim().replace(",",".");
        let minutesValidate = minutes == "" ? 0 : minutes.trim().replace(",",".");
        
        if(hoursValidate < 0){
            setIsLoading(false);

            Alert.alert(
                "Erro",
                "Hora não pode ser um valor menor que 0.",
                [
                    {
                        text: "Ok",
                        onPress: () => refRBSheet.current.open(),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else if(minutesValidate < 0 || minutesValidate > 59){
            setIsLoading(false);

            Alert.alert(
                "Erro",
                "Minuto não pode ser um valor menor que 0 ou maior do que 59.",
                [
                    {
                        text: "Ok",
                        onPress: () => refRBSheet.current.open(),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else if(!((hoursValidate % 1) === 0)) {
            setIsLoading(false);

            Alert.alert(
                "Erro",
                "Hora inválida.",
                [
                    {
                        text: "Ok",
                        onPress: () => refRBSheet.current.open(),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else if(!((minutesValidate % 1) === 0)) {
            setIsLoading(false);

            Alert.alert(
                "Erro",
                "Minuto inválido.",
                [
                    {
                        text: "Ok",
                        onPress: () => refRBSheet.current.open(),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else{
            let label = props.navigation.state.params.userData.labels.find((lbl) => {
                return lbl.typeLabel == 1
            });
    
            let createInteraction = {
                demandsId: demandsId,
                signatureId: props.navigation.state.params.userData.userData.signatureId,
                userHelpDeskId: props.navigation.state.params.userData.userData.userHelpDeskId,
                userType: props.navigation.state.params.userData.userData.userType,
                private: false,
                comment: interaction,
                serviceType: typeService,
                attendanceTime: `${hoursValidate}:${minutesValidate}`,
                showDescription: true,
                sendEmail: sendContact,
                status: listStatus.selected,
                contactId: listContacts.selected,
                operatorId: listOperators.selected,
                term: label.name
            };
    
            var data = new FormData();
            data.append('Request', JSON.stringify(createInteraction));
    
            filesSendInteraction.forEach((file) => {
                data.append('Files', file);
            });
            
            let crudService = new CrudService();
    
            let result = await crudService.postWithFile(`interactions`, data, props.navigation.state.params.userData.token);
            
            if(result.status == 200){  
                
                setInteraction("");
                setFilesSendInteraction([]);
                setTypeService(0);
                setSendContact(true);
                setHours(0);
                setMinutes(0);
                setListStatus({
                    selected: 50,
                    arrayCombo: [
                        <Picker.Item key={50} value={50} label={`EM ATENDIMENTO`} />
                    ]
                });
                getInteractions();
                setRefreshing(false);
                setIsLoading(false);
    
                Alert.alert(
                    "Cadastrado com Sucesso.",
                    `Interação criada com sucesso.`,
                    [
                        {
                            text: "Ok",
                            onPress: () => props.navigation.navigate('DemandsDetail', {userData: props.navigation.state.params.userData, createDemands: {}, demandsId: demandsId}),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if(result.status == 401){
                setIsLoading(false);
    
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
                setIsLoading(false);
    
                Alert.alert(
                    "Erro",
                    result.data[0],
                    [
                        {
                            text: "Ok",
                            onPress: () => refRBSheet.current.open(),
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
            else{
                setIsLoading(false);
    
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

    return(
        <View style={{flex:1}}>
            {
                isLoading && (
                    <View style={styles.containerLoader}>
                        <ActivityIndicator size="large" color={COLORS.default} />
                    </View>
                    
                )
            }
            {
                !isLoading && (
                    <React.Fragment>
                        <View style={{flex:7}}>
                            <Header
                                leftComponent={<TouchableWithoutFeedback onPress={() => props.navigation.navigate('DemandsList')}>
                                                    <Icon
                                                        name='keyboard-backspace'
                                                        color='#fff'
                                                    />
                                                </TouchableWithoutFeedback>
                                }
                                rightComponent={showSaveButton}
                                centerComponent={<Text h4 style={{textAlign: 'center', color: '#fff'}}>Interações</Text>}
                                containerStyle={{
                                    backgroundColor: COLORS.default,
                                    paddingTop: 0
                                }}
                            />
                            <FlatList
                                inverted={true}
                                style={{ flex: 1.8, marginBottom: 20 }}
                                contentContainerStyle={ styles.list }
                                data={ listInteractions.data }
                                renderItem={ renderItem }
                                keyExtractor={(item, index) => item.interactionId.toString()}
                                onEndReached={ getInteractions }
                                onEndReachedThreshold={ 0.1 }
                                onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
                                ListFooterComponent={ renderFooter }
                            />
                        </View>
                        { showQtdAttachment() }
                        <View style={{flexDirection: 'row', marginLeft: 10, marginRight: 10, marginBottom: 10, backgroundColor: "#efefef", borderRadius:20, maxHeight: 60}}>
                            <View style={{flex:10, paddingLeft:10, justifyContent: 'center'}}>
                                <AutoGrowingTextInput placeholder={'Digite sua Interação'} value={interaction} onChangeText={value => changeComment(value)} />                
                            </View>
                            { showAttachmentButton() }
                            { showSendButton() }
                        </View>
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
                                    <Text h4 style={{marginBottom:10, marginTop:15, textAlign: 'center'}}>Atendimento</Text>
                                    
                                    <Text style={{marginBottom:10}}>Status:</Text>
                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                        <Picker
                                            style={pickerStyle}
                                            selectedValue={listStatus.selected}
                                            onValueChange={(itemValue, itemIndex) =>
                                                setListStatus({
                                                    selected: itemValue,
                                                    arrayCombo: [...listStatus.arrayCombo]
                                                })
                                            }>
                                            {listStatus.arrayCombo}
                                        </Picker>
                                    </View>

                                    <Text style={{marginBottom:10}}>Tipo de Atendimento:</Text>
                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                        <Picker
                                            style={pickerStyle}
                                            selectedValue={typeService}
                                            onValueChange={(itemValue, itemIndex) =>
                                                setTypeService(itemValue)
                                            }>
                                            <Picker.Item key={0} value={0} label="SELECIONE" />
                                            <Picker.Item key={10} value={10} label="ACESSO REMOTO" />
                                            <Picker.Item key={20} value={20} label="EMAIL" />
                                            <Picker.Item key={30} value={30} label="HELPDESK" />
                                            <Picker.Item key={40} value={40} label="WHATSAPP" />
                                            <Picker.Item key={50} value={50} label="SMS" />
                                            <Picker.Item key={60} value={60} label="TELEFONE" />
                                            <Picker.Item key={70} value={70} label="VISITA" />
                                        </Picker>
                                    </View>

                                    <Text style={{marginBottom:10}}>Tempo Gasto:</Text>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                        <Text style={{marginBottom:5}}>Horas:</Text>
                                        <Text style={{marginBottom:5}}>Minutos:</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                            <TextInput 
                                                keyboardType='numeric' 
                                                onChangeText = {(e)=> setHours(e)}
                                                value = {String (hours)}
                                                style={styles.input} />
                                        </View>
                                        <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                            <TextInput 
                                                keyboardType='numeric' 
                                                onChangeText = {(e)=> setMinutes(e)}
                                                value = {String (minutes)}
                                                style={styles.input} />
                                        </View>
                                    </View>

                                    <Text style={{marginBottom:10}}>Encaminhar para Contato:</Text>
                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                        <Picker
                                            style={pickerStyle}
                                            selectedValue={listContacts.selected}
                                            onValueChange={(itemValue, itemIndex) =>
                                                setListContacts({
                                                    array: [...listContacts.array],
                                                    selected: itemValue,
                                                    arrayCombo: [...listContacts.arrayCombo]
                                                })
                                            }>
                                            {listContacts.arrayCombo}
                                        </Picker>
                                    </View>

                                    <Text style={{marginBottom:10}}>Encaminhar para Operador:</Text>
                                    <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 10}}>                
                                        <Picker
                                            style={pickerStyle}
                                            selectedValue={listOperators.selected}
                                            onValueChange={(itemValue, itemIndex) =>
                                                setListOperators({
                                                    array: [...listOperators.array],
                                                    selected: itemValue,
                                                    arrayCombo: [...listOperators.arrayCombo]
                                                })
                                            }>
                                            {listOperators.arrayCombo}
                                        </Picker>
                                    </View>

                                    <CheckBox
                                        center
                                        title='Enviar email p/ contato'
                                        checked={sendContact}
                                        onPress={() => setSendContact(!sendContact)}
                                    />

                                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
                                        <TouchableOpacity
                                            style={styles.backButton}
                                            activeOpacity = { .5 }
                                            onPress={() => backPress()}
                                        >
                                            <Text style={styles.backText}>Voltar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.nextButton}
                                            activeOpacity = { .5 }
                                            onPress={() => saveInteraction()}
                                        >
                                            <Text style={styles.nextText}>Confirmar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </RBSheet>

                        <RBSheet
                            ref={refRBSheetAttachments}
                            closeOnDragDown={false}
                            closeOnPressMask={true}
                            animationType={"slide"}
                            closeDuration={0}
                            customStyles={{
                                wrapper: {
                                    backgroundColor: "rgba(0,0,0,0.5)"
                                },
                                container: {
                                    height: "35%",
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
                            <Text h4 style={{marginBottom:10, marginTop:15, textAlign: 'center'}}>Anexos</Text>
                            {attachmentsList}
                        </RBSheet>
                    </React.Fragment> 
                )
            }
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
    textAreaContainer: {
      borderColor: '#bdc3c7',
      borderWidth: 1,
      padding: 5
    },
    textArea: {
      height: 150,
      justifyContent: "flex-start"
    },
    loading: {
		alignSelf: 'center',
		marginVertical: 20,
    },
    list: {
		paddingHorizontal: 20,
    },
    containerLoader: {
        flex: 1,
        justifyContent: "center"
    },	
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: 70,
        textAlign: 'center'
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
})