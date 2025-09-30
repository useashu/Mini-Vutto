import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">Mini Vutto</Link>
        </div>
        
        {/* Hamburger menu for mobile */}
        <button 
          onClick={toggleMenu}
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        
        {/* Desktop navigation */}
        <div className="navbar-menu desktop">
          <Link to="/bikes" className="navbar-link">Bikes</Link>
          
          {user ? (
            <>
              <Link to="/my-listings" className="navbar-link">My Listings</Link>
              <Link to="/bikes/add" className="navbar-link">Add Bike</Link>
              <button 
                onClick={handleLogout}
                className="navbar-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile navigation drawer */}
      {menuOpen && (
        <div className="navbar-mobile">
          <Link 
            to="/bikes" 
            className="navbar-link-mobile"
            onClick={handleNavigation}
          >
            Bikes
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/my-listings" 
                className="navbar-link-mobile"
                onClick={handleNavigation}
              >
                My Listings
              </Link>
              <Link 
                to="/bikes/add" 
                className="navbar-link-mobile"
                onClick={handleNavigation}
              >
                Add Bike
              </Link>
              <button 
                onClick={handleLogout}
                className="navbar-button-mobile"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="navbar-link-mobile"
                onClick={handleNavigation}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="navbar-link-mobile"
                onClick={handleNavigation}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;