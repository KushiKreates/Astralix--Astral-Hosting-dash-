import React, { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js'; // Import anime.js

const LoadingOverlay = () => {
  useEffect(() => {
    anime({
      targets: '.loader-emoji',
      rotate: '1turn',
      duration: 1000,
      easing: 'linear',
      loop: true,
    });
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white z-50">
      <div className="text-center">
        <div className="loader-emoji text-6xl" style={{ display: 'inline-block' }}>⌛</div>
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
