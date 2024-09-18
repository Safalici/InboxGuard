import { View, Image, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect } from 'react';
import { fetchUsers, User } from '@/api/userApi';
import { useColorScheme } from 'react-native';

export default function HomeScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Color scheme to decide between light and dark mode
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC';  // Background color
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';        // Text color
  const itemBackgroundColor = colorScheme === 'dark' ? '#333' : '#EEE';    // FlatList item background
  const flatListContainerBackground = colorScheme === 'dark' ? '#222' : '#F0F0F0';  // FlatList container background

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container,{ backgroundColor }]}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}  // Pass light and dark colors as an object
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Welcome Safa Abem!</ThemedText>
          <HelloWave />
        </ThemedView>
        <Text style={[styles.title, { color: textColor }]}>safacs@hotmail.com</Text>  
       
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: itemBackgroundColor }]}> 
              <Text style={[styles.name, { color: textColor }]}>{item.name}</Text>  
              <Text style={[styles.name, { color: textColor }]}>{item.email}</Text>  

            </View>
          )}
          contentContainerStyle={{ backgroundColor: flatListContainerBackground }} 

        />
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1D1D',
  },
  flatListContainer: {
    backgroundColor: '#000',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    color: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#000',
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D1D1D',
  },
});