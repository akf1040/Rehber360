import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AuthStack from './AuthStack';
import { SimpleDrawer } from './SimpleDrawer';

export const Router = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <SimpleDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}; 