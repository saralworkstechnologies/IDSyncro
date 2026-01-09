import React from 'react';

const PillButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...props 
}) => {
  const baseClass = 'btn btn-pill';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'medium' ? `btn-${size}` : '';
  const disabledClass = disabled ? 'btn-disabled' : '';
  const loadingClass = loading ? 'btn-loading' : '';
  
  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    disabledClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClass}
      disabled={disabled || loading}
      aria-label={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {loading && <span className="loading-spinner" aria-hidden="true" />}
      {icon && !loading && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
};

export default PillButton;