import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  Image
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store/store';
import { signOut } from '../../store/authSlice';
import { menuService } from '../../services/menuService';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.85;

export const DynamicDrawerMenu = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const userRole = useSelector((state: RootState) => state.auth.user?.role || 'teacher');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      console.log('🔄 Menü yükleniyor...');
      const items = await menuService.getMenuItems(userRole);
      console.log('📋 Yüklenen menü öğeleri:', items);
      setMenuItems(items);
    } catch (error) {
      console.error('❌ Menü yükleme hatası:', error);
      Alert.alert('Hata', 'Menü yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPress = (route: string) => {
    if (route === 'Logout') {
      handleLogout();
    } else {
      navigation.navigate(route as never);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Uygulamadan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => dispatch(signOut())
        }
      ]
    );
  };

  const renderMenuItem = (item: MenuItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.menuItem,
        { backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff' }
      ]}
      onPress={() => handleMenuPress(item.route)}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }]}>
            <Icon name={item.icon} size={22} color="#4A90E2" />
          </View>
          <Text style={styles.menuItemText}>{item.label}</Text>
        </View>
        {item.badge && item.badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.badge > 99 ? '99+' : item.badge}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Kullanıcı Profil Bölümü */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Icon name="user" size={40} color="#fff" />
        </View>
        <Text style={styles.userName}>
          {user?.displayName || 'Öğretmen'}
        </Text>
        <Text style={styles.userRole}>
          {userRole === 'teacher' ? 'Öğretmen' : 'Kullanıcı'}
        </Text>
        <Text style={styles.userEmail}>
          {user?.email || 'email@example.com'}
        </Text>
      </View>

      {/* Menü Bölümü */}
      <ScrollView 
        style={styles.menuSection} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Menü yükleniyor...</Text>
          </View>
        ) : (
          <>
            <View style={styles.menuHeader}>
              <Icon name="menu" size={20} color="#495057" />
              <Text style={styles.menuHeaderText}>Menü</Text>
            </View>
            
            {menuItems.map((item, index) => renderMenuItem(item, index))}
            
            {/* Çıkış Butonu */}
            <View style={styles.separator} />
            <TouchableOpacity
              style={[styles.menuItem, styles.logoutItem]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, styles.logoutIcon]}>
                    <Icon name="log-out" size={22} color="#ff4757" />
                  </View>
                  <Text style={[styles.menuItemText, styles.logoutText]}>
                    Çıkış Yap
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DRAWER_WIDTH,
    backgroundColor: '#f8f9fa',
  },
  profileSection: {
    backgroundColor: '#4A90E2',
    padding: 20,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ?? 20) + 20,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  menuSection: {
    flex: 1,
  },
  menuContent: {
    paddingBottom: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 5,
  },
  menuHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginLeft: 10,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    backgroundColor: '#ff4757',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 15,
    marginHorizontal: 20,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  logoutIcon: {
    backgroundColor: '#fff0f0',
  },
  logoutText: {
    color: '#ff4757',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6c757d',
  },
}); 