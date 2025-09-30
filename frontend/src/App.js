

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BikeListings from './pages/BikeListings';
import AddEditBike from './pages/AddEditBike';
import BikeDetails from './pages/BikeDetails';
import MyListings from './pages/MyListings';
import { AuthProvider, AuthContext } from './components/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Root component that handles redirect based on auth status
const Root = () => {
  const { user } = useContext(AuthContext);
  return <Navigate to={user ? "/my-listings" : "/login"} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/bikes" element={<BikeListings />} />
            <Route path="/bikes/:id" element={<BikeDetails />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/bikes/add" element={<AddEditBike />} />
              <Route path="/bikes/edit/:id" element={<AddEditBike />} />
              <Route path="/my-listings" element={<MyListings />} />
            </Route>
            
            {/* Root path redirects based on auth status */}
            <Route path="/" element={<Root />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
