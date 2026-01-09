import React from 'react';
import './ResponsiveContainer.css';

const ResponsiveContainer = ({ 
  children, 
  fullBleed = false, 
  className = '',
  ...props 
}) => {
  const containerClass = fullBleed 
    ? `responsive-container-full ${className}`.trim()
    : `responsive-container ${className}`.trim();

  return (
    <div className={containerClass} {...props}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;