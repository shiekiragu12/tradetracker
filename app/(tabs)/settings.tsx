import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  User, 
  Bell, 
  Moon, 
  HelpCircle, 
  Shield, 
  LogOut,
  ChevronRight
} from 'lucide-react-native';
import Colors from '../constants/colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAuthStore } from '@/app/store/authStore';

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Sign Out", 
          onPress: () => {
            signOut();
            // In a real app, this would navigate to the login screen
          },
          style: "destructive"
        }
      ]
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update the app theme
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    // In a real app, this would update notification settings
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Customize your trading experience
          </Text>
        </View>

        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {user?.name?.charAt(0) || 'T'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name || 'Trader'}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || 'trader@example.com'}
              </Text>
            </View>
          </View>
          <Button
            title="Edit Profile"
            onPress={() => router.push('/settings/profile')}
            variant="outline"
            style={styles.editProfileButton}
          />
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <Card variant="outlined" style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Moon size={20} color={Colors.primary.light} />
                </View>
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#e5e7eb', true: Colors.primary.light }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Bell size={20} color={Colors.primary.light} />
                </View>
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#e5e7eb', true: Colors.primary.light }}
                thumbColor="#fff"
              />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Card variant="outlined" style={styles.settingsCard}>
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={() => router.push('/settings/help')}
            >
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <HelpCircle size={20} color={Colors.primary.light} />
                </View>
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={() => router.push('/settings/privacy')}
            >
              <View style={styles.settingInfo}>
                <View style={styles.settingIconContainer}>
                  <Shield size={20} color={Colors.primary.light} />
                </View>
                <Text style={styles.settingText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            leftIcon={<LogOut size={18} color={Colors.error} />}
            style={styles.signOutButton}
            textStyle={{ color: Colors.error }}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.light,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  editProfileButton: {
    borderColor: Colors.primary.light,
  },
  section: {
    marginBottom: 24,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingsCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.card.light,
    elevation: 1,

  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: Colors.text.light,
  },
  signOutButton: {
    marginHorizontal: 16,
    borderColor: Colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  version: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});