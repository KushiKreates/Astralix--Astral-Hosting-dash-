import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaServer, FaSpinner } from 'react-icons/fa'; // Importing icons from react-icons/fa
import anime from 'animejs/lib/anime.es.js'; // Import anime.js for animations

const Node = () => {
  const [nodeStatus, setNodeStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodeStatus = async () => {
      try {
        const response = await axios.get('/api/status');
        setNodeStatus(response.data.status);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching node status', error);
        setLoading(false); // Ensure loading is turned off in case of error
      }
    };

    fetchNodeStatus();
  }, []);

  // Animation effect for when node status updates
  useEffect(() => {
    if (nodeStatus) {
      anime({
        targets: '.node-container',
        translateY: [-20, 0],
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 800,
      });
    }
  }, [nodeStatus]);

  return (
    <div className={`node-container bg-gray-800 text-white rounded-lg shadow-md p-4 mt-4 ${nodeStatus === 'online' ? 'border-2 border-green-500' : ''}`}>
      <h2 className="text-lg font-semibold mb-2">Node Status</h2>
      {loading ? (
        <div className="flex items-center">
          <FaSpinner className="text-white animate-spin mr-4" /> {/* Animated spinner while loading */}
          <p>‎ Loading node status...</p>
        </div>
      ) : (
        <div className="flex items-center">
          <FaServer className="text-white-500 text-2xl mr-5" /> {/* Green server icon for online status */}
          <h1 className="text-green-400">‎ {nodeStatus}</h1>
        </div>
      )}
    </div>
  );
};

export default Node;
