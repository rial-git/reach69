import React, { useState } from 'react';
import '../css/howToPlay.css';

export default function CheckoutPage() {
  const [activeTab, setActiveTab] = useState('controls');

  return (
    <div className="checkout-page">  
          <div className="tab-title">
            {activeTab === 'controls' ? 'CONTROLS TO' : 'RULES TO'}<br />
          </div>
          <div className="tab-buttons">
            <button
              className={activeTab === 'controls' ? 'active' : ''}
              onClick={() => setActiveTab('controls')}
            >
              CONTROLS
            </button>
            <button
              className={activeTab === 'rules' ? 'active' : ''}
              onClick={() => setActiveTab('rules')}
            >
              RULES
            </button>
          </div>


      <div className="tab-content">
        {activeTab === 'controls' ? (
          <div className="controls-content">
            <div className="block">
              <div className="text">Text</div>
              <div className="gif">GIF</div>
              <div className="paragraph">Text Text Text Text Text Text Text Text Text Text</div>
            </div>
            <div className="block">
              <div className="text">Text</div>
              <div className="gif">GIF</div>
            </div>
          </div>
        ) : (
          <div className="rules-content">
            <div className="rules-text">ITHU ALOIKANAM</div>
          </div>
        )}
      </div>
    </div>
  );
}
