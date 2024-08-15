import React from 'react';
import { FiYoutube } from 'react-icons/fi';
import { HiOutlineTerminal, HiOutlineExternalLink } from 'react-icons/hi';

const Starter = () => {
  const launchConvoy = () => {
    const convoyUrl = 'https://example.com/convoy'; // Replace with your desired URL
    window.open(convoyUrl, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-900 text-white rounded-lg shadow-lg p-6 mt-4 mb-8 cursor-pointer hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Get started! 🚀 </h2>
        <FiYoutube className="text-3xl" /> {/* Terminal icon */}
      </div>
      <p className="text-lg mb-4">Learn how to use our amazing software to host your story in the Cloud</p>
      <button
        className="bg-purple-900 hover:bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center"
        onClick={launchConvoy}
        style={{ fontSize: '1.2rem' }} // Increase font size
      >
        Launch a tutorial
        <HiOutlineExternalLink className="ml-2" /> {/* External link icon */}
      </button>
    </div>
  );
};

export default Starter;
