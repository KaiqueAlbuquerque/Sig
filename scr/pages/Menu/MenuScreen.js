import React from "react";

import { View, StyleSheet } from "react-native";
import { Card, ListItem, Text, Avatar } from "react-native-elements";

import { useSelector } from 'react-redux';

export default function MenuScreen(props){

	const data = useSelector(state => state.userData);
	
	let initials = "";
	let email = data.userData.login;
	let arrInitials = data.userData.name.split(" ");
	let hello = "";
	
	if(arrInitials.length >= 2){
		initials = `${arrInitials[0].substr(0,1).toUpperCase()}${arrInitials[1].substr(0,1).toUpperCase()}`;
		hello = arrInitials[0].toUpperCase();
	}
	else if(arrInitials.length == 1){
		initials = arrInitials[0].substr(0,2).toUpperCase();
		hello = arrInitials[0].toUpperCase();
	}
	
	const list = [
		{
			title: "Sair",
			icon: "replay",
		},
    ];
    return (
      	<View style={{ flex: 1 }}>
        	<View style={{ flex: 2 }}>
				<Card
					containerStyle={{
						borderRadius: 15,
						height: "50%",
						justifyContent: "center",
					}}
				>
					<View style={{ flex: 1, flexDirection: "row" }}>
						<View
							style={{
								flex: 1,
								height: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Avatar size="large" rounded title={initials} />
						</View>
						<View
							style={{
								flex: 2,
								height: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text h4>OLÁ { hello }</Text>
							<Text>{ email }</Text>
						</View>
					</View>
				</Card>
        	</View>
			<View style={{ flex: 2 }}>
				{list.map((item, i) => (
					<ListItem
						button onPress={() => props.navigation.navigate('LoginEmail') }
						key={i}
						title={item.title}
						leftIcon={{ name: item.icon }}
						bottomDivider
					/>
				))}
			</View>
      	</View>
    );
}