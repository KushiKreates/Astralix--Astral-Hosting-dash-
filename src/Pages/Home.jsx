import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaServer } from 'react-icons/fa';
import Header from './Header';
import SideBar from './SideBar';

const Home = () => {
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await axios.get('https://test.manikineko.nl/node/status');
        setServerStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching server status:', error);
      }
    };

    fetchServerStatus();
  }, []);

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <SideBar />
      <main className="flex-1 p-8 bg-gray-800 rounded-tl-lg overflow-y-auto">
        <div className="container mx-auto p-4">
          <Header />
          <div className="bg-gray-900 shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaServer className="mr-2" />
              Server Status
            </h2>
            {serverStatus ? (
              <div className={`flex items-center p-4 rounded-md ${serverStatus === 'online' ? 'bg-green-600' : 'bg-red-600'}`}>
                <FaServer className="mr-2" />
                <span className="text-xl font-semibold">{serverStatus === 'online' ? 'Server is Online' : 'Server is Offline'}</span>
              </div>
            ) : (
              <p> Loading server status...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
