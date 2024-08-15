import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import anime from 'animejs';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setIsAuthenticated(true);
          if (requireAdmin) {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              setIsAdmin(userDoc.data().isAdmin);
              console.log('😀 This bitch is a admin wow, super cool go fuck yourself, here are some more fun facts for you to know ig, Uk 2+2=4?? Got nothing to fill to, so Get rekt by trans ppl, Yes im closeted, Yes my friends found out im Trans, Katy likes go kys! :happy:');
            } else {
              setIsAdmin(false);
            }
          } else {
            setIsAdmin(null);
          }
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      });
    };

    checkAuth();
  }, [requireAdmin]);

  useEffect(() => {
    anime({
      targets: '.cube',
      rotateY: '+=360',
      duration: 2000,
      easing: 'linear',
      loop: true
    });
  }, []);

  if (isAuthenticated === null || (requireAdmin && isAdmin === null)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="cube-wrapper">
          <div className="cube bg-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
