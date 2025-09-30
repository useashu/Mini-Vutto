

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';

export default function BikeListings() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [error, setError] = useState('');

  const fetchBikes = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '/bikes';
      const params = [];
      if (brand) params.push(`brand=${encodeURIComponent(brand)}`);
      if (model) params.push(`model=${encodeURIComponent(model)}`);
      if (params.length) url += '?' + params.join('&');
      const data = await apiFetch(url);
      setBikes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
    // eslint-disable-next-line
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchBikes();
  };

  return (
    <div className="container">
      <h2 className="page-title">Used Bike Listings</h2>
      <form 
        onSubmit={handleSearch} 
        className="search-form"
      >
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={e => setBrand(e.target.value)}
          className="form-input"
        />
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={e => setModel(e.target.value)}
          className="form-input"
        />
        <button 
          type="submit" 
          className="btn primary-btn"
        >
          Search
        </button>
      </form>
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : bikes.length === 0 ? (
        <div className="info-message">No bikes found.</div>
      ) : (
        <div className="card-grid">
          {bikes.map(bike => (
            <div 
              key={bike.id} 
              className="card"
              style={{ 
                border: '1px solid #eee', 
                padding: 0, 
                background: '#fff',
              }}
            >
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
                <Link 
                  to={`/bikes/${bike.id}`} 
                  className="btn primary-btn card-button"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
