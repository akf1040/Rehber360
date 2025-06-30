import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelectScreen from '@/features/auth/screens/RoleSelectScreen';
import TeacherLoginScreen from '@/features/auth/screens/TeacherLoginScreen';
import TeacherRegisterScreen from '@/features/auth/screens/TeacherRegisterScreen';
import StudentLoginScreen from '@/features/auth/screens/StudentLoginScreen';
import ParentLoginScreen from '@/features/auth/screens/ParentLoginScreen';
import HomeScreen from '@/features/home/screens/HomeScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import EditProfileScreen from '@/features/profile/screens/EditProfileScreen';
import ChangePasswordScreen from '@/features/profile/screens/ChangePasswordScreen';

export type RootStackParamList = {
  RoleSelect: undefined;
  TeacherLogin: undefined;
  TeacherRegister: undefined;
  StudentLogin: undefined;
  ParentLogin: undefined;
  Home: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen} />
      <Stack.Screen name="TeacherRegister" component={TeacherRegisterScreen} />
      <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
      <Stack.Screen name="ParentLogin" component={ParentLoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack; 