import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function EmailDetailsScreen() {
  const router = useRouter();
  const { email, sentTo } = useLocalSearchParams();  // Get the email and sentTo params

  // Placeholder for multiple email details (replace this with actual API data)
  const emailDetailsList = [
    { sender: email, recipient: sentTo, subject: 'Test Subject 1' },
    { sender: email, recipient: sentTo, subject: 'Test Subject 2' },
    { sender: email, recipient: sentTo, subject: 'Test Subject 3' },
  ];

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      {/* Render each email as a separate block */}
      {emailDetailsList.map((emailDetail, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push({ pathname: '/emailContent', params: { email: emailDetail.sender, subject: emailDetail.subject } })}
        >
          <View style={styles.emailDetailBox}>
            <Text style={styles.detailText}>Sender: {emailDetail.sender}</Text>
            <Text style={styles.detailText}>Sent to: {emailDetail.recipient}</Text>
            <Text style={styles.detailText}>Subject: {emailDetail.subject}</Text>
          </View>
        </TouchableOpacity>
      ))}
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
