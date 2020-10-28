import React, { useState } from 'react';
import { StyleSheet, 
        View, 
        TextInput,
        Dimensions,
        Image,
        TouchableOpacity,
        Text,
        Alert
    } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { useDispatch } from 'react-redux';

import CrudService from '../../services/Crud/CrudService.js';

import COLORS from '../../styles/Colors.js';

const width = Dimensions.get('screen').width;

export default function LoginPasswordScreen(props){

    const dispatch = useDispatch();
    
    const [changeIcon, setChangeIcon] = useState("eye");
    const [showPassword, setShowPassword] = useState(true);
    const [loginRequest, setLoginRequest] = useState(
                            {
                                email: props.navigation.state.params.login, 
                                signatureId: props.navigation.state.params.signature,
                                password: ''
                            });
        
    const toggleSwitch = () => {
        setShowPassword(!showPassword);

        if(changeIcon == "eye"){
            setChangeIcon("eye-slash");
        }
        else{
            setChangeIcon("eye");
        }
    }

    const forgotMyPassword = async () => {
        let crudService = new CrudService();
        let result = await crudService.post(`auth/forgotMyPassword`, loginRequest);
        
        if(result.status == 200 || result.status == 204){
            Alert.alert(
                "E-mail enviado",
                "A senha foi enviada para o seu email.",
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
                        onPress: () => props.navigation.navigate('LoginEmail'),
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
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
    }

    const buttonNext = async () => { 
        let password = loginRequest.password;
        if(password == ''){
            Alert.alert(
                "Dados inválidos",
                "Informe a senha.",
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
            let crudService = new CrudService();
            let result = await crudService.post(`auth/login`, loginRequest);
            
            if(result.status == 200){
                
                dispatch({ type: 'ADD_DATA', data: result.data });
                props.navigation.navigate('Home');
            }
            else if(result.status == 401){
                Alert.alert(
                    "Dados inválidos",
                    "Login ou senha inválidos.",
                    [
                        {
                            text: "Ok",
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
                            onPress: () => props.navigation.navigate('LoginEmail'),
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
                            style: "ok"
                        }
                    ],
                    { cancelable: false }
                );
            }
        }        
    }

    const buttonBack = () => {
        props.navigation.navigate('LoginSignature');
    }
        
    return(
        <View style={styles.container}>
            <View style={styles.top}>
                <Image style={styles.logo} 
                    source={require('../../assets/img/logo.png')}/>
            </View>
            <View style={styles.bottom}>
            <Text style={styles.stage}>Etapa 3 de 3</Text>
                <View style={styles.form}>                    
                    <Text style={styles.labelForm}>Senha</Text>    
                    <View style={styles.viewInput}>
                        <View style={styles.viewInputIcon}>
                            <TextInput style={styles.input} 
                                placeholder="Senha..."
                                secureTextEntry={showPassword}
                                onChangeText={text => {
                                    setLoginRequest(prevState => {
                                        return {...prevState, password: text}
                                    });
                                }}
                            />
                            <Icon size={20} name={changeIcon} color="#000" onPress={ toggleSwitch } />
                        </View>
                    </View>
                    <TouchableOpacity
                        activeOpacity = { .5 }
                        onPress={ forgotMyPassword }
                    >
                        <Text style={{textAlign:'center'}}>Esqueci minha senha</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.nextButton}
                        activeOpacity = { .5 }
                        onPress={ buttonNext }
                    >
                        <Text style={styles.nextText}>Próximo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.backButton}
                        activeOpacity = { .5 }
                        onPress={ buttonBack }
                    >
                        <Text style={styles.backText}>Voltar</Text>
                    </TouchableOpacity>
                </View>                    
            </View>
        </View>
    );    
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    top: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: width, 
        height: 80,
        resizeMode: 'contain'
    },   
    bottom: {
        flex: 5,
        alignItems: 'center'
    },
    stage: {
        marginBottom: 50
    },
    form: {
        flex: 1,
        width: width * 0.8,
        marginBottom: 50
    },
    labelForm: {
        marginBottom: 5
    },
    viewInput: {
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: '#bdc3c7', 
        overflow: 'hidden', 
        marginBottom: 20, 
        paddingRight: 10 
    },
    viewInputIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: width * 0.7
    },
    button: {
        flex: 1,
        width: width
    },
    nextButton: {
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:COLORS.default,
        borderRadius:30,
        borderWidth: 1,
        borderColor: '#fff'
    },    
    nextText:{
        color:'#fff',
        textAlign:'center',
    },
    backButton: {
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'#fff',
        borderRadius:30,
        borderWidth: 1,
        borderColor: '#000'
    },
    backText: {
        color: '#000',
        textAlign:'center'
    }    
})