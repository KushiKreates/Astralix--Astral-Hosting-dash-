// Terminal.jsx
import React, { useEffect, useRef } from 'react';

const Terminal = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Replace with your Proxmox WebSocket URL and CT ID for serial console access
    const wsUrl = 'wss://81.169.237.72:8006/api2/json/nodes/h3066910/lxc/103/serialwebsocket';

    // Establish WebSocket connection
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
      // You can send initial commands or handle connected logic here
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current.onmessage = (e) => {
      console.log('Received message:', e.data);
      // Handle incoming messages from the WebSocket
    };

    return () => {
      
      // Clean up WebSocket connection on component unmount
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      {/* Add your terminal UI here */}
      <p>Terminal Component</p>
      {/* Add more UI components as needed */}
    </div>
  );
};

export default Terminal;
