// api.js

import axios from 'axios';

const apiBaseUrl = 'https://test.manikineko.nl/';

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    // Add any headers if needed, such as authentication headers
  },
});

export const fetchLxcContainers = async () => {
  try {
    const response = await axiosInstance.get('/lxc');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching LXC containers:', error);
    throw error;
  }
};
