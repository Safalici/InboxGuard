import { View, Image, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // For icons
import { useRouter } from 'expo-router';
import EmailSetup from '@/app/EmailSetup'; // Import the EmailSetup component
import axios from 'axios';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // For user list
  const [isModalVisible, setIsModalVisible] = useState(false);  // Manage modal visibility
  const [emails, setEmails] = useState(['malici20@hotmail.com', 'anotheremail@example.com']);  // Default email list
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null); // Selected email for fetching
  const [emailSenders, setEmailSenders] = useState([]); // Email senders list for the selected email
  const colorScheme = useColorScheme();

  const backgroundColor = colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const itemBackgroundColor = colorScheme === 'dark' ? '#333' : '#EEE';

  // Fetch emails for the selected email account
  const fetchEmails = async (email: string) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/fetch-emails', { email });
      setEmailSenders(response.data.emails);  // Assuming API returns an array of email objects
    } catch (error) {
      console.error('Error fetching emails:', error);
      Alert.alert('Error', 'Unable to fetch emails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting an email from the list
  const handleEmailSelect = (email: string) => {
    setSelectedEmail(email);
    fetchEmails(email);  // Fetch emails for the selected email
  };

  // Handle adding a new email after successful login
  const handleAddNewEmail = (newEmail: string) => {
    if (!emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);  // Add the new email to the list
    } else {
      Alert.alert('Error', 'Email already exists in the list.');
    }
    setIsModalVisible(false);  // Close the modal
  };

  // Initially select the first email and fetch senders
  useEffect(() => {
    if (emails.length > 0) {
      setSelectedEmail(emails[0]);
      fetchEmails(emails[0]);
    }
  }, [emails]);

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
          <ThemedText type="title">Welcome {selectedEmail?.split('@')[0]}!</ThemedText>
          <HelloWave />
        </ThemedView>

        {/* Email Box with Plus Icon */}
        <View style={styles.emailContainer}>
          <ScrollView horizontal={true} style={styles.emailScroll} contentContainerStyle={styles.emailScrollContent}>
            {emails.map((email, index) => (
              <View key={index} style={[styles.emailBox, selectedEmail === email && styles.selectedEmailBox]}>
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
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={30} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* EmailSetup Modal */}
        <EmailSetup
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onFetchSuccess={handleAddNewEmail}  // This will add the new email to the list
        />

        {/* Display list of senders for the selected email */}
        <FlatList
          data={emailSenders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: itemBackgroundColor }]}>
              <TouchableOpacity onPress={() => router.push({ pathname: '/emailDetails', params: { email: item.sender, sentTo: selectedEmail } })}>
                <Text style={[styles.email, { color: textColor }]}>Sender: {item.sender}</Text>
                <Text style={[styles.email, { color: textColor }]}>Subject: {item.subject}</Text>
                <Text style={[styles.email, { color: textColor }]}>Date: {item.date}</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ backgroundColor: '#F0F0F0' }}
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
    backgroundColor: '#007AFF',
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#000',
  },
  selectedEmailText: {
    color: '#fff',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
