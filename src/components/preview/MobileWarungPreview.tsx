import React from 'react';
import './MobilePreview.css';
import { Clock, MapPin } from 'lucide-react';

interface WarungPreviewData {
  name?: string;
  image?: string;
  openingTime?: string;
  closingTime?: string;
  address?: string;
  description?: string;
  tags?: string[];
}

export default function MobileWarungPreview({ data }: { data?: WarungPreviewData | null }) {
  if (!data) return null;

  return (
    <div className="mobile-view-inner">
      <div className="mobile-card">
        <div className="mobile-card-img-wrapper">
          <img
            src={data.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'}
            alt={data.name || 'Warung'}
            className="mobile-card-img"
          />
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
              <span key={i} className="mobile-tag">
                {tag}
              </span>
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
