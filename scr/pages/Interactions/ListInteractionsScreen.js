import React, { useEffect, useState, PureComponent } from 'react';

import { View, ActivityIndicator, FlatList, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import { Card, Header, Text, Icon, Avatar } from 'react-native-elements';

import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import COLORS from '../../styles/Colors.js';

import CrudService from '../../services/Crud/CrudService.js';
import moment from 'moment';

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
    
    let crudService = new CrudService();
    const [listInteractions, setListInteractions] = useState(
        {
            data: [], 
			page: 0,
			loading: false,
        }
    );
    
	const [refreshing, setRefreshing] = useState(false);

    const [onEndReachedCalledDuringMomentum , setOnEndReachedCalledDuringMomentum ] = useState(false);

    useEffect(() => {
		
		async function getInteractionsInitial(){
            await getInteractions();
            setRefreshing(false);
		}

		getInteractionsInitial();
	}, [refreshing]);

	const getInteractions = async () => {
        
        if (!onEndReachedCalledDuringMomentum) {

            if (listInteractions.loading) return;
            
            setListInteractions({
				data: [...listInteractions.data],
				page: listInteractions.page,
				loading: refreshing == true ? false : true,
            })
            
            let result = await crudService.get(`interactions?DemandsId=${props.navigation.state.params.demandsId}&page=${listInteractions.page}`, props.navigation.state.params.userData.token);
            
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

                setListInteractions({
					data: [...listInteractions.data, ...result.data],
					page: listInteractions.page + 25,
					loading: false,
				})	
            }

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

    return(
        <View style={{flex:1}}>
            <View style={{flex:7}}>
                <Header
                    leftComponent={<TouchableWithoutFeedback onPress={() => props.navigation.navigate('DemandsList')}>
                                        <Icon
                                            name='keyboard-backspace'
                                            color='#fff'
                                        />
                                    </TouchableWithoutFeedback>
                                    }
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
            <View style={{flex:1, flexDirection: 'row', marginLeft: 10, marginRight: 10, marginBottom: 10, backgroundColor: "#efefef", borderRadius:20}}>
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
	}
  })