import { getFirestore, collection, doc, getDoc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';

export const initializeFirestoreMenus = async () => {
  try {
    const db = getFirestore();

    // Önce mevcut menüleri kontrol et
    const teacherMenuDoc = await getDoc(doc(db, 'menu_items', 'teacher'));
    const studentMenuDoc = await getDoc(doc(db, 'menu_items', 'student'));
    const parentMenuDoc = await getDoc(doc(db, 'menu_items', 'parent'));

    // Eğer tüm menüler zaten varsa, yükleme yapma
    if (teacherMenuDoc.exists() && studentMenuDoc.exists() && parentMenuDoc.exists()) {
      console.log('✅ Menüler zaten mevcut, yükleme yapılmadı');
      return {
        success: true,
        message: 'Menüler zaten mevcut'
      };
    }

    // Öğretmen menüsü
    const teacherMenuItems = [
      {
        label: 'Ana Sayfa',
        route: 'Home',
        icon: 'home',
        badge: 0
      },
      {
        label: 'Anketler',
        route: 'Surveys',
        icon: 'clipboard',
        badge: 3
      },
      {
        label: 'Öğrenci Sonuçları',
        route: 'StudentResults',
        icon: 'bar-chart',
        badge: 0
      },
      {
        label: 'Sınıf Listesi',
        route: 'ClassList',
        icon: 'users',
        badge: 25
      },
      {
        label: 'Raporlar',
        route: 'Reports',
        icon: 'file-text',
        badge: 0
      },
      {
        label: 'Veli Görüşmeleri',
        route: 'ParentMeetings',
        icon: 'calendar',
        badge: 2
      },
      {
        label: 'Mesajlar',
        route: 'Messages',
        icon: 'message-circle',
        badge: 5
      },
      {
        label: 'Ayarlar',
        route: 'Settings',
        icon: 'settings',
        badge: 0
      },
      {
        label: 'Profilim',
        route: 'Profile',
        icon: 'user',
        badge: 0
      }
    ];

    // Öğrenci menüsü (gelecekte kullanım için)
    const studentMenuItems = [
      {
        label: 'Ana Sayfa',
        route: 'Home',
        icon: 'home',
        badge: 0
      },
      {
        label: 'Anketlerim',
        route: 'MySurveys',
        icon: 'edit',
        badge: 2
      },
      {
        label: 'Sonuçlarım',
        route: 'MyResults',
        icon: 'award',
        badge: 0
      },
      {
        label: 'Rehberlik',
        route: 'Guidance',
        icon: 'compass',
        badge: 0
      },
      {
        label: 'Profilim',
        route: 'Profile',
        icon: 'user',
        badge: 0
      }
    ];

    // Veli menüsü (gelecekte kullanım için)
    const parentMenuItems = [
      {
        label: 'Ana Sayfa',
        route: 'Home',
        icon: 'home',
        badge: 0
      },
      {
        label: 'Çocuklarım',
        route: 'Children',
        icon: 'heart',
        badge: 0
      },
      {
        label: 'Raporlar',
        route: 'ChildReports',
        icon: 'file-text',
        badge: 1
      },
      {
        label: 'Görüşmeler',
        route: 'Meetings',
        icon: 'calendar',
        badge: 0
      },
      {
        label: 'Profilim',
        route: 'Profile',
        icon: 'user',
        badge: 0
      }
    ];

    // Firestore'a kaydet (sadece eksik olanları)
    if (!teacherMenuDoc.exists()) {
      await setDoc(doc(db, 'menu_items', 'teacher'), {
        items: teacherMenuItems,
        lastUpdated: serverTimestamp()
      });
    }

    if (!studentMenuDoc.exists()) {
      await setDoc(doc(db, 'menu_items', 'student'), {
        items: studentMenuItems,
        lastUpdated: serverTimestamp()
      });
    }

    if (!parentMenuDoc.exists()) {
      await setDoc(doc(db, 'menu_items', 'parent'), {
        items: parentMenuItems,
        lastUpdated: serverTimestamp()
      });
    }

    console.log('✅ Eksik menü verileri başarıyla oluşturuldu!');
    
    return {
      success: true,
      message: 'Eksik menü verileri başarıyla oluşturuldu'
    };

  } catch (error) {
    console.error('❌ Firestore menü verileri oluşturulurken hata:', error);
    return {
      success: false,
      message: 'Menü verileri oluşturulamadı',
      error
    };
  }
}; 