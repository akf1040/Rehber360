import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../features/home/screens/HomeScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';
import SurveysScreen from '../features/surveys/screens/SurveysScreen';
import { DynamicDrawerMenu } from '../components/DrawerMenu/DynamicDrawerMenu';

const Drawer = createDrawerNavigator();

export const SimpleDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DynamicDrawerMenu {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A90E2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          width: 280,
          backgroundColor: '#f8f9fa',
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          headerTitle: 'Rehber360 - Ana Sayfa',
        }}
      />
      <Drawer.Screen 
        name="Surveys" 
        component={SurveysScreen}
        options={{
          title: 'Anketler',
          headerTitle: 'Öğretmen Anketleri',
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profilim',
          headerTitle: 'Profil Bilgileri',
        }}
      />
    </Drawer.Navigator>
  );
}; 