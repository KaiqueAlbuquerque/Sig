import { createStackNavigator, createAppContainer } from "react-navigation";

import LoginEmailScreen from './scr/Login/LoginEmail.js';
import LoginSignatureScreen from './scr/Login/LoginSignature.js';
import LoginPasswordScreen from './scr/Login/LoginPassword.js';

import HomeScreen from './scr/Home/HomeScreen.js';
import NovoChamado from './scr/Chamados/NovoChamado.js';
import QrCode from './scr/Chamados/QrCode.js';
import AgendaPedidos from './scr/Pedidos/AgendaPedidos.js';

const RootStack = createStackNavigator(
  {
    LoginEmail: {
      screen: LoginEmailScreen,
      navigationOptions: () => ({
        header: null
      }),
    },
    LoginSignature: {
      screen: LoginSignatureScreen,
      navigationOptions: () => ({
        header: null
      }),
    },
    LoginPassword: {
      screen: LoginPasswordScreen,
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
    initialRouteName: "LoginEmail"
  }
);

export default createAppContainer(RootStack);