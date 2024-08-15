import React, { useState, useEffect } from 'react';
import Header from './Header';
import SideBar from './SideBar';
import MobileSideBar from './MobileSideBar'; // Import the MobileSideBar component
import { MenuIcon } from '@heroicons/react/outline'; // Add Heroicons or use your icons
import ImageCarousel from './Img';
import ImageGallery from './Img';
import EggsDisplay from './Eggs';

const Shop = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Adjust breakpoint as needed

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-200 bg-gray-800 text-white">
      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          <MobileSideBar isOpen={isMobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
          <button
            className="md:hidden p-2 text-white fixed top-4 left-4 z-50"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Regular Sidebar */}
      {!isMobile && (
        <div className="hidden md:flex w-64 bg-gray-900 p-4">
          <SideBar />
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 ${!isMobile ? 'ml-0' : 'pl-4'}`}>
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="p-8 bg-gray-800 rounded-tl-lg overflow-y-auto">
          <div className="container mx-auto p-4">
            <div className="bg-gray-900 shadow-md rounded-md p-4">
              <h2 className="text-lg font-semibold mb-2">Shop</h2>
              <EggsDisplay />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
