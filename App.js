import 'react-native-gesture-handler';
import * as React from 'react';
import {Image, StatusBar, YellowBox} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import Home from "./src/screens/Home";
import {Provider} from 'mobx-react';
import store from './src/store'
import Search from "./src/screens/Search";
import Colors from "./src/assets/Colors";
import SplashScreen from 'react-native-splash-screen';
import {useEffect} from "react";

const Stack = createStackNavigator();
YellowBox.ignoreWarnings(['']);

export default function App() {

    useEffect(() => {
        SplashScreen.hide();
    },[])

        return (
      <Provider {...store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false,}}>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen
                name="Search"
                component={Search}
                options={({navigation, route}) => ({
                    headerShown:true,
                    headerTitle: '',
                    headerStyle: {
                        backgroundColor: Colors.App,
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: Colors.White,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>

  );
}
