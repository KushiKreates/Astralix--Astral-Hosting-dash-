import React from 'react';
import { Link } from 'react-router-dom';
import { XIcon } from '@heroicons/react/outline'; // Add Heroicons or use your icons

const MobileSideBar = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 bg-gray-800 text-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden z-40`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold">Neko-Astral</h1>
        <button onClick={onClose}>
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="mt-4">
        <Link to="/" className="block px-4 py-2 hover:bg-gray-700">Home</Link>
        <Link to="/Servers" className="block px-4 py-2 hover:bg-gray-700">Servers</Link>
        <Link to="/conv" className="block px-4 py-2 hover:bg-gray-700">Convoy</Link>
        <Link to="/Payment" className="block px-4 py-2 hover:bg-gray-700">Payment</Link>
        <Link to="/Shop" className="block px-4 py-2 hover:bg-gray-700">Shop</Link>
        <Link to="/Settings" className="block px-4 py-2 hover:bg-gray-700">Settings</Link>
        <Link to="/Admin" className="block px-4 py-2 hover:bg-gray-700">Admin</Link>
      </nav>
    </div>
  );
};

export default MobileSideBar;
