import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import SideBar from './SideBar';
import Node from './Node';
import LaunchConvoyPanel from './LaunchConvoyPanel';
import Header from './Header';
import Starter from './Starter';
import Infopanel from './hello'
import Radio from './Radio';
import MobileSideBar from './MobileSideBar'; // Import the MobileSideBar component
import { MenuIcon } from '@heroicons/react/outline'; // Add Heroicons or use your icons
import Reso from './Reso';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Adjust breakpoint as needed

  useEffect(() => {
    const fetchUser = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUser({ ...user, ...userDoc.data() });
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error fetching user', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUser(user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-1200 bg-gray-800 text-white">
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
      <div className={`flex-1 ${!isMobile ? 'ml-0' : ''}`}> {/* Adjusted margin */}
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="p-4 bg-gray-800">
          <div className="bg-gray-900 shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
            {loading ? (
              <p>Loading...</p>
            ) : user ? (
              <div>
                <p>Welcome, 「 ✦ {user.email} ✦ 」👋</p>
                
                <Node />
                <Reso />
                <Infopanel />
               
              </div>
            ) : (
              <p>👋 Please log in to view the dashboard.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
