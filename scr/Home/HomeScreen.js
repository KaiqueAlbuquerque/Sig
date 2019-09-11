import React, {Component} from 'react';

import { Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

class HomeScreen extends Component {
  render(){
    return(
      <View>
        <Text>Tela Home</Text>
      </View>
    );
  }
}

class SettingsScreen extends Component {
  render(){
    return(
      <View>
        <Text>Tela Chamados</Text>
      </View>
    );
  }
}

class HomeScreen2 extends Component {
  render(){
    return(
      <View>
        <Text>Tela Pedidos</Text>
      </View>
    );
  }
}

class SettingsScreen2 extends Component {
  render(){
    return(
      <View>
        <Text>Tela Menu</Text>
      </View>
    );
  }
}

console.disableYellowBox = true;

export default createMaterialBottomTabNavigator({
  Home:{ screen: HomeScreen,
    navigationOptions:{
      tabBarLabel:'Início',
      tabBarIcon: ({tintColor}) => (
        <Icon name="home" color={tintColor} size={24} />
      )
    }
  },
  Settings: { screen: SettingsScreen,
    navigationOptions:{
      tabBarLabel:'Chamados',
      tabBarIcon: ({tintColor}) => (
        <Icon name="call" color={tintColor} size={24} />
      )
    }
  },
  Home2:{ screen: HomeScreen2,
    navigationOptions:{
      tabBarLabel:'Pedidos',
      tabBarIcon: ({tintColor}) => (
        <Icon name="create" color={tintColor} size={24} />
      )
    }
  },
  Settings2: { screen: SettingsScreen2,
    navigationOptions:{
      tabBarLabel:'Menu',
      tabBarIcon: ({tintColor}) => (
        <Icon name="menu" color={tintColor} size={24} />
      )
    }
  }
},
{
  initialRouteName: 'Home',
  barStyle: { backgroundColor: '#196280' },
  shifting: true,
});