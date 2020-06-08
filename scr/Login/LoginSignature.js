import React, {Component} from 'react';
import { StyleSheet, 
        View, 
        Dimensions,
        Image,
        TouchableOpacity,
        Text,
        Picker
    } from 'react-native';

const width = Dimensions.get('screen').width;

export default class LoginSignatureScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            login: props.navigation.state.params.login, 
            language: 'Default'
        }
    }

    buttonNext = () => { 
        this.props.navigation.navigate('LoginPassword');
    }

    buttonBack = () => {
        this.props.navigation.navigate('LoginEmail');
    }

    componentDidMount() {
        console.log(this.state.login);
    }

    render() {
        
        return(
            <View style={styles.container}>
                <View style={styles.top}>
                    <Image style={styles.logo} 
                        source={require('../../img/logo.png')}/>
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.stage}>Etapa 2 de 3</Text>
                    <View style={styles.form}>    
                        <Text style={styles.labelForm}>Selecione a Assinatura</Text>
                        <View style={styles.viewInput}>
                            <Picker
                                style={pickerStyle}
                                selectedValue={this.state.language}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({language: itemValue})
                                }>
                                <Picker.Item label="LWM" value="toyota" />
                                <Picker.Item label="Honda" value="honda" />
                            </Picker>
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