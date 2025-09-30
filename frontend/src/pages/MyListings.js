

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { apiFetch } from '../api';

export default function MyListings() {
  const { token } = useContext(AuthContext);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    apiFetch('/bikes/mine', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(data => setBikes(data))
      .catch(() => setError('Failed to load bikes'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="container">
      <div className="page-header">
        <h2 className="page-title">My Listings</h2>
        <Link 
          to="/bikes/add" 
          className="btn primary-btn"
        >
          + Add New Bike
        </Link>
      </div>
      
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : bikes.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't listed any bikes yet</h3>
          <p>Get started by adding your first bike listing</p>
          <Link 
            to="/bikes/add" 
            className="btn primary-btn"
          >
            Add Your First Bike
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {bikes.map(bike => (
            <div key={bike.id} className="card">
              <div className="card-image-container">
                {bike.image_url ? (
                  <img 
                    src={bike.image_url} 
                    alt={bike.brand + ' ' + bike.model} 
                    className="card-image"
                  />
                ) : (
                  <div className="card-image-placeholder">
                    No Image
                  </div>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{bike.brand} {bike.model}</h3>
                <div className="card-info">Year: {bike.year}</div>
                <div className="card-price">₹{bike.price.toLocaleString()}</div>
                <div className="card-info">KMs Driven: {bike.kilometers_driven.toLocaleString()}</div>
                <div className="card-info">Location: {bike.location}</div>
                
                <div className="card-actions">
                  <Link to={`/bikes/${bike.id}`} className="btn primary-btn">
                    View Details
                  </Link>
                  <Link to={`/bikes/edit/${bike.id}`} className="btn secondary-btn">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
