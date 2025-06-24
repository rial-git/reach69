import React, { useState } from 'react';
import '../css/howToPlay.css';
import '../css-mob/howToPlayMob.css';
import { rules, mouseControls, keyboardControls } from '../utils/howToPlayInfo';

export default function HowToPlayPage() {
  const [activeTab, setActiveTab] = useState('controls');
  const [fade, setFade] = useState(false);

  const handleTabSwitch = (tab) => {
    setFade(true); // Start fade-out
    setTimeout(() => {
      setActiveTab(tab);
      setFade(false); // Fade-in new tab
    }, 150); // Duration must match CSS transition
  };

  return (
    <div className="checkout-page">
      <div className="tab-title">
        <span className="tab-title-text">
          {activeTab === 'controls' ? 'CONTROLS TO REACH' : 'RULES TO REACH'}
          <img src="/r69logo.svg" alt="Reach69 Logo" className="tab-logo" loading="lazy" />
        </span>
        <br />
      </div>

      <div className="tab-buttons">
        <button
          className={activeTab === 'controls' ? 'active' : ''}
          onClick={() => handleTabSwitch('controls')}
        >
          CONTROLS
        </button>
        <button
          className={activeTab === 'rules' ? 'active' : ''}
          onClick={() => handleTabSwitch('rules')}
        >
          RULES
        </button>
      </div>

      <div className={`tab-content ${fade ? 'fade' : ''}`}>
        {activeTab === 'controls' ? (
          <div className="controls-content">
            <div className="controls-section">
              <h2 className="controls-heading">Mouse Controls</h2>
              <div className="controls-list">
                {mouseControls.map((item, idx) => (
                  <div className="control-item" key={idx}>
                    <img src={item.image} alt="Mouse control" className="control-image" loading="lazy" />
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
                    <div className="control-icon-text">{item.icon}</div>
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
