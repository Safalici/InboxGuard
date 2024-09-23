import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity, StyleSheet,  Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const EmailSetup = ({ isVisible, onClose, onFetchSuccess }) => {
  const [selectedProvider, setSelectedProvider] = useState(''); // Selected email provider
  const [email, setEmail] = useState(''); // User's email address
  const [password, setPassword] = useState(''); // User's email password
  const [imapServer, setImapServer] = useState(''); // IMAP server
  const [imapPort, setImapPort] = useState(993); // IMAP port, default to 993

  const providers = {
    Gmail: { imapServer: 'imap.gmail.com', imapPort: 993 },
    Hotmail: { imapServer: 'imap-mail.outlook.com', imapPort: 993 },
    Yahoo: { imapServer: 'imap.mail.yahoo.com', imapPort: 993 },
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    if (providers[provider]) {
      setImapServer(providers[provider].imapServer);
      setImapPort(providers[provider].imapPort);
    }
  };

  const handleFetchEmails = async () => {
    if (!email || !password || !selectedProvider) {
      Alert.alert('Error', 'Please enter all details.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/fetch-emails', {
        email,
        password,
        imapServer,
        imapPort,
      });

      const emails = response.data.emails;
      console.log('Fetched Emails:', emails);
      onFetchSuccess(emails); // Pass the fetched emails back to the parent component
      onClose(); // Close modal after fetching
    } catch (error) {
      console.error('Error fetching emails:', error);
      Alert.alert('Error', 'Unable to fetch emails. Please check your credentials.');
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Email</Text>

          {/* Dropdown for selecting email provider */}
          <Picker
            selectedValue={selectedProvider}
            onValueChange={(itemValue) => handleProviderChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Provider" value="" />
            <Picker.Item label="Gmail" value="Gmail" />
            <Picker.Item label="Hotmail" value="Hotmail" />
            <Picker.Item label="Yahoo" value="Yahoo" />
          </Picker>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <Button title="Fetch Emails" onPress={handleFetchEmails} />
          <Button title="Cancel" color="red" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default EmailSetup;
