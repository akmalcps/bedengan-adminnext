'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UtensilsCrossed, Tent, Camera, ClipboardList, Plus, ChevronRight } from 'lucide-react';
import { getDashboardStats, getPendingApplications, getRecentActivities } from '@/src/services/mock/dashboardService';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalWarung: 0, totalRental: 0, totalFotografer: 0, pendingPendaftaran: 0 });
  const [pendingApps, setPendingApps] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, appsData, activitiesData] = await Promise.all([
          getDashboardStats(),
          getPendingApplications(),
          getRecentActivities()
        ]);
        
        setStats(statsData);
        setPendingApps(appsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading" style={{ color: 'var(--color-forest)', padding: '2rem 0' }}>Memuat Dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Kelola dan pantau ekosistem Bedengan Xplore.</p>
      </div>

      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(133, 187, 69, 0.1)', color: 'var(--color-primary)' }}>
            <UtensilsCrossed size={24} />
          </div>
          <div className="stat-card-info">
            <h3>Total Warung & Kuliner</h3>
            <p>{stats.totalWarung}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(28, 43, 32, 0.1)', color: 'var(--color-forest)' }}>
            <Tent size={24} />
          </div>
          <div className="stat-card-info">
            <h3>Total Rental</h3>
            <p>{stats.totalRental}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(74, 92, 80, 0.1)', color: 'var(--color-text-secondary)' }}>
            <Camera size={24} />
          </div>
          <div className="stat-card-info">
            <h3>Total Fotografer</h3>
            <p>{stats.totalFotografer}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 166, 35, 0.1)', color: 'var(--color-warning)' }}>
            <ClipboardList size={24} />
          </div>
          <div className="stat-card-info">
            <h3>Pendaftaran Pending</h3>
            <p>{stats.pendingPendaftaran}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => router.push('/admin/warung/create')}>
            <Plus size={18} /> Tambah Warung
          </button>
          <button className="action-btn" onClick={() => router.push('/admin/rental/create')}>
            <Plus size={18} /> Tambah Rental
          </button>
          <button className="action-btn" onClick={() => router.push('/admin/fotografer/create')}>
            <Plus size={18} /> Tambah Fotografer
          </button>
          <button className="action-btn btn-secondary" onClick={() => router.push('/admin/pendaftaran')}>
            <ClipboardList size={18} /> Review Pendaftaran
          </button>
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Pendaftaran Menunggu Review</h3>
            <Link href="/admin/pendaftaran" className="view-all">Lihat Semua</Link>
          </div>
          <div className="section-content card">
            {pendingApps.length > 0 ? (
              <ul className="pending-list">
                {pendingApps.map(app => (
                  <li key={app.id} className="pending-item">
                    <div className="pending-info">
                      <h4>{app.businessName}</h4>
                      <p>{app.category} • {new Date(app.submittedAt).toLocaleDateString('id-ID')}</p>
                    </div>
                    <button className="review-btn" onClick={() => router.push(`/admin/pendaftaran/${app.id}`)}>
                      Review <ChevronRight size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <p>Tidak ada pendaftaran baru saat ini.</p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Aktivitas Terbaru</h3>
          </div>
          <div className="section-content card">
            <ul className="activity-list">
              {activities.map(act => (
                <li key={act.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-details">
                    <p className="activity-message">{act.message}</p>
                    <span className="activity-time">{act.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
