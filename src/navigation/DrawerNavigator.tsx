import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, StatusBar } from 'react-native';
import HomeScreen from '../features/home/screens/HomeScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import SurveysScreen from '../features/surveys/screens/SurveysScreen';
import { DynamicDrawerMenu } from '../components/DrawerMenu/DynamicDrawerMenu';
import Icon from 'react-native-vector-icons/Feather';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DynamicDrawerMenu {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#4A90E2',
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 90 : (StatusBar.currentHeight ?? 0) + 60,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: 'transparent',
          width: '85%',
        },
        headerLeftContainerStyle: {
          paddingLeft: 15,
        },
        headerRightContainerStyle: {
          paddingRight: 15,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profil',
          drawerIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Surveys" 
        component={SurveysScreen}
        options={{
          title: 'Anketler',
          drawerIcon: ({ color, size }) => (
            <Icon name="clipboard" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}; 