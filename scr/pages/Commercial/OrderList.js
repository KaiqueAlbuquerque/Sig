import React from "react";

import { View, ScrollView, StyleSheet } from "react-native";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Card, Header, Text } from "react-native-elements";

import { useSelector } from 'react-redux';

import COLORS from '../../styles/Colors.js';

export default function OrderListScreen(props){
    
    let havePermission = false;
	const data = useSelector(state => state.userData);
	let render;

	data.permissionAndMenu.forEach((menu, index) => {
        if(menu.menuId == 183){
			havePermission = true;
		}
	});

	if(havePermission){
        var list = [];
        for (var i = 0; i < 10; i++) {
            list.push(
                <Card containerStyle={{ borderRadius: 15 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>Pedido {i}</Text>
                    <Text>
                        <Text style={{ fontWeight: "bold" }}>Cliente:</Text> Toyota
                    </Text>
                </Card>
            );
        }

        render = <>
                    <Header
                        centerComponent={
                            <Text h4 style={{ textAlign: "center", color: "#fff" }}>
                                Lista de Pedidos
                            </Text>
                        }
                        rightComponent={{ icon: "filter-list", color: "#fff" }}
                        containerStyle={{
                            backgroundColor: COLORS.default,
                            paddingTop: 0,
                        }}
                    />
                    <ScrollView style={{ flex: 1.8 }}>{list}</ScrollView>
                    <ActionButton buttonColor="rgba(231,76,60,1)" style={{ flex: 0.2 }}>
                        <ActionButton.Item
                            buttonColor="#9b59b6"
                            title="Agenda"
                            onPress={() => props.navigation.navigate("AgendaPedidos")}
                        >
                            <Icon name="add" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                 </>
    }
    else{
        render = <View style={{flex:1,justifyContent: "center",alignItems: "center"}}>
					<Text style={{textAlignVertical: "center", textAlign: "center", fontSize: 15}}>Módulo de Gestão Comercial não habilitado em sua Assinatura.</Text> 
				 </View>
    }
	
    return (
		<View style={{ flex: 1 }}>
			{render}
		</View>
    );
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: "white",
    },
});