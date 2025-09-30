

import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { apiFetch } from '../api';

export default function BikeDetails() {
  const { id } = useParams();
  const [bike, setBike] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    apiFetch(`/bikes/${id}`)
      .then(data => setBike(data))
      .catch(() => setError('Failed to load bike'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this bike?')) return;
    try {
      await apiFetch(`/bikes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/my-listings');
    } catch (err) {
      setError('Delete failed');
    }
  };

  if (loading) return <div className="loading-indicator">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!bike) return null;

  return (
    <div className="container detail-container">
      <div className="detail-image-container">
        {bike.image_url ? (
          <img 
            src={bike.image_url} 
            alt={bike.brand + ' ' + bike.model} 
            className="detail-image"
          />
        ) : (
          <div className="detail-image-placeholder">
            No Image Available
          </div>
        )}
      </div>

      <h2 className="detail-title">
        {bike.brand} {bike.model}
      </h2>

      <div className="detail-grid">
        <div className="detail-label">Year:</div>
        <div className="detail-value">{bike.year}</div>
        
        <div className="detail-label">Price:</div>
        <div className="detail-price">₹{bike.price.toLocaleString()}</div>
        
        <div className="detail-label">Kilometers:</div>
        <div className="detail-value">{bike.kilometers_driven.toLocaleString()} km</div>
        
        <div className="detail-label">Location:</div>
        <div className="detail-value">{bike.location}</div>
        
        <div className="detail-label">Posted:</div>
        <div className="detail-value">{new Date(bike.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</div>
      </div>
      
      <div className="button-group">
        <div className="button-group-item">
          <Link to="/bikes" className="btn secondary-btn">
            Back to Listings
          </Link>
        </div>
        
        {user && user.id === bike.seller_id && (
          <>
            <div className="button-group-item">
              <Link to={`/bikes/edit/${bike.id}`} className="btn primary-btn">
                Edit
              </Link>
            </div>
            <div className="button-group-item">
              <button onClick={handleDelete} className="btn danger-btn">
                Delete
              </button>
            </div>
          </>
        )}
      </div>
      {user && user.id !== bike.seller_id && (
        <div className="info-box">
          <p>
            Interested in this bike? Contact the seller through our messaging system (Coming soon!)
          </p>
        </div>
      )}
    </div>
  );
}
