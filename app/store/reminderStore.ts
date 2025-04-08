import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '@/app/types';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

// Conditionally import expo-notifications
let Notifications: any = null;
if (Platform.OS !== 'web') {
  // This will only be executed on native platforms
  try {
    Notifications = require('expo-notifications');
  } catch (error) {
    console.warn('expo-notifications is not available', error);
  }
}

// Configure notifications for native platforms
if (Platform.OS !== 'web' && Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

interface ReminderState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  requestPermissions: () => Promise<void>;
  scheduleReminders: () => Promise<void>;
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [
        {
          id: '1',
          title: 'New York Session',
          message: "New York trading session is starting soon. Don't miss out!",
          time: '13:30', // 8:30 AM EST
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          enabled: true,
        },
        {
          id: '2',
          title: 'London Session',
          message: 'London trading session is starting soon. Get ready to trade!',
          time: '08:00', // 3:00 AM EST
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          enabled: true,
        },
        {
          id: '3',
          title: 'Daily Trading Record',
          message: "You haven't recorded any trades today. Don't forget to log your activity!",
          time: '20:00', // 3:00 PM EST
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          enabled: true,
        },
      ],
      isLoading: false,
      error: null,
      hasPermission: false,

      requestPermissions: async () => {
        try {
          if (Platform.OS !== 'web' && Notifications) {
            const { status } = await Notifications.requestPermissionsAsync();
            set({ hasPermission: status === 'granted' });
            
            if (status !== 'granted') {
              throw new Error('Permission to receive notifications was denied');
            }
          }
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      addReminder: async (reminder: Omit<Reminder, 'id'>) => {
        try {
          set({ isLoading: true, error: null });
          
          const newReminder: Reminder = {
            ...reminder,
            id: uuidv4(),
          };
          
          set(state => ({ 
            reminders: [...state.reminders, newReminder],
            isLoading: false 
          }));
          
          // Schedule the new reminder
          if (Platform.OS !== 'web' && newReminder.enabled) {
            await get().scheduleReminders();
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateReminder: async (id: string, updates: Partial<Reminder>) => {
        try {
          set({ isLoading: true, error: null });
          
          set(state => ({
            reminders: state.reminders.map(reminder => 
              reminder.id === id ? { ...reminder, ...updates } : reminder
            ),
            isLoading: false
          }));
          
          // Reschedule reminders
          if (Platform.OS !== 'web') {
            await get().scheduleReminders();
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      deleteReminder: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          
          set(state => ({
            reminders: state.reminders.filter(reminder => reminder.id !== id),
            isLoading: false
          }));
          
          // Reschedule reminders
          if (Platform.OS !== 'web') {
            await get().scheduleReminders();
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      toggleReminder: async (id: string) => {
        try {
          const { reminders } = get();
          const reminder = reminders.find(r => r.id === id);
          
          if (!reminder) {
            throw new Error('Reminder not found');
          }
          
          await get().updateReminder(id, { enabled: !reminder.enabled });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      scheduleReminders: async () => {
        try {
          if (Platform.OS === 'web' || !Notifications) return;
          
          // Cancel all existing notifications
          await Notifications.cancelAllScheduledNotificationsAsync();
          
          const { reminders, hasPermission } = get();
          
          if (!hasPermission) {
            await get().requestPermissions();
          }
          
          // Schedule each enabled reminder
          for (const reminder of reminders) {
            if (!reminder.enabled) continue;
            
            const [hours, minutes] = reminder.time.split(':').map(Number);
            
            // Schedule for each selected day of the week
            for (const day of reminder.days) {
              const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);
              
              if (dayIndex === -1) continue;
              
              // Create trigger for this day and time
              const trigger = {
                weekday: dayIndex + 1,
                hour: hours,
                minute: minutes,
                repeats: true,
              };
              
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: reminder.title,
                  body: reminder.message,
                  sound: true,
                  priority: Notifications.AndroidNotificationPriority?.HIGH || 'high',
                },
                trigger,
              });
            }
          }
        } catch (error: any) {
          set({ error: error.message });
        }
      },
    }),
    {
      name: 'reminder-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);