import React, {Component} from 'react';
import { StyleSheet, 
        View, 
        Dimensions,
        Image,
        TouchableOpacity,
        Text,
        Picker,
        ActivityIndicator,
        Alert
    } from 'react-native';

import CrudService from '../../services/Crud/CrudService.js';

import COLORS from '../../styles/Colors.js';

const width = Dimensions.get('screen').width;

export default class LoginSignatureScreen extends Component{

    constructor(props){
        super(props);

        this.state = {
            login: props.navigation.state.params.login, 
            signature: "0",
            listSignatures: [],
            isLoading: true
        }
    }

    buttonNext = () => { 
        this.props.navigation.navigate('LoginPassword', {login: this.state.login, signature: this.state.signature});
    }

    buttonBack = () => {
        this.props.navigation.navigate('LoginEmail');
    }

    async componentDidMount() {
        let crudService = new CrudService();
        let result = await crudService.get(`auth/getSignatures?email=${this.state.login}`);
        
        if(result.status == 200)
            this.setState({
                listSignatures: [...result.data],
                isLoading: false
            })

        else{
            Alert.alert(
                "Erro",
                result.data[0],
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

    render() {
        let signatures = this.state.listSignatures.map((s, i) => {
            return <Picker.Item key={i} value={s.signatureId} label={s.name} />
        });

        return(
            <View style={styles.container}>
                {
                    this.state.isLoading && (
                        <View style={styles.containerLoader}>
                            <ActivityIndicator size="large" color={COLORS.default} />
                        </View>
                    )
                }
                {
                    !this.state.isLoading && (
                        <View style={styles.container}>
                            <View style={styles.top}>
                                <Image style={styles.logo} 
                                    source={require('../../assets/img/logo.png')}/>
                            </View>
                            <View style={styles.bottom}>
                                <Text style={styles.stage}>Etapa 2 de 3</Text>
                                <View style={styles.form}>    
                                    <Text style={styles.labelForm}>Selecione a Assinatura</Text>
                                    <View style={styles.viewInput}>
                                        <Picker
                                            style={pickerStyle}
                                            selectedValue={this.state.signature}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.setState({signature: itemValue})
                                            }>
                                            <Picker.Item key={0} value={0} label="SELECIONE A ASSINATURA" />
                                            {signatures}
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
                    )
                }
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