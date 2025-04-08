import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Bell } from 'lucide-react-native';
import Colors from '../constants/colors';
import Button from '@/components/Button';
import ReminderItem from '../../components/ReminderCard';
import EmptyState from '@/components/EmptyState';
import { useReminderStore } from '@/app/store/reminderStore';
import { Reminder } from '@/app/types';

export default function RemindersScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    reminders, 
    toggleReminder, 
    requestPermissions,
    scheduleReminders,
    hasPermission
  } = useReminderStore();

  // Request notification permissions on first load
  useEffect(() => {
    if (Platform.OS !== 'web' && !hasPermission) {
      requestPermissions();
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    if (Platform.OS !== 'web') {
      await scheduleReminders();
    }
    setRefreshing(false);
  };

  const handleAddReminder = () => {
    router.push('/reminders/new-reminder');
  };

  const handleReminderPress = (reminder: Reminder) => {
    router.push({
      pathname: '/reminders/edit-reminder',
      params: { id: reminder.id }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reminders</Text>
          <Text style={styles.subtitle}>
            Never miss an important trading session
          </Text>
        </View>
        <Button
          title="Add New"
          onPress={handleAddReminder}
          variant="primary"
          size="small"
          leftIcon={<Plus size={16} color="#fff" />}
        />
      </View>

      {Platform.OS === 'web' && (
        <View style={styles.webNotice}>
          <Bell size={16} color={Colors.warning} />
          <Text style={styles.webNoticeText}>
            Notifications are not available on web. Please use the mobile app for full functionality.
          </Text>
        </View>
      )}

      {reminders.length > 0 ? (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ReminderItem 
              reminder={item} 
              onToggle={toggleReminder}
              onPress={handleReminderPress}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.remindersList}
        />
      ) : (
        <EmptyState
          title="No reminders set"
          description="Create reminders for trading sessions and important events."
          icon={<Bell size={32} color={Colors.primary.light} />}
          actionLabel="Add First Reminder"
          onAction={handleAddReminder}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  webNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.warning}20`,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  webNoticeText: {
    fontSize: 12,
    color: Colors.text.light,
    marginLeft: 8,
    flex: 1,
  },
  remindersList: {
    paddingBottom: 20,
  },
});