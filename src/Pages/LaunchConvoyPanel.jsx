import React from 'react';
import { HiOutlineTerminal, HiOutlineExternalLink } from 'react-icons/hi';

const LaunchConvoyPanel = () => {
  const launchConvoy = () => {
    const convoyUrl = 'https://panel.astralaxis.one/';
    window.open(convoyUrl, '_blank');
  };

  const createConvoyAccount = () => {
    const convoyUrl = '/conv';
    window.open(convoyUrl, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-500 text-white rounded-lg shadow-lg p-6 mt-4 mb-8 cursor-pointer hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Launch Panel</h2>
        <HiOutlineTerminal className="text-3xl" /> {/* Terminal icon */}
      </div>
      <p className="text-lg mb-4">Enhance user experience and use the Panel. Create a Panel Account first!</p>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          onClick={launchConvoy}
          style={{ fontSize: '1.2rem' }} // Increase font size
        >
          Launch panel Now
          <HiOutlineExternalLink className="ml-2" /> {/* External link icon */}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
          onClick={createConvoyAccount}
          style={{ fontSize: '1.2rem' }} // Increase font size
        >
          Create Panel Account
          <HiOutlineExternalLink className="ml-2" /> {/* External link icon */}
        </button>
      </div>
    </div>
  );
};

export default LaunchConvoyPanel;
