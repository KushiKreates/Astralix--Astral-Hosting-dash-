import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from './Header';
import SideBar from './SideBar';
import MobileSideBar from './MobileSideBar';
import { onAuthStateChanged } from 'firebase/auth';
import { MenuIcon } from '@heroicons/react/outline';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Conv = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUser = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData.email || 'No email available');
          setPassword(userData.password || 'No password available');
        } else {
          setError('No user data found.');
        }
      } catch (error) {
        console.error('Error fetching user data', error);
        setError('Failed to fetch user data.');
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

  const handleOpenPanel = () => {
    // Implement the logic to open the panel or perform the desired action
    alert('Panel opened!'); // Example action
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
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

        <main className="flex-1 p-8 bg-gray-800 rounded-tl-lg overflow-y-auto">
          <div className="container mx-auto p-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <div className="bg-gray-900 shadow-md rounded-md p-4 mb-6">
                  <h2 className="text-lg font-semibold mb-4">User Information</h2>
                  <div>
                    <p className="mb-2"><strong>Email:</strong> {email}</p>
                    <p className="mb-2"><strong>Password:</strong> {password}</p>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                      onClick={handleOpenPanel}
                    >
                      Open Panel
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>
                </div>

                <div className="bg-gray-900 shadow-md rounded-md p-4">
                  <h2 className="text-lg font-semibold mb-4">Credits</h2>
                  <h2 className="font-bold">Hello there! Im Kushi (Nadhi) 👋</h2>
                  <p>‎ </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <FaGithub className="text-gray-400 hover:text-gray-300 w-6 h-6" />
                      <a
                        href="https://github.com/KushiKreates/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white"
                      >
                        GitHub
                      </a>
                    </div>
                    
                    
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Conv;
