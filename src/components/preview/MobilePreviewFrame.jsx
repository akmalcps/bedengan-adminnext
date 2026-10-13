import React from 'react';
import './MobilePreviewFrame.css';

export default function MobilePreviewFrame({ children, title = 'Bedengan Xplore' }) {
  return (
    <div className="mobile-preview-container">
      <div className="mobile-device">
        <div className="mobile-notch"></div>
        <div className="mobile-status-bar">
          <span>9:41</span>
          <div className="status-icons">
            <span className="icon-signal"></span>
            <span className="icon-wifi"></span>
            <span className="icon-battery"></span>
          </div>
        </div>
        <div className="mobile-app-bar">
          <button className="back-btn">&larr;</button>
          <span className="app-title">{title}</span>
          <span className="empty-space"></span>
        </div>
        <div className="mobile-content">
          {children}
        </div>
      </div>
    </div>
  );
}
