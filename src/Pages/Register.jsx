import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { MdClose, MdError } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';

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
    ram: 10,
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
          });
          setUserPaidEggs(data.paideggs || []); // Fetch the paid egg IDs
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
            if (cpu <= 0 || ram <= 0 || disk <= 0 || backup <= 0) {
              setError('⚠️ All resource values must be greater than zero');
              setShowModal(true);
              setCreating(false);
              setLoading(false);
              return;
            }

            const payload = {
              name: serverName,
              user_id: data.petro, // Fetch user_id from Firestore document
              nest_id: isPaidEgg ? 8 : 9,
              egg_id: selectedEgg,
              memory_limit: Math.floor(ram / 2),
              swap_limit: Math.floor(ram / 2),
              backup_limit: backup,
              disk_limit: disk,
              location_ids: [1],
            };

            const response = await axios.post('https://servers.astralaxis.one/create/', payload);

            setLoading(false);

            // Extract status from the response with safety checks
            const responseData = response.data || {};
            const status = responseData.data?.status;

            if (status === 'success') {
              await setDoc(doc(getFirestore(), 'used_resources', responseData.data.attributes.uuid), {
                cpu: cpu,
                ram: ram,
                disk: disk,
                backup: backup,
              });

              await updateDoc(doc(getFirestore(), 'users', user.uid), {
                slots: data.slots - 1,
              });

              setSuccessMessage('Server created successfully!');
              setShowSuccessModal(true);

              // Reset form fields
              setServerName('');
              setSelectedEgg('');
              setSelectedResources({ cpu: 0, ram: 10, disk: 0, backup: 0 });
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

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create a New Server</h2>
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-1">Server Name:</label>
        <input
          type="text"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 text-black"
          placeholder="Enter server name"
        />
      </div>
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-1">Select Egg:</label>
        <select
          value={selectedEgg}
          onChange={(e) => setSelectedEgg(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 text-black"
        >
          <option value="" className="text-gray-500">Select an egg</option>
          {freeEggs.concat(paidEggs).map((egg) => (
            <option key={egg.id} value={egg.id} className="text-black">
              {egg.heading}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-1">Resources:</label>
        <div className="mb-2">
          <label className="block text-gray-700">CPU:</label>
          <input
            type="number"
            min="0"
            value={selectedResources.cpu}
            onChange={(e) =>
              setSelectedResources((prev) => ({ ...prev, cpu: +e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 text-black"
            placeholder="Enter CPU"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">RAM (MB):</label>
          <input
            type="number"
            min="0"
            value={selectedResources.ram}
            onChange={(e) =>
              setSelectedResources((prev) => ({ ...prev, ram: +e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 text-black"
            placeholder="Enter RAM"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Disk (GB):</label>
          <input
            type="number"
            min="0"
            value={selectedResources.disk}
            onChange={(e) =>
              setSelectedResources((prev) => ({ ...prev, disk: +e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 text-black"
            placeholder="Enter Disk"
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
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 text-black"
            placeholder="Enter Backup"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleCreateServer}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200 ease-in-out disabled:opacity-50"
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Create Server'}
        </button>
      </div>

      {/* Error Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">Error</h3>
              <button onClick={closeModal} className="text-red-600">
                <MdClose size={24} />
              </button>
            </div>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">Success</h3>
              <button onClick={() => setShowSuccessModal(false)} className="text-green-600">
                <MdClose size={24} />
              </button>
            </div>
            <p className="text-gray-700 mb-4">{successMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all duration-200 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateServer;
