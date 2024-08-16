import React, { useEffect, useState } from 'react';
import anime from 'animejs/lib/anime.es.js'; // Import anime.js
import { FaDiscord, FaTimes } from 'react-icons/fa'; // Import Discord and Close icons from react-icons

// Loading screen component
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white z-50">
    <div className="text-center">
      <div className="loader"></div>
      <div className="header-animation text-center mt-4"></div>
      <h1 className="text-xl sm:text-2xl">⌛ Updating And Configuring!</h1>
    </div>
  </div>
);

const Header = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(true); // State to manage popup visibility

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 200); // Adjust the time as needed

    // Animation configuration
    anime({
      targets: '.header-animation',
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutQuad',
      delay: (el, i) => 100 * i, // Delay each element slightly for staggered effect
      loop: true, // Enable looping for continuous animation
      direction: 'alternate', // Alternate animation direction
    });
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <header className="bg-gray-900 text-white p-4 sm:p-6 md:p-8 shadow-md relative rounded-tl-lg rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 opacity-75 z-0"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Astral-Cloud ☁️</h1>
          <div className="headers-animation mt-4">
            <h2 className="text-base sm:text-lg md:text-xl text-gray-200">Manage Your Virtual Environments</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 opacity-75">Version 1.0 Beta ©️2024 Astral-Axis</p>
          </div>
        </div>
        <div className="fixed bottom-4 right-4 z-50">
          <div 
            className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center transition-transform transform hover:scale-105"
            style={{
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)',
              animation: 'pulse 2s infinite'
            }}
          >
            <FaDiscord className="text-blue-600 mr-2" size={24} />
            <a 
              href="https://discord.gg/5UDGBjX6fs" // Replace with your actual Discord invite link
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white font-semibold hover:underline"
            >
              Join Discord Server
            </a>
          </div>
          {isPopupVisible && (
            <div 
              className="fixed top-4 right-4 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-lg opacity-90 z-50"
              style={{ width: 'max-content' }}
            >
              <div className="flex justify-between items-center">
                <p className="text-center">
                  Free servers get purged regularly. Join the Discord server to avoid this!
                </p>
                <button
                  onClick={() => setIsPopupVisible(false)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
            }
            50% {
              box-shadow: 0 0 25px rgba(255, 0, 0, 0.7);
            }
            100% {
              box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
            }
          }
        `}
      </style>
    </>
  );
};

export default Header;
