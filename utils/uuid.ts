import { Platform } from 'react-native';

// Simple implementation of a UUID generator that works on all platforms
export function generateId(): string {
  // For native platforms, use the regular uuid package
  if (Platform.OS !== 'web') {
    try {
      // Dynamic import to avoid issues on web
      const { v4: uuidv4 } = require('uuid');
      return uuidv4();
    } catch (error) {
      console.warn('UUID generation failed, using fallback', error);
      // Fall back to