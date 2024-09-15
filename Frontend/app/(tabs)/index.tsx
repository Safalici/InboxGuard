import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Define the type for a User object
interface User {
  id: number;
  name: string;
  email: string;
}

export default function HomeScreen() {
  // Define state to hold the API data and loading status
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);  // Set the data in state
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);  // Set loading to false when the request is complete
    }
  };

  // useEffect hook to call the API when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Render loading spinner while data is being fetched
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
  headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
  headerImage={
    <Image
      source={require('@/assets/images/partial-react-logo.png')}
      style={styles.reactLogo}
    />
  }
>
  <ThemedView style={styles.titleContainer}>
    <ThemedText type="title">Welcome Safa Abem!</ThemedText>
    <HelloWave />
  </ThemedView>
  
  <Text style={styles.title}>User List</Text>
  <FlatList
    data={users}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.name}>{item.email}</Text>
      </View>
    )}
  />
</ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
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
  },
});
