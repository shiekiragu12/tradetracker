import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Search, BookOpen } from 'lucide-react-native';
import Colors from '../constants/colors';
import Input from '@/components/Input';
import ResourceCard from '../../components/ResourceCard';
import EmptyState from '@/components/EmptyState';
import { useLearningStore } from '@/app/store/learningStore';
import { mockResources } from '../mocks/resource';
import { LearningResource } from '@/app/types';

export default function LearnScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    resources, 
    categories, 
    fetchResources 
  } = useLearningStore();

  // Initialize with mock data if empty
  useEffect(() => {
    if (resources.length === 0) {
      useLearningStore.setState({ resources: mockResources });
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleResourcePress = async (resource: LearningResource) => {
    try {
      await WebBrowser.openBrowserAsync(resource.url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  // Filter resources based on category and search query
  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Resources</Text>
        <Text style={styles.subtitle}>
          Improve your trading skills with these curated resources
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={Colors.text.secondary} />}
          containerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            activeCategory === 'All' && styles.activeCategoryButton
          ]}
          onPress={() => setActiveCategory('All')}
        >
          <Text style={[
            styles.categoryText,
            activeCategory === 'All' && styles.activeCategoryText
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              activeCategory === category && styles.activeCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredResources.length > 0 ? (
        <FlatList
          data={filteredResources}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ResourceCard resource={item} onPress={handleResourcePress} />
          )}
          contentContainerStyle={styles.resourcesList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyState
          title="No resources found"
          description={searchQuery 
            ? "Try adjusting your search query" 
            : "No resources available for this category yet"
          }
          icon={<BookOpen size={32} color={Colors.primary.light} />}
          actionLabel={searchQuery ? "Clear Search" : "View All Resources"}
          onAction={() => {
            if (searchQuery) {
              setSearchQuery('');
            } else {
              setActiveCategory('All');
            }
          }}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderWidth: 0,
  },
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f3f4f6',
  },
  activeCategoryButton: {
    backgroundColor: Colors.primary.light,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeCategoryText: {
    color: '#fff',
  },
  resourcesList: {
    padding: 16,
  },
});