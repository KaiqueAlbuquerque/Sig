import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import { Provider } from 'react-redux';
import store from './scr/store/Store.js';

import LoginEmailScreen from './scr/pages/Login/LoginEmailScreen.js';
import LoginSignatureScreen from './scr/pages/Login/LoginSignatureScreen.js';
import LoginPasswordScreen from './scr/pages/Login/LoginPasswordScreen.js';

import HomeScreen from './scr/pages/Home/HomeScreen.js';
import DemandsDetailScreen from './scr/pages/Demands/DemandsDetailScreen.js';
import QrCodeScreen from './scr/pages/Demands/QrCodeScreen.js';
import AgendaPedidos from './scr/pages/Pedidos/AgendaPedidos.js';
import CrudKpi from './scr/pages/Home/CrudKPI.js';

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
    DemandsDetail: {
      screen: DemandsDetailScreen,
      navigationOptions: () => ({
        header: null
      }),
    },
    QrCode: {
      screen: QrCodeScreen,
      navigationOptions: () => ({
        header: null
      }),
    },
    AgendaPedidos: {
      screen: AgendaPedidos,
      navigationOptions: () => ({
        header: null
      })
    },
    CrudKpi: {
      screen: CrudKpi,
      navigationOptions: () => ({
        header: null
      })
    }
  },
  {
    initialRouteName: "LoginEmail"
  }
);

const AppContainer = createAppContainer(RootStack);

function App(){
  return (
    <Provider store={store}>
      <AppContainer/>
    </Provider>
  );
}

export default App;