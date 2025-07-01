import { getFirestore, collection, doc, getDoc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { MenuItem } from '../store/menuSlice';

class MenuService {
  private db = getFirestore();

  // Kullanıcı rolüne göre menü öğelerini getir
  async getMenuItems(userRole: string): Promise<MenuItem[]> {
    try {
      console.log('🔍 Menü yükleniyor... Role:', userRole);
      
      const menuDoc = await getDoc(doc(this.db, 'menu_items', userRole));

      console.log('📄 Firestore dökümanı:', menuDoc.exists() ? 'Bulundu' : 'Bulunamadı');

      if (menuDoc.exists()) {
        const data = menuDoc.data();
        const items = data?.items || [];
        console.log('✅ Firestore menü verileri:', items.length, 'adet öğe bulundu');
        console.log('📋 Menü öğeleri:', items.map((item: MenuItem) => item.label).join(', '));
        return items;
      }

      console.log('⚠️ Firestore verisi yok, varsayılan menü kullanılıyor');
      return this.getDefaultMenuItems(userRole);
    } catch (error) {
      console.error('❌ Menü yükleme hatası:', error);
      console.log('⚠️ Hata nedeniyle varsayılan menü kullanılıyor');
      return this.getDefaultMenuItems(userRole);
    }
  }

  // Varsayılan menü öğeleri
  private getDefaultMenuItems(userRole: string): MenuItem[] {
    console.log('📋 Varsayılan menü yükleniyor... Role:', userRole);
    
    if (userRole === 'teacher') {
      const items = [
        { label: 'Ana Sayfa', route: 'Home', icon: 'home', badge: 0 },
        { label: 'Anketler', route: 'Surveys', icon: 'clipboard', badge: 3 },
        { label: 'Öğrenci Sonuçları', route: 'StudentResults', icon: 'bar-chart', badge: 0 },
        { label: 'Sınıf Listesi', route: 'ClassList', icon: 'users', badge: 25 },
        { label: 'Raporlar', route: 'Reports', icon: 'file-text', badge: 0 },
        { label: 'Veli Görüşmeleri', route: 'ParentMeetings', icon: 'calendar', badge: 2 },
        { label: 'Mesajlar', route: 'Messages', icon: 'message-circle', badge: 5 },
        { label: 'Ayarlar', route: 'Settings', icon: 'settings', badge: 0 },
        { label: 'Profilim', route: 'Profile', icon: 'user', badge: 0 }
      ];
      console.log('📋 Varsayılan öğretmen menüsü:', items.length, 'adet öğe');
      return items;
    }

    const defaultItems = [
      { label: 'Ana Sayfa', route: 'Home', icon: 'home', badge: 0 },
      { label: 'Profilim', route: 'Profile', icon: 'user', badge: 0 }
    ];
    console.log('📋 Varsayılan temel menü:', defaultItems.length, 'adet öğe');
    return defaultItems;
  }

  // Firestore'a menü öğelerini kaydet
  async saveMenuItems(userRole: string, items: MenuItem[]): Promise<void> {
    try {
      console.log('💾 Menü kaydediliyor... Role:', userRole);
      console.log('📋 Kaydedilecek öğeler:', items.map(item => item.label).join(', '));
      
      await setDoc(doc(this.db, 'menu_items', userRole), { 
        items,
        lastUpdated: serverTimestamp()
      });

      console.log('✅ Menü başarıyla kaydedildi');
    } catch (error) {
      console.error('❌ Menü kaydetme hatası:', error);
      throw error;
    }
  }

  // Firestore'a varsayılan menüleri yükle
  async initializeDefaultMenus(): Promise<void> {
    try {
      console.log('🚀 Varsayılan menüler yükleniyor...');
      
      // Teacher menüsü
      const teacherItems = this.getDefaultMenuItems('teacher');
      await this.saveMenuItems('teacher', teacherItems);

      console.log('✅ Varsayılan menüler başarıyla yüklendi');
    } catch (error) {
      console.error('❌ Varsayılan menü yükleme hatası:', error);
      throw error;
    }
  }

  // Menü öğesine badge ekle/güncelle
  async updateMenuBadge(userRole: string, route: string, badge: number): Promise<void> {
    try {
      console.log('🔄 Badge güncelleniyor... Role:', userRole, 'Route:', route, 'Badge:', badge);
      
      const menuDoc = await getDoc(doc(this.db, 'menu_items', userRole));

      if (menuDoc.exists()) {
        const data = menuDoc.data();
        const items: MenuItem[] = data?.items || [];
        
        const itemIndex = items.findIndex(item => item.route === route);
        if (itemIndex !== -1) {
          items[itemIndex].badge = badge;
          await this.saveMenuItems(userRole, items);
          console.log('✅ Badge başarıyla güncellendi');
        } else {
          console.log('⚠️ Belirtilen route için menü öğesi bulunamadı:', route);
        }
      } else {
        console.log('⚠️ Menü dökümanı bulunamadı. Role:', userRole);
      }
    } catch (error) {
      console.error('❌ Badge güncellenirken hata:', error);
      throw error;
    }
  }
}

export const menuService = new MenuService(); 