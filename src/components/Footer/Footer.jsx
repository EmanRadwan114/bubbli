import React, { useState } from 'react';
import LoadingButton from '../LoadingButton/LoadingButton';

const Footer = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert("Operation completed!");
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <LoadingButton 
        loading={loading} 
        onClick={handleClick}
      >
        Save Changes
      </LoadingButton>
    </div>
  );
};

export default Footer;