import React, { useEffect, useState } from 'react';
import anime from 'animejs/lib/anime.es.js'; // Import anime.js

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
      </header>
    </>
  );
};

export default Header;
