import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Header() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <View style={styles.logoCircle} />
        </View>
        <Text style={styles.logoText}>SyncOdonto</Text>
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color="#495057" />
          <View style={styles.badge} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>MARIA SOUSA</Text>
            <Text style={styles.userEmail}>marialarissaads7@gmail.com</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#17a2b8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginLeft: 12,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 16,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#dc3545',
    borderRadius: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#17a2b8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  userDetails: {
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212529',
  },
  userEmail: {
    fontSize: 10,
    color: '#6c757d',
  },
});
