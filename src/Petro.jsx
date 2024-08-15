import axios from 'axios';

// Define the base URL for your Flask API
const FLASK_API_URL = '/api';

// Create an Axios instance for Flask API
const api = axios.create({
  baseURL: FLASK_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to create a user via Flask API
export const createPetrodactylUser = async (email, username, firstName, lastName, password) => {
  try {
    const response = await api.post('/create', {
      email,
      username,
      firstName,
      lastName,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Petrodactyl user:', error.message);
    throw error;
  }
};

// Function to update a user via Flask API
export const updatePetrodactylUser = async (userId, email, username, firstName, lastName, password) => {
  try {
    const response = await api.patch(`/update/${userId}`, {
      email,
      username,
      firstName,
      lastName,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating Petrodactyl user:', error.message);
    throw error;
  }
};

// Function to delete a user via Flask API
export const deletePetrodactylUser = async (userId) => {
  try {
    const response = await api.delete(`/delete/${userId}`);
    return response.status === 204; // Success if status is 204 (No Content)
  } catch (error) {
    console.error('Error deleting Petrodactyl user:', error.message);
    throw error;
  }
};
