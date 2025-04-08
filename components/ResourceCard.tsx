import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ExternalLink } from 'lucide-react-native';
import Colors from '@/app/constants/colors';
import { LearningResource } from '@/types';

interface ResourceCardProps {
  resource: LearningResource;
  onPress: (resource: LearningResource) => void;
}

export default function ResourceCard({ resource, onPress }: ResourceCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(resource)}
      activeOpacity={0.8}
    >
      {resource.image_url ? (
        <Image 
          source={{ uri: resource.image_url }} 
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>{resource.title.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>{resource.category}</Text>
          <ExternalLink size={16} color={Colors.text.secondary} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{resource.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {resource.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card.light,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 140,
  },
  imagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.secondary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: Colors.secondary.light,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});