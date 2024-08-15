import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaServer, FaMemory, FaMicrochip, FaGoogleDrive, FaTools } from 'react-icons/fa';

const UserServers = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndServers = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const petroId = userData.petro;
            const Disk = userData.disk;
            const ports = userData.ports;
            // all the other ones here

            if (petroId) {
              const response = await fetch(`/api/servers/${petroId}`);
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
            <div className="flex justify-end mt-4">
              <a
                href={`https://panel.astralaxis.one/server/${server.attributes.container.environment.P_SERVER_UUID}`}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTools className="mr-2" />
                Manage
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserServers;
