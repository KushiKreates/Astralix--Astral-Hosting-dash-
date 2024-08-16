import React, { useEffect, useState } from 'react';
import { FaInfoCircle, FaServer, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Initialize Firestore and Auth (assuming Firebase is already initialized)
const db = getFirestore();
const auth = getAuth();

const EggsDisplay = () => {
  const [eggs, setEggs] = useState([]);
  const [userEggs, setUserEggs] = useState(new Set()); // Store egg IDs that the user owns
  const [paidEggs, setPaidEggs] = useState(new Set()); // Store egg IDs that the user has paid for
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEgg, setSelectedEgg] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingScreenVisible, setLoadingScreenVisible] = useState(false);
  const [discordModalVisible, setDiscordModalVisible] = useState(false); // State for Discord modal

  useEffect(() => {
    const fetchEggsData = async () => {
      try {
        const response = await fetch('https://image.astralaxis.tech/paid/eggs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEggs(data.eggs || []);
      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchEggsData();
  }, []);

  useEffect(() => {
    const fetchUserEggs = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserEggs(new Set(userData.eggs || [])); // Set of egg IDs the user owns
            setPaidEggs(new Set(userData.paidEggs || [])); // Set of egg IDs the user has paid for
          } else {
            setError('User document does not exist');
          }
        } else {
          setError('User is not authenticated');
        }
      } catch (error) {
        console.error('Error fetching user data', error);
        setError('Error fetching user data');
      }
    };

    fetchUserEggs();
  }, []);

  const handleBuyClick = (eggId) => {
    setSelectedEgg(eggId);
    setModalVisible(true);
  };

  const handlePurchase = async () => {
    setLoadingScreenVisible(true); // Show loading screen
    try {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);

        // Check if user document exists
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Document exists, update it
          const userData = userDoc.data();
          const updatedEggs = [...userData.eggs || [], selectedEgg].filter(id => id !== undefined);
          const updatedPaidEggs = [...userData.paidEggs || [], selectedEgg].filter(id => id !== undefined);

          await updateDoc(userDocRef, {
            eggs: updatedEggs,
             // Add to paidEggs list
          });

          setUserEggs(new Set(updatedEggs));
          
        } else {
          // Document does not exist, create it
          await setDoc(userDocRef, {
            eggs: [selectedEgg],
            paidEggs: [selectedEgg], // Add to paidEggs list
            createdAt: new Date(),
            email: user.email,
          });
          setUserEggs(new Set([selectedEgg]));
         
        }

        // Find the selected egg data
        const selectedEggData = eggs.find(egg => egg.id === selectedEgg);
        const thumbnailUrl = selectedEggData ? selectedEggData.imageUrl : '';

        // Send the purchase info as an embed to Discord webhook
        await fetch('https://discord.com/api/webhooks/1273124019452907611/pzKI4YD-eWgTJLbs3T9nJCJctVKOZO73ZY04YKQ-ZWXmm2T3JInv90Z7eYKBCtMBfTsu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            embeds: [
              {
                title: 'Egg Order Received',
                description: `User ${user.email} has added an egg to their cart.`,
                fields: [
                  {
                    name: 'Egg ID',
                    value: selectedEgg || 'N/A',
                  },
                  {
                    name: 'Heading',
                    value: selectedEggData ? selectedEggData.heading : 'N/A',
                  },
                  {
                    name: 'Description',
                    value: selectedEggData ? selectedEggData.description : 'N/A',
                  },
                  {
                    name: 'Order Date',
                    value: new Date().toLocaleString(),
                  },
                ],
                thumbnail: {
                  url: thumbnailUrl || 'https://via.placeholder.com/150', // Fallback image if no URL
                },
                color: 3447003, // Embed color (hex: 0x3498db)
              },
            ],
          }),
        });

        setSuccessMessage('Added to cart. We will confirm your purchase soon.');
        setModalVisible(false);
        setDiscordModalVisible(true); // Show the Discord modal after purchase
      } else {
        setError('User is not authenticated');
      }
    } catch (error) {
      console.error('Error processing purchase', error);
      setError('Error processing purchase');
    } finally {
      setLoadingScreenVisible(false); // Hide loading screen
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (eggs.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No eggs found</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-transparent rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Premium Eggs 🌸</h2>
      <div className="flex flex-col space-y-4">
        {eggs.map((egg) => (
          <div key={egg.id} className="flex items-center bg-transparent p-4 border rounded-lg shadow-md">
            <img
              src={egg.imageUrl}
              alt={egg.heading}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <FaServer className="text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold">{egg.heading}</h3>
              </div>
              <div className="flex items-center mb-2">
                <FaInfoCircle className="text-gray-500 mr-2" />
                <p className="text-gray-700 text-sm">{egg.description}</p>
              </div>
              {!paidEggs.has(egg.id) ? (
                !userEggs.has(egg.id) ? (
                  <button
                    onClick={() => handleBuyClick(egg.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-yellow-500 text-white px-4 py-2 rounded cursor-not-allowed"
                  >
                    Already Ordered
                  </button>
                )
              ) : (
                <button
                  disabled
                  className="bg-green-500 text-white px-4 py-2 rounded cursor-not-allowed"
                >
                  Already Owned
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-20 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <FaInfoCircle className="text-yellow-500 text-4xl mb-4 mx-auto" />
            <h3 className="text-lg text-gray-700 font-bold mb-4 text-center">Confirm Purchase</h3>
            <p className="text-gray-700 mb-4">Do you want to add this egg to your cart?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {loadingScreenVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-20 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4 mx-auto" />
            <h3 className="text-lg text-gray-700 font-bold mb-4 text-center">Processing Purchase</h3>
            <p className="text-gray-700 mb-4">Please wait while we confirm your order...</p>
          </div>
        </div>
      )}

      {discordModalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-20 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <FaCheckCircle className="text-green-500 text-4xl mb-4 mx-auto" />
            <h3 className="text-lg text-gray-700 font-bold mb-4 text-center">Join Our Discord</h3>
            <p className="text-gray-700 mb-4">Please join our Discord server to proceed with your payment.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDiscordModalVisible(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => window.open('https://discord.gg/5UDGBjX6fs', '_blank')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Join Discord
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 text-center text-green-500">
          <FaCheckCircle className="inline-block mr-2" />
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default EggsDisplay;
