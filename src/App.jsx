import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Shop from './Pages/Shop';
import Settings from './Pages/Settings';
import Activity from './Pages/Conv';
import Servers from './Pages/Servers';
import User from './Pages/User';
import Payment from './Pages/Payment';
import Admin from './Pages/Admin'; // Assuming you have an Admin component
import LoadingOverlay from './Comps/LoadingOverlay'; // Import LoadingOverlay component
import Conv from './Pages/Conv';
import Profile from './Pages/Profile';

const App = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/conv"
          element={
            <ProtectedRoute>
              <Conv />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servers"
          element={
            <ProtectedRoute>
              <Servers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard setLoading={setLoading} />
            </ProtectedRoute>
          }
        />
      </Routes>
      {loading && <LoadingOverlay />}
    </Router>
  );
};

export default App;
