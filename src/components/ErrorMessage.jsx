// components/ErrorMessage.jsx
import React, { useEffect, useState } from 'react';
import { ACTIONS } from '../utils/constants';

export default function ErrorMessage({ error, dispatch }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (error) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        dispatch({ type: ACTIONS.CLEAR_ERROR });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div 
      className={`error-toast ${show ? 'show' : ''}`}
      onClick={() => {
        setShow(false);
        dispatch({ type: ACTIONS.CLEAR_ERROR });
      }}
    >
      <div className="toast-content">
        <svg 
          className="error-icon" 
          viewBox="0 0 24 24" 
          width="20" 
          height="20"
        >
          <path 
            fill="currentColor" 
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
          />
        </svg>
        <span>{error}</span>
        <button className="close-button">
          ×
        </button>
      </div>
    </div>
  );
}