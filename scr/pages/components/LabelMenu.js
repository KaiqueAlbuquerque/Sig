import React from 'react';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';

export function LabelDemands(props){
	
	const data = useSelector(state => state.userData);
	let nameMenu = "";
	
	data.permissionAndMenu.forEach((menu, index) => {
        if(menu.menuId == 24){
			nameMenu = menu.name
		}
	});
	
	let name = nameMenu == "" ? "Processos" : nameMenu;
	name =  name.length > 12 ? name.substr(0, 9).concat('…') : name
	return <Text>{ name }</Text>
}

export function LabelCommercial(props){
	
	const data = useSelector(state => state.userData);
	let nameMenu = "";
	
	data.permissionAndMenu.forEach((menu, index) => {
        if(menu.menuId == 183){
			nameMenu = menu.name
		}
	});
	
	let name = nameMenu == "" ? "WorkFlow" : nameMenu;
	name =  name.length > 12 ? name.substr(0, 9).concat('…') : name
	return <Text>{ name }</Text>
}