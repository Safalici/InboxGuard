import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EmailContentScreen() {
  const router = useRouter();
  const { email, subject } = useLocalSearchParams();  // Get both the email and subject passed as params

  // Placeholder for full email content (you will replace these with actual API data)
  const emailContent = {
    sender: email,
    subject: subject,  // Additional param passed
    body: 'This is the full email content fetched from the API...',  // The email body content fetched
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      {/* Display full email content */}
      <Text style={styles.title}>Full Email Content from {emailContent.sender}</Text>
      <Text style={styles.subtitle}>Subject: {emailContent.subject}</Text>
      <Text style={styles.contentText}>{emailContent.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
  },
});
