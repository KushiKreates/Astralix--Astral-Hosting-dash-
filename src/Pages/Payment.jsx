import React, { useEffect, useState } from 'react';
import Header from './Header';
import SideBar from './SideBar';
import { FaMoneyBillWave, FaSpinner } from 'react-icons/fa'; // Importing icons from react-icons/fa
import { auth, db } from '../firebase';

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsSnapshot = await db.collection('payments').get();
        const fetchedPayments = paymentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPayments(fetchedPayments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <SideBar />
      <main className="flex-1 p-8 bg-gray-800 rounded-tl-lg overflow-y-auto">
        <div className="container mx-auto p-4">
          <Header />
          <div className="bg-gray-900 shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FaMoneyBillWave className="text-yellow-400 text-2xl mr-2" />
              Payment
            </h2>
            {loading ? (
              <div className="flex items-center">
                <FaSpinner className="text-white animate-spin mr-4" /> {/* Animated spinner while loading */}
                <p>Loading payments...</p>
              </div>
            ) : (
              <div>
                {payments.length === 0 ? (
                  <p>No payments found.</p>
                ) : (
                  <ul className="divide-y divide-gray-800">
                    {payments.map((payment) => (
                      <li key={payment.id} className="py-2">
                        <div className="flex items-center justify-between">
                          <p>{payment.amount} - {payment.description}</p>
                          <p>{new Date(payment.date.toDate()).toLocaleDateString()}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
