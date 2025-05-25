// components/ErrorMessage.jsx
import React from 'react';
import { ACTIONS } from './constants';

export default function ErrorMessage({ error, dispatch }) {
  return (
    error && (
      <div className="error-message" onClick={() => dispatch({ type: ACTIONS.CLEAR_ERROR })}>
        {error}
      </div>
    )
  );
}