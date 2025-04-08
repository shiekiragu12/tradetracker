import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Clock } from 'lucide-react-native';
import Colors from '../constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useReminderStore } from '@/app/store/reminderStore';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function NewReminderScreen() {
  const router = useRouter();
  const { addReminder } = useReminderStore();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [time, setTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    message: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: '', message: '' };
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    if (!message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }
    
    if (selectedDays.length === 0) {
      // Show an alert or error message
      alert('Please select at least one day');
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const newReminder = {
        title,
        message,
        time,
        days: selectedDays,
        enabled: true,
      };
      
      await addReminder(newReminder);
      router.back();
    } catch (error) {
      console.error('Error adding reminder:', error);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: 'Add New Reminder',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text.light} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Input
            label="Title"
            placeholder="Enter reminder title"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />
          
          <Input
            label="Message"
            placeholder="Enter reminder message"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={styles.messageInput}
            error={errors.message}
          />
          
          <View style={styles.timeContainer}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.timeInputContainer}>
              <Clock size={20} color={Colors.text.secondary} style={styles.timeIcon} />
              <Input
                placeholder="HH:MM"
                value={time}
                onChangeText={setTime}
                keyboardType="numbers-and-punctuation"
                containerStyle={styles.timeInputWrapper}
                inputStyle={styles.timeInput}
              />
            </View>
            <Text style={styles.timeHint}>Use 24-hour format (e.g., 13:30 for 1:30 PM)</Text>
          </View>
          
          <View style={styles.daysContainer}>
            <Text style={styles.label}>Repeat on</Text>
            {daysOfWeek.map((day) => (
              <View key={day} style={styles.dayItem}>
                <Text style={styles.dayText}>{day}</Text>
                <Switch
                  value={selectedDays.includes(day)}
                  onValueChange={() => toggleDay(day)}
                  trackColor={{ false: '#e5e7eb', true: Colors.primary.light }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
          
          {Platform.OS === 'web' && (
            <View style={styles.webNotice}>
              <Text style={styles.webNoticeText}>
                Note: Notifications are not available on web. Please use the mobile app for full functionality.
              </Text>
            </View>
          )}
          
          <Button
            title="Save Reminder"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  messageInput: {
    height: 80,
    paddingTop: 12,
  },
  timeContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: Colors.text.light,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 8,
  },
  timeInputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  timeInput: {
    textAlign: 'center',
  },
  timeHint: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  daysContainer: {
    marginBottom: 24,
  },
  dayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dayText: {
    fontSize: 16,
    color: Colors.text.light,
  },
  webNotice: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  webNoticeText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  submitButton: {
    marginTop: 16,
  },
});