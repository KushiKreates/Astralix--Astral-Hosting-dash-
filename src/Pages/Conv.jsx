import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from './Header';
import SideBar from './SideBar';
import MobileSideBar from './MobileSideBar';
import { onAuthStateChanged } from 'firebase/auth';
import { MenuIcon } from '@heroicons/react/outline'; 
import { v4 as uuidv4 } from 'uuid';// Ensure you have the correct icon import

const API_KEY = 'skyport_ffd04fb1-25f6-4c33-9b7f-9d95fd8517ba'; // Replace with your API key
const API_BASE_URL = 'https://panel.astralaxis.one'; // Replace with your API base URL

const Conv = () => {
  const [user, setUser] = useState(null);
  const [convoyUser, setConvoyUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Add state for mobile view
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
          setUser({ ...user, ...userData });
          if (userData.Convoy && userData.Convoy.length > 0) {
            setConvoyUser(userData.Convoy[0]);
          } else {
            try {
              const response = await axios.post(`${API_BASE_URL}/api/getUser`, {
                type: 'email',
                value: user.email,
              }, {
                headers: {
                  'x-api-key': API_KEY,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
              });
              const skyportUser = response.data;
              if (skyportUser) {
                setConvoyUser(skyportUser);
                await setDoc(doc(db, 'users', user.uid), {
                  Convoy: [{ name: skyportUser.username, email: skyportUser.email, password: '' }],
                }, { merge: true });
              } else {
                setConvoyUser(null);
              }
            } catch (error) {
              setError('Error fetching Skyport user data.');
            }
          }
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('Error fetching user', error);
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

  //handle user shit here

  const handleCreateUser = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required.');
      return;
    }
  
    try {
      // Generate a random user ID
      const userId = uuidv4();
  
      // Create user on the Convoy API
      const response = await axios.post('/panel/api/users/create', {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        userId: userId, // Include the random user ID
        admin: false,   // Set admin to true as per the curl example
      }, {
        headers: {
          'x-api-key': API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      // Retrieve the newly created user from Convoy
      const skyportResponse = await axios.post(`${API_BASE_URL}/api/getUser`, {
        type: 'email',
        value: formData.email,
      }, {
        headers: {
          'x-api-key': API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      const newUser = skyportResponse.data;
      if (newUser) {
        // Save the new Convoy user in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          Convoy: [{
            name: newUser.username,
            email: newUser.email,
            password: formData.password,
            admin: false
          }],
        }, { merge: true });
  
        // Update state with the new user information
        setConvoyUser(newUser);
        setShowCreateForm(false);
        setFormData({ name: '', email: '', password: '' });
        setError(''); // Clear any previous errors
      } else {
        setError('Failed to fetch created user data.');
      }
    } catch (error) {
      console.error('Error creating Convoy user', error);
      setError('Failed to create user on Convoy.');
    }
  };

  const handleEditUser = async () => {
    if (!formData.name || !formData.email) {
      setError('Name and Email are required.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/update`, {
        id: convoyUser.id,
        username: formData.name,
        email: formData.email,
      }, {
        headers: {
          'x-api-key': API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      await setDoc(doc(db, 'users', user.uid), {
        Convoy: [{ name: formData.name, email: formData.email, password: convoyUser.password }],
      }, { merge: true });

      setConvoyUser({ ...convoyUser, username: formData.name, email: formData.email });
      setShowEditForm(false);
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Error editing Skyport user', error);
      setError('Failed to edit user on Skyport.');
    }
  };

  const handleShowPassword = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const convoyAccount = userDoc.data().Convoy[0];
        setPassword(convoyAccount.password);
        setShowPassword(true);
      } else {
        setError('Failed to retrieve password.');
      }
    } catch (error) {
      console.error('Error fetching password', error);
      setError('Failed to retrieve password.');
    }
  };

  const handleHidePassword = () => {
    setShowPassword(false);
  };

  const createServer = async () => {
    if (!user) {
      setError('User must be logged in to create a server.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/instances/deploy`, {
        image: 'default-image',
        memory: '512MB',
        cpu: '1',
        ports: '8080:80',
        nodeId: 'default-node-id',
        name: 'New Server',
        user: user.uid,
        primary: '8080',
      }, {
        headers: {
          'x-api-key': API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      await setDoc(doc(db, 'users', user.uid), {
        server: {
          cpu: '1',
          ram: '512MB',
          disk: '3GB',
        },
      }, { merge: true });

      alert('Server created with default limits.');
    } catch (error) {
      console.error('Error creating server', error);
      setError('Failed to create server.');
    }
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
              <div className="bg-gray-900 shadow-md rounded-md p-4">
                <h2 className="text-lg font-semibold mb-4">Convoy Information</h2>
                {convoyUser ? (
                  <div>
                    <p className="mb-2"><strong>Name:</strong> {convoyUser.username}</p>
                    <p className="mb-2"><strong>Email:</strong> {convoyUser.email}</p>
                    {showPassword && (
                      <p className="mb-2"><strong>Password:</strong> {password}</p>
                    )}
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                      onClick={handleShowPassword}
                    >
                      Show Password
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md ml-2"
                      onClick={handleHidePassword}
                    >
                      Hide Password
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md ml-2"
                      onClick={() => setShowEditForm(true)}
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>No Convoy information available.</p>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mt-4"
                      onClick={() => setShowCreateForm(true)}
                    >
                      Create Convoy Account
                    </button>
                  </div>
                )}

                {showCreateForm && (
                  <div className="mt-4 bg-gray-900 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Create Convoy Account</h3>
                    <input
                      type="text"
                      className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-black"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                      type="email"
                      className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-black"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      type="password"
                      className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-black"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
                      onClick={handleCreateUser}
                    >
                      Create User
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>
                )}

                {showEditForm && convoyUser && (
                  <div className="mt-4 bg-gray-900 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Edit Convoy Account</h3>
                    <input
                      type="text"
                      className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-black"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      defaultValue={convoyUser.username}
                    />
                    <input
                      type="email"
                      className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded text-black"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      defaultValue={convoyUser.email}
                    />
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md"
                      onClick={handleEditUser}
                    >
                      Save Changes
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Conv;
