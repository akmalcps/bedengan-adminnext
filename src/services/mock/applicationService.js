import { initialApplication } from '../../data/mock/applicationMock';

const STORAGE_KEY = 'bedengan_xplore_admin_applications';

const getStorageData = () => {
  if (typeof window === 'undefined') return initialApplication;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialApplication));
    return initialApplication;
  }
  return JSON.parse(data);
};

const setStorageData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('applications_updated'));
  }
};

export const getApplications = () => Promise.resolve(getStorageData());

export const getApplicationById = (id) => {
  const data = getStorageData();
  const application = data.find(item => item.id === id);
  return Promise.resolve(application || null);
};

export const approveApplication = (id) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index] = { ...data[index], status: 'Approved', updatedAt: new Date().toISOString() };
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Application not found'));
};

export const rejectApplication = (id, reason) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index] = { ...data[index], status: 'Rejected', rejectionReason: reason, updatedAt: new Date().toISOString() };
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Application not found'));
};
