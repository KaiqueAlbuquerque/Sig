import { createStackNavigator, createAppContainer } from "react-navigation";

import Login from './scr/Login/Login';
import HomeScreen from './scr/Home/HomeScreen.js';
import SecondScreen from './scr/Second/SecondScreen.js';

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
    Second: SecondScreen
  },
  {
    initialRouteName: "Login"
  }
);

export default createAppContainer(RootStack);