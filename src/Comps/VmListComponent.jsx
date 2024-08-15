import React, { useState, useEffect } from 'react';

const VmListComponent = () => {
  const [vmCount, setVmCount] = useState(0);

  useEffect(() => {
    // Example: Fetch VM count from API
    const fetchVmCount = async () => {
      try {
        const response = await fetch('https://your-api-url/vms');
        const data = await response.json();
        setVmCount(data.count); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching VMs:', error);
      }
    };

    fetchVmCount();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Virtual Machines (VMs)</h2>
      <p className="text-gray-700 mb-2">Number of VMs: {vmCount}</p>
      <p className="text-gray-700">Status: Online</p>
    </div>
  );
};

export default VmListComponent;

//THIS WAS LATER ditched and It just wrote it
