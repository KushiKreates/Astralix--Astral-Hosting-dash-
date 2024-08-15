import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { MdClose, MdError } from 'react-icons/md';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import anime from 'animejs';

const CreateServer = () => {
  const [resources, setResources] = useState({});
  const [freeEggs, setFreeEggs] = useState([]);
  const [paidEggs, setPaidEggs] = useState([]);
  const [selectedEgg, setSelectedEgg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverName, setServerName] = useState('');
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [userPaidEggs, setUserPaidEggs] = useState([]);
  const [selectedResources, setSelectedResources] = useState({
    cpu: 0,
    ram: 0,
    disk: 0,
    backup: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchResources = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setResources({
            cpu: data.cpu || 0,
            ram: data.ram || 0,
            disk: data.disk || 0,
            backup: data.backup || 0,
            slots: data.slots || 0,
            Serversinfo: data.Serversinfo || [], // Initialize Serversinfo if not present
          });
          setUserPaidEggs(data.paideggs || []);
        } else {
          setError('User document does not exist');
        }
      } else {
        setError('User is not authenticated');
      }
    } catch (err) {
      setError('Error fetching user resources');
    }
  };

  const fetchEggs = async () => {
    try {
      const [freeResponse, paidResponse] = await Promise.all([
        axios.get('/api/free/eggs'),
        axios.get('/api/paid/eggs'),
      ]);

      setFreeEggs(freeResponse.data.eggs || []);
      setPaidEggs(paidResponse.data.eggs || []);
    } catch (error) {
      setError('Error fetching eggs data');
    }
  };

  const handleCreateServer = async () => {
    setCreating(true);
    setLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (user && selectedEgg) {
      try {
        const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          const egg = [...freeEggs, ...paidEggs].find(e => e.id === selectedEgg);

          if (egg) {
            const isPaidEgg = paidEggs.some(e => e.id === selectedEgg);
            const ownsPaidEgg = isPaidEgg && userPaidEggs.includes(selectedEgg);

            if (isPaidEgg && !ownsPaidEgg) {
              setError('⚠️ You don\'t have this egg! Buy it at the shop');
              setShowModal(true);
              setCreating(false);
              setLoading(false);
              return;
            }

            const { cpu, ram, disk, backup } = selectedResources;

            // Check if user has enough resources
            if (
              data.cpu < cpu ||
              data.ram < ram ||
              data.disk < disk ||
              data.slots <= 0
            ) {
              setError('⚠️ You do not have enough resources or server slots available');
              setShowModal(true);
              setCreating(false);
              setLoading(false);
              return;
            }

            const payload = {
              name: serverName,
              cpu_limit: cpu,
              user_id: data.petro, // Fetch user_id from Firestore document
              nest_id: isPaidEgg ? 8 : 9,
              egg_id: selectedEgg,
              memory_limit: ram,
              swap_limit: 0,
              backup_limit: backup,
              disk_limit: disk,
              location_ids: [1],
            };

            console.log('Creating server with payload:', payload);

            const response = await axios.post('https://servers.astralaxis.one/create/', payload);

            setLoading(false);

            if (response.status === 201) {
              setSuccessMessage('Server created successfully!');
              setShowSuccessModal(true);

              // Animate success checkmark
              anime({
                targets: '.success-checkmark',
                scale: [0, 1],
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeOutElastic(1, .8)',
              });

              // Update user resources in Firestore
              await updateDoc(doc(getFirestore(), 'users', user.uid), {
                cpu: data.cpu - cpu,
                ram: data.ram - ram,
                disk: data.disk - disk,
                slots: data.slots - 1,
                Serversinfo: [...data.Serversinfo, {
                  name: serverName,
                  cpu,
                  ram,
                  disk,
                  backup,
                  egg_id: selectedEgg,
                }]
              });

              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else {
              setError('Failed to create server');
              setShowModal(true);
            }
          } else {
            setError('Selected egg not found');
            setShowModal(true);
          }
        } else {
          setError('User document does not exist');
          setShowModal(true);
        }
      } catch (err) {
        console.error('Error creating server:', err);
        setError('Something went wrong');
        setShowModal(true);
      }
    } else {
      setError('User is not authenticated or no egg selected');
      setShowModal(true);
    }

    setCreating(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchResources();
      await fetchEggs();
      setLoading(false);
    };

    fetchData();
  }, []);

  const closeModal = () => {
    setShowModal(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <div className="flex flex-col items-center">
          <p className="mb-4 font-bold text-3xl">Loading....</p>
          <p className="mb-4 font-semibold">Dashboard is created by Kushi_k (Nadhila)</p>
          <FaSpinner className="animate-spin text-green-500" size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center">Create a New Server</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Server Name:</label>
        <input
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-black"
          placeholder="Enter server name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Select Egg:</label>
        <select
          value={selectedEgg}
          onChange={(e) => setSelectedEgg(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-black"
        >
          <option value="" className="text-gray-500">Select an egg</option>
          {freeEggs.concat(paidEggs).map((egg) => (
            <option key={egg.id} value={egg.id} className="text-black">
              {egg.heading}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Resources:</label>
        <div className="mb-2">
          <label className="block text-gray-700">CPU:</label>
          <input
            type="number"
            min="0"
            value={selectedResources.cpu}
            onChange={(e) =>
              setSelectedResources((prev) => ({ ...prev, cpu: +e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-black"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">RAM:</label>
          <input
            type="number"
            min="0"
            value={selectedResources.ram}
            onChange={(e) =>
              setSelectedResources((prev) => ({ ...prev, ram: +e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-black"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Disk:</label>
          <input
            type="number"
            min="0"
            value={selectedResources.disk}
            onChange={(e) =>
              setSelectedResources((prev) => ({ ...prev, disk: +e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-black"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Backup:</label>
          <input
            type="number"
            min="0"
            value={selectedResources.backup}
            onChange={(e) =>
              setSelectedResources((prev) => ({ ...prev, backup: +e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-black"
          />
        </div>
      </div>
      <button
        onClick={handleCreateServer}
        disabled={creating}
        className="w-full p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
      >
        {creating ? <FaSpinner className="animate-spin inline-block mr-2" /> : 'Create Server'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <MdError className="text-red-500 mb-4" size={50} />
            <p className="text-lg text-gray-700">{error}</p>
            <button
              onClick={closeModal}
              className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <FaCheckCircle className="text-green-500 mb-4 success-checkmark" size={50} />
            <p className="text-lg text-gray-700">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateServer;
