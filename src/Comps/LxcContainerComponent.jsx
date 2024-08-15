import React from 'react';

const LxcContainerComponent = ({ container }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
      <p className="text-lg font-semibold text-gray-900">Name: {container.name}</p>
      <p className="text-gray-700">ID: {container.vmid}</p>
      <p className="text-gray-700">Status: {container.status}</p>
      <p className="text-gray-700">CPU Usage: {container.cpu.toFixed(4)}</p>
      <p className="text-gray-700">Memory Usage: {container.mem} bytes</p>
      <p className="text-gray-700">Disk Usage: {container.disk} bytes</p>
      <p className="text-gray-700">Network In: {container.netin} bytes</p>
      <p className="text-gray-700">Network Out: {container.netout} bytes</p>
      {/* Add more fields as needed */}
    </div>
  );
};

export default LxcContainerComponent;
