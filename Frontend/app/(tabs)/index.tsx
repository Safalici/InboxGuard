import { View, Image, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity, ScrollView } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect } from 'react';
import { fetchUsers, User } from '@/api/userApi';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // For icons
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter(); 
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC';  
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';       
  const itemBackgroundColor = colorScheme === 'dark' ? '#333' : '#EEE';   
  const flatListContainerBackground = colorScheme === 'dark' ? '#222' : '#F0F0F0'; 
  
  // Email list
  const [emails, setEmails] = useState([
    'safacs@hotmail.com',
    'malici20@hotmail.com',
    'anotheremail@example.com',
  ]);  
  
  // Selected email and fetched emails
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);  
  const [fetchedEmails, setFetchedEmails] = useState([]);  

  // Set the first email as the default selected email on component mount
  useEffect(() => {
    if (emails.length > 0) {
      setSelectedEmail(emails[0]);
      fetchEmails(emails[0]);  // Fetch emails for the first email
    }
  }, [emails]);

  // Function to fetch emails based on the selected email
  const fetchEmails = async (email: string) => {
    console.log(`Fetching emails for ${email}`);
  };

  // Handle email selection
  const handleEmailSelect = (email: string) => {
    setSelectedEmail(email);
    fetchEmails(email);  // Fetch emails for the newly selected email
  };

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
    <View style={[styles.container, { backgroundColor }]}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}  
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

        {/* Email Box with Plus Icon */}
        <View style={styles.emailContainer}>
          <ScrollView horizontal={true} style={styles.emailScroll} contentContainerStyle={styles.emailScrollContent}>
            {emails.map((email, index) => (
              <View key={index} style={[
                styles.emailBox, 
                selectedEmail === email && styles.selectedEmailBox  // Apply selected styles
              ]}>
                <TouchableOpacity onPress={() => handleEmailSelect(email)}>
                  <Text style={[styles.emailText, selectedEmail === email && styles.selectedEmailText]}>
                    {email}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { console.log(`Delete ${email} pressed`); }}>
                  <Ionicons name="close-circle-outline" size={20} color={selectedEmail === email ? '#fff' : '#000'} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          {/* Plus Icon next to email boxes */}
          <TouchableOpacity onPress={() => { console.log('Add new email pressed'); }}>
            <Ionicons name="add-circle-outline" size={30} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Display fetched emails for the selected email */}
        <View style={styles.emailDetails}>
          <Text style={styles.detailsTitle}>Emails received by {selectedEmail}:</Text>
          
        </View>

        {/* User List with Block Button (Only emails now) */}
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: itemBackgroundColor }]}> 
              <TouchableOpacity onPress={() => router.push({ pathname: '/emailDetails', params: { email: item.email, sentTo: selectedEmail } })}>
                <Text style={[styles.email, { color: textColor }]}>{item.email}</Text>
              </TouchableOpacity>

              {/* Block Button */}
              <TouchableOpacity style={styles.blockButton} onPress={() => { console.log(`Block ${item.email} pressed`); }}>
                <Text style={styles.blockButtonText}>Block</Text>
              </TouchableOpacity>
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
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  emailScroll: {
    flexGrow: 0,
    maxHeight: 50,  
  },
  emailScrollContent: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  emailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 10,  
  },
  selectedEmailBox: {
    backgroundColor: '#007AFF',  // Highlight selected email
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#000',
  },
  selectedEmailText: {
    color: '#fff',  // Change text color for selected email
  },
  emailDetails: {
    marginTop: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emailDetailText: {
    fontSize: 16,
    marginTop: 10,
  },
  email: {
    fontSize: 16,  
    fontWeight: 'bold', 
    marginBottom: 5, 
  },

  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  blockButton: {
    marginTop: 10,
    backgroundColor: '#ff4444',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  blockButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D1D1D',
  },
});
