import React, { useState } from 'react';
import { signInWithGoogle } from '../Auth';
import SideBar from './SideBar';
import Header from './Header';

const Register = () => {
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      window.location.href = '/Login';
    } catch (error) {
      console.error('Google sign-in error', error);
      setError('Google sign-in failed');
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <SideBar />
      <main className="flex-1 p-8 bg-gray-800 rounded-tl-lg overflow-y-auto">
        <div className="container mx-auto p-4">
          <Header />
          <div className="bg-gray-900 shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Register</h2>
            {error && <div className="text-red-500 mb-3">{error}</div>}
            <button onClick={handleGoogleSignIn} className="btn btn-primary">Register with Google</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
