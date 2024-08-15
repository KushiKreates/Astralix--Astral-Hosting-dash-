import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FaServer, FaMemory, FaMicrochip, FaDatabase, FaPlug, FaGoogleDrive } from 'react-icons/fa';

const Reso = () => {
  const [resourceData, setResourceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const slots = userData.slots;
            const cpu = userData.cpu;
            const ram = userData.ram;
            const db = userData.db;
            const ports = userData.ports;
            const disk = userData.disk;

            setResourceData({ slots, cpu, ram, db, ports, disk });
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

    fetchResourceData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!resourceData) {
    return (
      <div className="text-center text-gray-500">
        <p>No resource details found</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-transparent border rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-white">Resource Details ⚙️</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CPU */}
        <div className="bg-transparent p-4 rounded-lg shadow-md flex items-center">
          <FaMicrochip className="text-red-500 text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-medium">CPU</h3>
            <p className="text-xl font-bold">{resourceData.cpu || '0'}%</p>
          </div>
        </div>
        {/* RAM */}
        <div className="bg-transparent p-4 rounded-lg shadow-md flex items-center">
          <FaMemory className="text-green-500 text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-medium">RAM</h3>
            <p className="text-xl font-bold">{resourceData.ram || '0'} MB</p>
          </div>
        </div>
        {/* Disk */}
        <div className="bg-transparent p-4 rounded-lg shadow-md flex items-center">
          <FaGoogleDrive className="text-yellow-500 text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-medium">Disk</h3>
            <p className="text-xl font-bold">{resourceData.disk || '0'}</p>
          </div>
        </div>
        {/* DB */}
        <div className="bg-transparent p-4 rounded-lg shadow-md flex items-center">
          <FaDatabase className="text-blue-500 text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-medium">DB</h3>
            <p className="text-xl font-bold">{resourceData.db || '0'}</p>
          </div>
        </div>
        {/* Ports */}
        <div className="bg-transparent p-4 rounded-lg shadow-md flex items-center">
          <FaPlug className="text-purple-500 text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-medium">Ports</h3>
            <p className="text-xl font-bold">{resourceData.ports || '0'}</p>
          </div>
        </div>
        {/* Slots */}
        <div className="bg-transparent p-4 rounded-lg shadow-md flex items-center">
          <FaServer className="text-gray-500 text-3xl mr-4" />
          <div>
            <h3 className="text-lg font-medium">Slots</h3>
            <p className="text-xl font-bold">{resourceData.slots || '0'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reso;
