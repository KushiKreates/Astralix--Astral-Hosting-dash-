import React, { useEffect } from 'react';
import { FaList } from 'react-icons/fa'; // Importing icons from react-icons/fa
import anime from 'animejs/lib/anime.es.js'; // Import anime.js for animations
import { GiIceCubes } from 'react-icons/gi';
import { FaCube } from 'react-icons/fa6';

const LXCList = ({ lxcIds }) => {
  useEffect(() => {
    if (lxcIds && lxcIds.length > 0) {
      anime({
        targets: '.lxc-list-container',
        translateY: [-20, 0],
        opacity: [0, 1],
        easing: 'easeOutQuad',
        duration: 800,
      });
    }
  }, [lxcIds]);

  return (
    <div className="lxc-list-container bg-gray-800 text-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Server List</h2>
      {lxcIds && lxcIds.length > 0 ? (
        lxcIds.map((id) => (
          <div key={id} className="flex items-center mb-2">
            <FaCube className="text-blue-500 text-2xl mr-5" />
            <h1 className="text-white">‎ SERVER ID: {id}</h1>
          </div>
        ))
      ) : (
        <p classname="text-red-300">😐 You got no servers </p>
      )}
    </div>
  );
};

export default LXCList;
