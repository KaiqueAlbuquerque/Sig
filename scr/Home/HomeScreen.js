import React, {Component} from 'react';

import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Card, ListItem, Header, Text, Avatar } from 'react-native-elements';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart
} from 'react-native-chart-kit'

class HomeScreen extends Component {
  render(){
    return(
      <ScrollView>
        <Text h3>Chamados</Text>
        <LineChart
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100
              ]
            }]
          }}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          yAxisLabel={'$'}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#196280',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />

        <Text h3>Equipamentos</Text>
        <BarChart
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100
              ]
            }]
          }}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          yAxisLabel={'$'}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#196280',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />

        <Text h3>Funcionário</Text>
        <PieChart
          data={[
            { name: 'Seoul', population: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { name: 'Toronto', population: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { name: 'New York', population: 8538000, color: '#ffffff', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
          ]}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#196280',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />

        <Text h3>Dia</Text>
        <ProgressChart
          data={{
            labels: ['Swim', 'Bike', 'Run'], // optional
            data: [0.4, 0.6, 0.8]
          }}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#196280',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
        />
      </ScrollView>
    );
  }
}

class SettingsScreen extends Component {
  render(){
    var lista = [];
    for(var i = 0; i < 10; i++){
      lista.push(
        <Card containerStyle={{borderRadius:15}}>
          <Text style={{fontWeight: "bold", fontSize: 20}}>Chamado {i}</Text>
          <Text><Text style={{fontWeight: "bold"}}>Cliente:</Text> Toyota</Text>
          <Text><Text style={{fontWeight: "bold"}}>Status:</Text> Aguardando Atendimento</Text>   
        </Card>  
      )      
    }
    return(
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={<Text h4 style={{textAlign: 'center', color: '#fff'}}>Lista de Chamados</Text>}
          rightComponent={{ icon: 'filter-list', color: '#fff' }}
          containerStyle={{
            backgroundColor: '#196280',
            paddingTop: 0
          }}
        />
        <ScrollView style={{ flex: 1.8 }}>
          {lista}   
        </ScrollView>
        <ActionButton buttonColor="rgba(231,76,60,1)" style={{ flex: 0.2 }}>
        <ActionButton.Item buttonColor='#fb8c00' title="QrCode" onPress={() => this.props.navigation.navigate('QrCode')}>
            <Icon name="add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#9b59b6' title="Novo Chamado" onPress={() => this.props.navigation.navigate('NovoChamado')}>
            <Icon name="add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>          
      </View>
    );
  }
}

class HomeScreen2 extends Component {
  render(){
    var lista = [];
    for(var i = 0; i < 10; i++){
      lista.push(
        <Card containerStyle={{borderRadius:15}}>
          <Text style={{fontWeight: "bold", fontSize: 20}}>Pedido {i}</Text>
          <Text><Text style={{fontWeight: "bold"}}>Cliente:</Text> Toyota</Text>   
        </Card>  
      )      
    }
    return(
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={<Text h4 style={{textAlign: 'center', color: '#fff'}}>Lista de Pedidos</Text>}
          rightComponent={{ icon: 'filter-list', color: '#fff' }}
          containerStyle={{
            backgroundColor: '#196280',
            paddingTop: 0
          }}
        />
        <ScrollView style={{ flex: 1.8 }}>
          {lista}   
        </ScrollView>
        <ActionButton buttonColor="rgba(231,76,60,1)" style={{ flex: 0.2 }}>
          <ActionButton.Item buttonColor='#9b59b6' title="Agenda" onPress={() => this.props.navigation.navigate('AgendaPedidos')}>
            <Icon name="add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>          
      </View>
    );
  }
}

class SettingsScreen2 extends Component {
  render(){
    const list = [
      {
        title: 'Bater Ponto',
        icon: 'av-timer'
      },
      {
        title: 'Sair',
        icon: 'replay'
      }
    ]
    return(
      <View style={{flex:1}}>
        <View style={{flex:2}}>
          <Card containerStyle={{borderRadius:15, height:'50%', justifyContent: 'center'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Avatar size="large" rounded title="KA" />
              </View>
              <View style={{flex: 2, height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Text h4>Olá Kaique</Text>
                <Text>kaiquealbuqueque@hotmail.com</Text>
              </View>
            </View>
          </Card>  
        </View>
        <View style={{flex:2}}>
        {
          list.map((item, i) => (
            <ListItem
              key={i}
              title={item.title}
              leftIcon={{ name: item.icon }}
              bottomDivider
            />
          ))
        }   
        </View>  
      </View>
    );
  }
}

console.disableYellowBox = true;

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

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