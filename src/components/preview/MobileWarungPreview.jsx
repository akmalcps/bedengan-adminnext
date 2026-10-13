import React from 'react';
import './MobilePreview.css';
import { Clock, MapPin } from 'lucide-react';

export default function MobileWarungPreview({ data }) {
  if (!data) return null;

  return (
    <div className="mobile-view-inner">
      <div className="mobile-card">
        <div className="mobile-card-img-wrapper">
          <img src={data.image || 'https://via.placeholder.com/400x300'} alt={data.name} className="mobile-card-img" />
          <div className="mobile-time-badge">
            <Clock size={12} /> {data.openingTime} - {data.closingTime}
          </div>
        </div>
        
        <div className="mobile-card-body">
          <h3 className="mobile-card-title">{data.name}</h3>
          
          <div className="mobile-card-address">
            <MapPin size={12} /> {data.address}
          </div>

          <p className="mobile-card-desc">{data.description}</p>
          
          <div className="mobile-tag-list">
            {data.tags?.map((tag, i) => (
              <span key={i} className="mobile-tag">{tag}</span>
            ))}
          </div>

          <button className="mobile-btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
            Hubungi via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
