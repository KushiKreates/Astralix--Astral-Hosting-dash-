import React, { useState, useEffect } from 'react';
import Header from './Header';
import anime from 'animejs/lib/anime.es.js'; // Import anime.js
import axios from 'axios';
import SideBar from './SideBar';
import { FaPowerOff, FaPlay } from 'react-icons/fa'; // Importing icons from react-icons
import {axiosInstance} from '../utils/api';
import LaunchConvoyPanel from './LaunchConvoyPanel';

const bytesToGB = (bytes) => {
  if (bytes === 0) return '0 GB';
  const gigaBytes = bytes / (1024 * 1024 * 1024);
  return gigaBytes.toFixed(2) + ' GB';
};

const secondsToHours = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const Admin = () => {
  const [lxcContainers, setLxcContainers] = useState([]);
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const apiUrl = '/qemu';

  useEffect(() => {
    const fetchLxcContainers = async () => {
      try {
        const response = await axiosInstance.get(apiUrl);
        setLxcContainers(response.data.data);

        // Animate container cards on load
        anime({
          targets: '.container-card',
          translateY: [50, 0],
          opacity: [0, 1],
          easing: 'easeOutQuad',
          duration: 800,
          delay: anime.stagger(100),
        });
      } catch (error) {
        console.error('Error fetching LXC containers:', error);
      }
    };

    fetchLxcContainers();
  }, []);

  const handlePowerOn = async (vmid) => {
    try {
      const response = await axiosInstance.post(`${apiUrl}/start/${vmid}`);
      console.log(`Successfully powered on container with VMID ${vmid}`);
      setMessage(`Container '${response.data.name}' has been powered on.`);
      fetchLxcContainers(); // Refresh containers list after action
    } catch (error) {
      console.error(`Error powering on container with VMID ${vmid}:`, error);
    }
  };

  const handlePowerOff = async (vmid) => {
    try {
      const response = await axiosInstance.post(`${apiUrl}/stop/${vmid}`);
      console.log(`Successfully powered off container with VMID ${vmid}`);
      setMessage(`Container '${response.data.name}' has been powered off.`);
      fetchLxcContainers(); // Refresh containers list after action
    } catch (error) {
      console.error(`Error powering off container with VMID ${vmid}:`, error);
    }
  };

  const checkAdmin = async () => {
    var out = false;
    try {
      const response = await axiosInstance.get('/api/user');
      out = response.data.admin;
    } catch (error) {
      console.error('Error fetching user', error);
      
    }
    return out;
  };
  if(!checkAdmin()){
    return <div>Not an admin</div>
  }
  else
  {
    if(!checkAdmin()){
      return <div>Not an admin,How the Fuck did you even get here</div>
    }
    return (
      <div className="flex h-screen bg-gray-800 text-white">
        
        <SideBar />
        <main className="flex-1 p-8 bg-gray-800 rounded-tl-lg overflow-y-auto">
          <div className="container mx-auto p-4">
            <Header />
            <div className="bg-gray-900 shadow-md rounded-md p-4">

              <h2 className="text-lg font-semibold mb-2">Virtual Machines</h2>
              <LaunchConvoyPanel />
              {lxcContainers.length === 0 ? (
                <p>No containers found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lxcContainers.map((container) => (
                    <div
                      key={container.vmid}
                      className="container-card bg-gray-800 p-4 rounded-lg shadow-md relative"
                    >
                      <div className="mb-4">
                        <p className="text-lg font-semibold">{container.name || 'No Name'}</p>
                        <p className="text-gray-400">{container.status}</p>
                      </div>
                      <div className="mb-1">
                        <p><span className="font-semibold">CPU:</span> {container.cpu}</p>
                        <p><span className="font-semibold">Memory:</span> {bytesToGB(container.mem)}</p>
                        <p><span className="font-semibold">Disk:</span> {bytesToGB(container.disk)}</p>
                        <p><span className="font-semibold">Net In:</span> {bytesToGB(container.netin)}</p>
                        <p><span className="font-semibold">Net Out:</span> {bytesToGB(container.netout)}</p>
                        <p><span className="font-semibold">Uptime:</span> {secondsToHours(container.uptime)}</p>
                      </div>
                      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                        <button
                          onClick={() => handlePowerOn(container.vmid)}
                          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          Power On
                        </button>
                        <button
                          onClick={() => handlePowerOff(container.vmid)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Power Off
                        </button>
                      </div>
                    </div>
                  
                  ))}
                  
                </div>
              )}
              {message && (
                <div className="mt-4 p-2 bg-gray-600 rounded-md">
                  <p className="text-green-300">{message}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

};

export default Admin;
