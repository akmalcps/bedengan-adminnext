import React from 'react';
import './MobilePreview.css';
import { Tent } from 'lucide-react';

interface AreaPreviewData {
  number?: string | number;
  name?: string;
  description?: string;
  capacity?: string | number;
  image?: string;
  facilities?: string[];
}

export default function MobileAreaPreview({ data }: { data?: AreaPreviewData | null }) {
  if (!data) return null;

  return (
    <div className="mobile-view-inner">
      <div className="mobile-card" style={{ padding: 0 }}>
        <div className="mobile-card-img-wrapper" style={{ height: '250px' }}>
          <img
            src={data.image || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400'}
            alt={data.name || 'Area'}
            className="mobile-card-img"
          />
          <div className="mobile-time-badge" style={{ bottom: '1rem', right: '1rem', left: 'auto' }}>
            No. {data.number}
          </div>
        </div>

        <div className="mobile-card-body">
          <h3 className="mobile-card-title">{data.name}</h3>

          <p className="mobile-card-desc" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            {data.description}
          </p>

          <div
            style={{
              background: 'var(--color-background)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
            }}
          >
            <h4
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-forest)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Tent size={16} /> Info Area
            </h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ color: 'var(--color-text-secondary)' }}>Kapasitas</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  {data.capacity}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Fasilitas Terdekat:
              </span>
              <div className="mobile-tag-list">
                {data.facilities?.map((facility, i) => (
                  <span key={i} className="mobile-tag">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
