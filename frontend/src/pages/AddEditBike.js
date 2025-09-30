

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import FormInput from '../components/FormInput';
import { apiFetch } from '../api';
import { validateBike, validateBikeField } from '../utils/validation';

const initialState = {
  brand: '',
  model: '',
  year: '',
  price: '',
  kilometers_driven: '',
  location: '',
  image_url: '',
};

export default function AddEditBike() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [fields, setFields] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      apiFetch(`/bikes/${id}`)
        .then(data => {
          setFields({
            brand: data.brand || '',
            model: data.model || '',
            year: data.year || '',
            price: data.price || '',
            kilometers_driven: data.kilometers_driven || '',
            location: data.location || '',
            image_url: data.image_url || '',
          });
        })
        .catch(() => setError('Failed to load bike'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (key, value) => {
    setFields(f => ({ ...f, [key]: value }));
    
    // Validate the field if it's been touched
    if (touched[key]) {
      const fieldError = validateBikeField(key, value);
      setFieldErrors(prev => ({
        ...prev,
        [key]: fieldError
      }));
    }
  };
  
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    // Validate the field on blur
    const fieldError = validateBikeField(field, fields[field]);
    setFieldErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched
    const allTouched = Object.keys(fields).reduce(
      (acc, field) => ({ ...acc, [field]: true }), 
      {}
    );
    setTouched(allTouched);
    
    // Validate all fields
    const validationErrors = validateBike(fields);
    setFieldErrors(validationErrors);
    
    // If we have validation errors, don't submit
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setLoading(true);
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/bikes/${id}` : '/bikes';
      await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
      });
      navigate('/my-listings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        {isEdit ? 'Edit' : 'Add'} Bike
      </h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <FormInput 
            label="Brand" 
            value={fields.brand} 
            onChange={v => handleChange('brand', v)} 
            onBlur={() => handleBlur('brand')}
            error={touched.brand ? fieldErrors.brand : null}
            required 
          />
          <FormInput 
            label="Model" 
            value={fields.model} 
            onChange={v => handleChange('model', v)}
            onBlur={() => handleBlur('model')}
            error={touched.model ? fieldErrors.model : null}
            required 
          />
        </div>
        
        <div className="form-grid-3">
          <FormInput 
            label="Year" 
            type="number" 
            value={fields.year} 
            onChange={v => handleChange('year', v)} 
            onBlur={() => handleBlur('year')}
            error={touched.year ? fieldErrors.year : null}
            required 
            min={1900} 
          />
          <FormInput 
            label="Price (₹)" 
            type="number" 
            value={fields.price} 
            onChange={v => handleChange('price', v)}
            onBlur={() => handleBlur('price')}
            error={touched.price ? fieldErrors.price : null}
            required 
            min={0} 
          />
          <FormInput 
            label="KMs Driven" 
            type="number" 
            value={fields.kilometers_driven} 
            onChange={v => handleChange('kilometers_driven', v)}
            onBlur={() => handleBlur('kilometers_driven')}
            error={touched.kilometers_driven ? fieldErrors.kilometers_driven : null}
            required 
            min={0} 
          />
        </div>
        
        <FormInput 
          label="Location" 
          value={fields.location} 
          onChange={v => handleChange('location', v)}
          onBlur={() => handleBlur('location')}
          error={touched.location ? fieldErrors.location : null}
          required 
        />
        <FormInput 
          label="Image URL" 
          value={fields.image_url} 
          onChange={v => handleChange('image_url', v)}
          onBlur={() => handleBlur('image_url')}
          error={touched.image_url ? fieldErrors.image_url : null}
          type="url" 
          placeholder="https://example.com/image.jpg" 
        />
        
        <div className="button-group">
          <button 
            type="button" 
            onClick={() => navigate('/my-listings')}
            className="btn secondary-btn"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn primary-btn"
            disabled={loading}
          >
            {loading ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Bike')}
          </button>
        </div>
      </form>
      
      {isEdit && fields.image_url && (
        <div className="image-preview-container">
          <h3 className="image-preview-title">Current Image</h3>
          <div className="image-preview" style={{ backgroundImage: `url(${fields.image_url})` }}></div>
        </div>
      )}
    </div>
  );
}
