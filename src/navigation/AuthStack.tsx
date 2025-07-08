import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelectScreen from '@/features/auth/screens/RoleSelectScreen';
import TeacherLoginScreen from '@/features/auth/screens/TeacherLoginScreen';
import TeacherRegisterScreen from '@/features/auth/screens/TeacherRegisterScreen';
import StudentLoginScreen from '@/features/auth/screens/StudentLoginScreen';
import StudentRegisterScreen from '@/features/auth/screens/StudentRegisterScreen';
import ParentLoginScreen from '@/features/auth/screens/ParentLoginScreen';
import HomeScreen from '@/features/home/screens/HomeScreen';
import StudentHomeScreen from '@/features/home/screens/StudentHomeScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import EditProfileScreen from '@/features/profile/screens/EditProfileScreen';
import ChangePasswordScreen from '@/features/profile/screens/ChangePasswordScreen';
import SurveysScreen from '@/features/surveys/screens/SurveysScreen';
import ExamAnxietySurveyScreen from '@/features/surveys/screens/ExamAnxietySurveyScreen';
import AssignSurveyScreen from '@/features/surveys/screens/AssignSurveyScreen';
import TeacherSurveyResultsScreen from '@/features/surveys/screens/TeacherSurveyResultsScreen';

export type RootStackParamList = {
  RoleSelect: undefined;
  TeacherLogin: undefined;
  TeacherRegister: undefined;
  StudentLogin: undefined;
  StudentRegister: undefined;
  ParentLogin: undefined;
  Home: undefined;
  StudentHome: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  Surveys: undefined;
  ExamAnxietySurvey: { assignedSurveyId?: string };
  AssignSurvey: undefined;
  TeacherSurveyResults: undefined;
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
      <Stack.Screen name="StudentRegister" component={StudentRegisterScreen} />
      <Stack.Screen name="ParentLogin" component={ParentLoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Surveys" component={SurveysScreen} />
      <Stack.Screen name="ExamAnxietySurvey" component={ExamAnxietySurveyScreen} />
      <Stack.Screen name="AssignSurvey" component={AssignSurveyScreen} />
      <Stack.Screen name="TeacherSurveyResults" component={TeacherSurveyResultsScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack; 