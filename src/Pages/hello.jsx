import React from 'react';
import { HiOutlineTerminal, HiOutlineExternalLink } from 'react-icons/hi';

const InfoPanel = () => {
  return (
    <div className="bg-transparent text-white rounded-lg shadow-lg p-6 mt-4 mb-8 max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <HiOutlineTerminal className="text-3xl sm:text-4xl mr-0 sm:mr-4" /> {/* Terminal icon */}
        <h2 className="text-2xl sm:text-3xl font-semibold mt-2 sm:mt-0">
          Information Panel
        </h2>
      </div>
      <p className="text-base sm:text-lg flex items-center mt-2">
        
        Welcome to Astral-Cloud, level up your cloud experience with secure, fast, and reliable servers. 🌸 Minning / illegal activities are not allowed at Astral-Cloud 🤗
      </p>
    </div>
  );
};

export default InfoPanel;
