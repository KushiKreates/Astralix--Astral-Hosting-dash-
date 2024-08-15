
import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosConfig';

const SideBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/api/user');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-gray-900 text-white h-full p-4">
      <h2 className="text-2xl font-semibold">SideBar</h2>
      {user ? (
        <div className="mt-4">
          <p>Welcome, {user.email} 😀, </p>
          <Node />
          <button
            className="btn btn-primary mt-2"
            onClick={() => {
              axiosInstance.get('/api/logout').then(() => {
                window.location.href = '/Login';
              });
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <p className="mt-4">Loading...</p>
      )}
    </div>
  );
};

export default SideBar;
