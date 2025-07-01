import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Router } from './navigation/Router';
import { store } from './store/store';
import { initializeApp } from '@react-native-firebase/app';
import { initializeFirestoreMenus } from './services/initializeFirestore';
import { menuService } from './services/menuService';

const firebaseConfig = {
  apiKey: "AIzaSyDDldgoQF-WXgXTjdwDfVJxyTpjxlBjoTA",
  projectId: "rehber360",
  appId: "1:879258049521:android:2f8932934b4f6daf4b8250",
};

// Firebase'i başlat
initializeApp(firebaseConfig);

const App = () => {
  useEffect(() => {
    // Uygulama başlatılırken Firestore'a varsayılan menüleri yükle
    const initializeMenus = async () => {
      try {
        const result = await initializeFirestoreMenus();
        if (result.success) {
          console.log('✅ Menüler başarıyla yüklendi');
        }
      } catch (error) {
        console.error('Menüler yüklenirken hata:', error);
      }
    };

    initializeMenus();
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await menuService.initializeDefaultMenus();
        console.log('✅ Menüler başarıyla yüklendi');
      } catch (error) {
        console.error('❌ Menü yükleme hatası:', error);
      }
    };
    
    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App; 