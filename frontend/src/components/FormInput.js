import React from 'react';

export default function FormInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error = null,
  onBlur = null,
  ...props 
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
