import React, {Component} from 'react';

import { createMaterialTopTabNavigator } from 'react-navigation';

import { View, ScrollView, StyleSheet, Picker, TextInput, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Card, Header, Text, Icon, Avatar } from 'react-native-elements';

import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';

import COLORS from '../../styles/Colors.js';

const width = Dimensions.get('screen').width;

class NovoChamado extends Component{

    constructor(props){
        super(props);
        
        this.state = {
            language: 'Default'
        }
    }

    render(){
        return(
            <View style={{flex:1}}>
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
                                <Text style={{marginBottom:5}}>Cliente:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>
                                    <Picker
                                        style={pickerStyle}
                                        selectedValue={this.state.language}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="Toyota" value="toyota" />
                                        <Picker.Item label="Honda" value="honda" />
                                    </Picker>
                                </View>

                                <Text h5 style={{marginBottom:5}}>Contato Cliente:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>
                                    <Picker
                                        style={pickerStyle}
                                        selectedValue={this.state.language}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="Kaique" value="kaique" />
                                        <Picker.Item label="Jose" value="jose" />
                                    </Picker>
                                </View>

                                <Text h5 style={{marginBottom:5}}>Prioridade:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
                                    <Picker
                                        style={pickerStyle}
                                        selectedValue={this.state.language}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="Alta" value="alta" />
                                        <Picker.Item label="Média" value="media" />
                                        <Picker.Item label="Baixa" value="baixa" />
                                    </Picker>
                                </View>

                                <Text h5 style={{marginBottom:5}}>Área:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
                                    <Picker
                                        style={pickerStyle}
                                        selectedValue={this.state.language}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="Infra" value="infra" />
                                        <Picker.Item label="Rede" value="rede" />
                                    </Picker>
                                </View>

                                <Text h5 style={{marginBottom:5}}>Categoria:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
                                    <Picker
                                        style={pickerStyle}
                                        selectedValue={this.state.language}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="Impressora" value="computador" />
                                        <Picker.Item label="Computador" value="impressora" />
                                    </Picker>
                                </View>
                                
                                <Text h5 style={{marginBottom:5}}>Assunto:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
                                    <Picker
                                        style={pickerStyle}
                                        selectedValue={this.state.language}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="Impressora não imprime" value="naoImprime" />
                                        <Picker.Item label="Acabou a tinta" value="acabouTinta" />
                                    </Picker>
                                </View>

                                <Text h5 style={{marginBottom:5}}>Status:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
                                    <Picker
                                        style={pickerStyle}
                                        selectedValue={this.state.language}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="Aguardando atendimento" value="aguardando" />
                                        <Picker.Item label="Em atendimento" value="atendendo" />
                                    </Picker>
                                </View>

                                <Text h5 style={{marginBottom:5}}>Nível Suporte:</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', marginBottom: 20}}>                
                                    <Picker
                                        style={pickerStyle}
                                        selectedValue={this.state.language}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.setState({language: itemValue})
                                        }>
                                        <Picker.Item label="1º Nível" value="1" />
                                        <Picker.Item label="2º Nível" value="2" />
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View> 
            </View>
        );     
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
    textAreaContainer: {
      borderColor: '#bdc3c7',
      borderWidth: 1,
      padding: 5
    },
    textArea: {
      height: 150,
      justifyContent: "flex-start"
    }
  })

export default createMaterialTopTabNavigator({
    NovoChamado:{ 
        screen: NovoChamado,
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
    initialRouteName: 'NovoChamado',
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeTintColor: 'orange',
        style: { backgroundColor: COLORS.default },
        indicatorStyle: {
            height: 0
        }
    }
});