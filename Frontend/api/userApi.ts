import axios from 'axios';

// Define the type for a User object
export interface User {
  id: number;
  name: string;
  email: string;
}

// Function to fetch users from the API
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
