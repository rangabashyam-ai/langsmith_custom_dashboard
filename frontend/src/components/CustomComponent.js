// src/components/CustomComponent.js
import React from 'react';

function CustomComponent({ text = 'Default text', ...props }) {
  return <div>{text}</div>;
}

export default CustomComponent;
