import { createStackNavigator, createAppContainer } from "react-navigation";

import LoginEmailScreen from './scr/pages/Login/LoginEmail.js';
import LoginSignatureScreen from './scr/pages/Login/LoginSignature.js';
import LoginPasswordScreen from './scr/pages/Login/LoginPassword.js';

import HomeScreen from './scr/pages/Home/HomeScreen.js';
import NovoChamado from './scr/pages/Chamados/NovoChamado.js';
import QrCode from './scr/pages/Chamados/QrCode.js';
import AgendaPedidos from './scr/pages/Pedidos/AgendaPedidos.js';

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