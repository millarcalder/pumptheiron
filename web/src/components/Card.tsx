import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, style, className, ...rest }) => {
  return (
    <div style={{ ...styles, ...style }} className={className} {...rest}>
      {children}
    </div>
  );
};

const styles = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: '16px',
  boxSizing: 'border-box' as const,
  backgroundColor: '#fff',
  fontSize: '14px',
  color: '#555',
  innerHeight: '100%',
};

export default Card;
