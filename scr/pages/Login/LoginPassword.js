import React, {Component} from 'react';
import { StyleSheet, 
        View, 
        TextInput,
        Dimensions,
        Image,
        TouchableOpacity,
        Text,
        Alert
    } from 'react-native';

import { Icon } from 'react-native-elements';
import CrudService from '../../services/Crud/CrudService.js';

const width = Dimensions.get('screen').width;

export default class LoginPasswordScreen extends Component{

    constructor(props) {
        super(props);

        this.toggleSwitch = this.toggleSwitch.bind(this);
        
        this.state = {
          showPassword: true,
          loginRequest: {
            email: props.navigation.state.params.login,
            signatureId: props.navigation.state.params.signature
          }
        }
    }

    toggleSwitch() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    buttonNext = async () => { 
        let password = this.state.loginRequest.password;
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
            let result = await crudService.post(`auth/login`, this.state.loginRequest);
            
            if(result.status == 200)
                this.props.navigation.navigate('Home');
            
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

            else{
                Alert.alert(
                    "Erro",
                    result.data,
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
        }        
    }

    buttonBack = () => {
        this.props.navigation.navigate('LoginSignature');
    }

    render() {
        
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
                                    secureTextEntry={this.state.showPassword}
                                    onChangeText={text => this.setState(prevState => ({
                                        loginRequest: {
                                            ...prevState.loginRequest,
                                            password: text
                                        }
                                    }))}
                                />
                                <Icon name="remove-red-eye" color="#000" onPress={() => !this.toggleSwitch() } />
                            </View>
                        </View>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.nextButton}
                            activeOpacity = { .5 }
                            onPress={ this.buttonNext }
                        >
                            <Text style={styles.nextText}>Próximo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.backButton}
                            activeOpacity = { .5 }
                            onPress={ this.buttonBack }
                        >
                            <Text style={styles.backText}>Voltar</Text>
                        </TouchableOpacity>
                    </View>                    
                </View>
            </View>
        );
    }
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
        height: 100
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
        width: width * 0.8
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
        backgroundColor:'#196280',
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