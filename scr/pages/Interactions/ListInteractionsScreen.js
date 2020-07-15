import React, {useEffect, useState} from 'react';

import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Header, Text, Icon, Avatar } from 'react-native-elements';

import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import COLORS from '../../styles/Colors.js';

import CrudService from '../../services/Crud/CrudService.js';
import moment from 'moment';

export default function ListInteractionsScreen(props){
    
    let crudService = new CrudService();
    const [listInteractions, setListInteractions] = useState([]);
    
    useEffect(() => {
		
		async function getInteractionsInitial(){
			await getInteractions();
		}

		getInteractionsInitial();
	});

	const getInteractions = async () => {
        
        let result = await crudService.get(`interactions/${props.navigation.state.params.demandsId}`, props.navigation.state.params.userData.token);
        
        if(result.status == 401){
            Alert.alert(
                "Sessão Expirada",
                "Sua sessão expirou. Por favor, realize o login novamente.",
                [
                    {
                        text: "Ok",
                        onPress: () => props.navigation.navigate('LoginEmailScreen'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else if(result.status == 400){
            Alert.alert(
                "Erro",
                resultContacts.data[0],
                [
                    {
                        text: "Ok",
                        onPress: () => props.navigation.navigate('DemandsListScreen'),
                        style: "ok"
                    }
                ],
                { cancelable: false }
            );
        }
        else{
            setListInteractions(result.data);
        }
	}

    var lista = [];
    listInteractions.forEach((interaction, i) => {

        let textInteraction = "";
        let initials = "";
        let email = interaction.login.toLowerCase();
        let arrInitials = interaction.name.split(" ");
        let hello = "";
        
        if(arrInitials.length >= 2){
            initials = `${arrInitials[0].substr(0,1).toUpperCase()}${arrInitials[1].substr(0,1).toUpperCase()}`;
            hello = arrInitials[0].toUpperCase();
        }
        else if(arrInitials.length == 1){
            initials = arrInitials[0].substr(0,2).toUpperCase();
            hello = arrInitials[0].toUpperCase();
        }

        textInteraction = interaction.comment.replace("\\r\\n", "{'\\n'}");

        if (interaction.userTypeId != 1) {
            lista.push(
                <View style={{ marginBottom:5 }}>
                    <View style={{flexDirection: 'row', marginLeft:15, marginTop:15}}>
                        <View style={{flex:1}}>
                            <Avatar size="medium" rounded title={initials} />                        
                        </View>
                        <View style={{flex:5, justifyContent:'center'}}>
                            <Text style={{fontSize:15, fontWeight: 'bold'}}>{interaction.name}</Text>
                            <Text style={{fontSize:10, fontWeight: 'bold'}}>{email}</Text>
                            <Text style={{fontSize:10, fontWeight: 'bold'}}>{moment(interaction.dateHour).format("DD/MM/YYYY HH:mm")}</Text>
                        </View>
                    </View>
                    <Card containerStyle={{borderRadius:30}}>
                        <Text style={{fontSize:15}}>{textInteraction}</Text>
                    </Card>
                </View>  
            )      
        }
        else{
            lista.push(
                <View style={{ marginBottom:5 }}>
                    <View style={{flexDirection: 'row-reverse', marginRight:20, marginTop:15}}>
                        <View style={{flex:1}}>
                            <Avatar size="medium" rounded title={initials} />                        
                        </View>
                        <View style={{flex:5, justifyContent:'center', alignItems:'flex-end', marginRight:15}}>
                            <Text style={{fontSize:15, fontWeight: 'bold'}}>{interaction.name}</Text>
                            <Text style={{fontSize:10, fontWeight: 'bold'}}>{email}</Text>
                            <Text style={{fontSize:10, fontWeight: 'bold'}}>{moment(interaction.dateHour).format("DD/MM/YYYY HH:mm")}</Text>
                        </View>
                    </View>
                    <Card containerStyle={{borderRadius:30}}>
                        <Text style={{fontSize:15}}>{textInteraction}</Text>
                    </Card>
                </View> 
            )
        }
    });

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