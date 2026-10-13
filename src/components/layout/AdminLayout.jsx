import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { isAuthenticated } from '../../utils/auth';
import { getApplications } from '../../services/mock/applicationService';
import './AdminLayout.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingApplications, setPendingApplications] = useState([]);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const data = await getApplications();
        const pending = data.filter(item => item.status === 'Pending');
        setPendingApplications(pending);
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };

    fetchPendingCount();

    window.addEventListener('applications_updated', fetchPendingCount);
    return () => window.removeEventListener('applications_updated', fetchPendingCount);
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} pendingCount={pendingApplications.length} />
      
      <div className="admin-main">
        <Topbar onMenuClick={toggleSidebar} pendingApplications={pendingApplications} />
        
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
