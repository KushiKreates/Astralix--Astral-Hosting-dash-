import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaServer, FaMemory, FaMicrochip, FaGoogleDrive, FaTools, FaTrashAlt, FaSpinner } from 'react-icons/fa';

const UserServers = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // New state for loading modal

  useEffect(() => {
    const fetchUserAndServers = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const petroId = userData.petro;

            if (petroId) {
              const response = await fetch(`https://image.astralaxis.tech/servers/${petroId}`);
              const data = await response.json();
              setServers(data.data);
            } else {
              setError('Petrodactyl ID is not defined');
            }
          } else {
            setError('User document does not exist');
          }
        } else {
          setError('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndServers();
  }, []);

  const handleDelete = async (serverId) => {
    try {
      setIsDeleting(true); // Show loading modal
      const user = auth.currentUser;
      if (!user) {
        setError('User is not authenticated');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const serverToDelete = servers.find(server => server.attributes.id === serverId);

        if (!serverToDelete) {
          setError('Server not found');
          return;
        }

        // Access server-specific info using the server ID as the key
        const serverInfoKey = `serverinfo.${serverId}`;

        // Calculate the resources to give back
        const updatedCPU = (userData.cpu || 0) + (serverToDelete.attributes.limits.cpu || 0);
        const updatedMemory = (userData.ram || 0) + (serverToDelete.attributes.limits.memory || 0);
        const updatedDisk = (userData.disk || 0) + (serverToDelete.attributes.limits.disk || 0);
        const updatedServerSlots = (userData.slots || 0) + 1;

        // Update the user's document in Firestore by deleting the specific server's info
        await updateDoc(userDocRef, {
          [serverInfoKey]: null, // Remove the specific server's info
          cpu: updatedCPU,
          ram: updatedMemory,
          disk: updatedDisk,
          slots: updatedServerSlots,
        });

        // Call the API to delete the server
        const response = await fetch(`https://image.astralaxis.tech/delete-server/${serverId}`, {
          method: 'GET',
        });

        if (response.ok) {
          // Remove the server from the local state
          setServers(servers.filter(server => server.attributes.id !== serverId));
        } else {
          setError('Failed to delete server');
        }
      } else {
        setError('User document does not exist');
      }
    } catch (error) {
      console.error('Error deleting server', error);
      setError('Error deleting server');
    } finally {
      setIsDeleting(false); // Hide loading modal
      setIsModalOpen(false);
    }
  };


  const openModal = (server) => {
    setSelectedServer(server);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedServer(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (servers.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No servers found</p>
      </div>
    );
  }

  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {servers.map(server => (
        <div key={server.attributes.id} className="bg-white border rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-800 text-white p-4">
            <h2 className="text-xl font-semibold">{server.attributes.name}</h2>
            <p className="text-gray-400">{server.attributes.description || 'No description available'}</p>
          </div>
          <div className="p-4 text-black">
            <div className="flex items-center mb-2">
              <FaServer className="mr-2 text-blue-500" />
              <span><strong>CPU:</strong> {server.attributes.limits.cpu}%</span>
            </div>
            <div className="flex items-center mb-2">
              <FaMemory className="mr-2 text-green-500" />
              <span><strong>Memory:</strong> {server.attributes.limits.memory} MB</span>
            </div>
            <div className="flex items-center mb-2">
              <FaGoogleDrive className="mr-2 text-yellow-500" />
              <span><strong>Disk:</strong> {server.attributes.limits.disk} MB</span>
            </div>
            <div className="flex items-center mb-2">
              <FaMicrochip className="mr-2 text-red-500" />
              <span><strong>Threads:</strong> {server.attributes.limits.threads || '0'}</span>
            </div>
            <div className="text-gray-600">
              <p><strong>Status:</strong> {server.attributes.status || '🌸'}</p>
              <p><strong>Created At:</strong> {new Date(server.attributes.created_at).toLocaleDateString()}</p>
              <p><strong>Updated At:</strong> {new Date(server.attributes.updated_at).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between mt-4">
              <a
                href={`https://panel.astralaxis.one/server/${server.attributes.container.environment.P_SERVER_UUID}`}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTools className="mr-2" />
                Manage
              </a>
              <button
                onClick={() => openModal(server)}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <FaTrashAlt className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && selectedServer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 w-128">
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg max-w-md w-128">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the server <strong>{selectedServer.attributes.name}</strong>?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedServer.attributes.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-700 p-6 rounded-lg shadow-lg text-white">
            <FaSpinner className="animate-spin mr-2 inline-block" />
            Deleting server... 
          </div>
        </div>
      )}
    </div>
  );
};

export default UserServers;
