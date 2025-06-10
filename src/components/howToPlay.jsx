import React, { useState } from 'react';
import '../css/howToPlay.css';
import { rules, mouseControls, keyboardControls } from '../utils/howToPlay';

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
            <div className="controls-section">
              <h2 className="controls-heading">Mouse Controls</h2>
              <div className="controls-list">
                {mouseControls.map((item, idx) => (
                  <div className="control-item" key={idx}>
                    <img src={item.image} alt="Mouse control" className="control-image" />
                    <div className="control-text">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="controls-section">
              <h2 className="controls-heading">Keyboard Controls</h2>
              <div className="controls-list">
                {keyboardControls.map((item, idx) => (
                  <div className="control-item" key={idx}>
                    <img src={item.image} alt="Keyboard control" className="control-image" />
                    <div className="control-text">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rules-content">
            <ol className="rules-list">
              {rules.map((rule, idx) => (
                <li key={idx} className="rule-item">{rule}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
