import React from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, minWidth: 300 }}>
        <button onClick={onClose} style={{ float: 'right' }}>
          Close
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
