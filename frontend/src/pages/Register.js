

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import FormInput from '../components/FormInput';
import { apiFetch } from '../api';
import { validateRegistration, isValidEmail, isValidPassword, passwordsMatch } from '../utils/validation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validate fields on change when they've been touched
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const errors = validateRegistration({ email, password, confirm });
      setFieldErrors(errors);
    }
  }, [email, password, confirm, touched]);

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched for full validation
    setTouched({ email: true, password: true, confirm: true });
    
    // Validate all fields
    const errors = validateRegistration({ email, password, confirm });
    setFieldErrors(errors);
    
    // If we have validation errors, don't submit
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      // Auto-login after registration
      const loginData = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      login(loginData.user, loginData.token);
      navigate('/my-listings');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-form-title">Create an Account</h2>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormInput 
          label="Email" 
          type="email" 
          value={email} 
          onChange={setEmail} 
          onBlur={() => handleBlur('email')}
          error={touched.email ? fieldErrors.email : null}
          required 
        />
        <FormInput 
          label="Password" 
          type="password" 
          value={password} 
          onChange={setPassword} 
          onBlur={() => handleBlur('password')}
          error={touched.password ? fieldErrors.password : null}
          required 
        />
        <FormInput 
          label="Confirm Password" 
          type="password" 
          value={confirm} 
          onChange={setConfirm} 
          onBlur={() => handleBlur('confirm')}
          error={touched.confirm ? fieldErrors.confirm : null}
          required 
        />
        <button 
          type="submit" 
          className="btn primary-btn btn-full"
        >
          Register
        </button>
      </form>
      <div className="auth-form-footer">
        Already have an account? <a href="/login" className="auth-link">Login</a>
      </div>
    </div>
  );
}
