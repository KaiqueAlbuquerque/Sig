import React, {Component} from 'react';
import { StyleSheet, 
        View, 
        TextInput, 
        Dimensions,
        Image,
        TouchableOpacity, 
        StatusBar,
        Text,
        Alert
    } from 'react-native';

const width = Dimensions.get('screen').width;

export default class LoginEmailScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            login: '',
        }
    }

    buttonNext = () => {
        let login = this.state.login;

        if(login == ''){
            Alert.alert(
                "Dados inválidos",
                "Informe o login.",
                [
                    {
                        text: "Ok",
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else
            this.props.navigation.navigate('LoginSignature', {login: this.state.login});
    }

    componentDidMount(){
        StatusBar.setBarStyle('light-content',true);
        StatusBar.setBackgroundColor("#196280");
    };      

    render() {
        
        return(
            <View style={styles.container}>
                <View style={styles.top}>
                    <Image style={styles.logo} 
                        source={require('../../assets/img/logo.png')}/>
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.stage}>Etapa 1 de 3</Text>
                    <View style={styles.form}>                    
                        <Text style={styles.labelForm}>Login</Text>    
                        <View style={styles.viewInput}>
                            <TextInput style={styles.input} 
                                placeholder="exemplo@exemplo.com"
                                onChangeText={text => this.setState({login: text})}/>
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
        marginBottom: 50, 
        fontSize: 15
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
        marginBottom: 20
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
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
    }
})