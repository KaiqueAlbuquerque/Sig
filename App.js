import { createStackNavigator, createAppContainer } from "react-navigation";

import Login from './scr/Login/Login';
import HomeScreen from './scr/Home/HomeScreen.js';
import NovoChamado from './scr/Chamados/NovoChamado.js';
import QrCode from './scr/Chamados/QrCode.js';
import AgendaPedidos from './scr/Pedidos/AgendaPedidos.js';

const RootStack = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: () => ({
        header: null
      }),
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: () => ({
        header: null
      }),
    },
    NovoChamado: {
      screen: NovoChamado,
      navigationOptions: () => ({
        header: null
      }),
    },
    QrCode: {
      screen: QrCode,
      navigationOptions: () => ({
        header: null
      }),
    },
    AgendaPedidos: {
      screen: AgendaPedidos,
      navigationOptions: () => ({
        header: null
      })
    }
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(RootStack);