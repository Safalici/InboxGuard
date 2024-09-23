import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EmailDetailsScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();  // Get the email passed from the previous screen

  // Placeholder for fetched email details (you will replace these with actual API response data)
  const emailDetails = {
    sender: email,  // This will be the email address of the sender (or fetched data)
    recipient: 'user@example.com',  // The actual logged-in user's email (can be fetched)
    subject: 'Test Subject',  // Fetched subject of the email
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      {/* Clickable Sender Section */}
      <TouchableOpacity onPress={() => router.push({ pathname: '/emailContent', params: { email: emailDetails.sender, subject: emailDetails.subject } })}>
        <View style={styles.emailDetailBox}>
            <Text style={styles.detailText}>Sender: {emailDetails.sender}</Text>
            <Text style={styles.detailText}>Sent to: {emailDetails.recipient}</Text>
            <Text style={styles.detailText}>Subject: {emailDetails.subject}</Text>
        </View>
    </TouchableOpacity>


      
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
  emailDetailBox: {
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
  },
});
