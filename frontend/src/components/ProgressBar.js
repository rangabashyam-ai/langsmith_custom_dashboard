// src/components/ProgressBar.js
import React from 'react';

const ProgressBar = ({ value }) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#f3f3f3', borderRadius: '5px', overflow: 'hidden' }}>
      <div
        style={{
          height: '20px',
          width: `${value}%`,
          backgroundColor: '#4caf50',
          textAlign: 'center',
          lineHeight: '20px',
          color: 'white',
          borderRadius: '5px'
        }}
      >
        {value}%
      </div>
    </div>
  );
};

export default ProgressBar;
