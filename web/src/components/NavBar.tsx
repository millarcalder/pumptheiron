import React from 'react';

interface NavBarProps {
  onAddCard: () => void;
  triggerExport: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onAddCard, triggerExport }) => {
  return (
    <div
      style={{
        background: '#222',
        color: '#fff',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <img src="/gym.svg" alt="Logo" style={{ height: '40px', marginRight: '1rem' }} />
      <span>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
          onClick={onAddCard}
        >
          <img src="/icons/plus-circle-white.svg" alt="Add Card" style={{ height: '24px' }} />
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
          onClick={triggerExport}
        >
          <img src="/icons/download-circle-white.svg" alt="Export" style={{ height: '24px' }} />
        </button>
      </span>
    </div>
  );
};

export default NavBar;
