import React from 'react';
import { Provider } from 'react-redux';
import Router from '@/navigation/Router';
import { store } from '@/store/store';
import { initializeApp, getApp, getApps } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDDldgoQF-WXgXTjdwDfVJxyTpjxlBjoTA",
  projectId: "rehber360",
  appId: "1:879258049521:android:2f8932934b4f6daf4b8250",
};

// Firebase'i başlat
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const app = getApp();

const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App; 