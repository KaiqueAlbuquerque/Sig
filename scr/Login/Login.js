import React, {Component} from 'react';
import { StyleSheet, 
        View, 
        TextInput, 
        Dimensions,
        Image,
        TouchableOpacity, 
        Alert,
        Text
    } from 'react-native';

const width = Dimensions.get('screen').width;

export default class HomeScreen extends Component{

    ButtonClickCheckFunction = () =>{
        this.props.navigation.navigate('Home');
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.topo}>
                    <Image style={styles.logo} 
                        source={require('../../img/logo.png')}/>
                </View>
                <View style={styles.baixo}>
                    <View style={styles.form}>                    
                        <TextInput style={styles.input} 
                            placeholder="Usuário..."
                            onChangeText={texto => this.setState({usuario: texto})}/>
                        <TextInput style={styles.input} 
                            placeholder="Senha..."
                            onChangeText={texto => this.setState({senha: texto})}/>    
                    </View>
                    <View style={styles.botao}>
                        <TouchableOpacity
                            style={styles.SubmitButtonStyle}
                            activeOpacity = { .5 }
                            onPress={ this.ButtonClickCheckFunction }
                        >
                            <Text style={styles.TextStyle}>Login</Text>
                        </TouchableOpacity>
                        <Text style={styles.btnEsqueci}>Esqueci minha senha</Text>
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
    topo: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: width, 
        height: 100
    },  
    baixo: {
        flex: 3,
        alignItems: 'center'
    },
    form: {
        flex: 1,
        width: width * 0.8
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    botao: {
        flex: 1,
        width: width * 0.8
    },
    SubmitButtonStyle: {
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
    TextStyle:{
        color:'#fff',
        textAlign:'center',
    },
    btnEsqueci: {
        marginTop: 20,
        color:'#808080',
        textAlign:'center'
    }
})