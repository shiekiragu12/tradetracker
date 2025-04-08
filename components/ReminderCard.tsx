import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Clock, ChevronRight } from 'lucide-react-native';
import Colors from '@/app/constants/colors';
import { Reminder } from '@/app/types';

interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onPress: (reminder: Reminder) => void;
}

export default function ReminderItem({ reminder, onToggle, onPress }: ReminderItemProps) {
  const daysString = reminder.days.length === 7 
    ? 'Every day' 
    : reminder.days.length === 5 && reminder.days.includes('Monday') && reminder.days.includes('Friday')
      ? 'Weekdays'
      : reminder.days.join(', ');

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(reminder)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Clock size={20} color={Colors.primary.light} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{reminder.title}</Text>
        <Text style={styles.time}>{reminder.time}</Text>
        <Text style={styles.days}>{daysString}</Text>
      </View>
      <View style={styles.actions}>
        <Switch
          value={reminder.enabled}
          onValueChange={() => onToggle(reminder.id)}
          trackColor={{ false: '#e5e7eb', true: Colors.primary.light }}
          thumbColor="#fff"
        />
        <ChevronRight size={20} color={Colors.text.secondary} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    color: Colors.primary.light,
    fontWeight: '500',
    marginBottom: 2,
  },
  days: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: 8,
  },
});