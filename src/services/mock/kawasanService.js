import { initialKawasan } from '../../data/mock/kawasanMock';

const STORAGE_KEY = 'bedengan_xplore_admin_kawasan';

const getStorageData = () => {
  if (typeof window === 'undefined') return initialKawasan;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialKawasan));
    return initialKawasan;
  }
  return JSON.parse(data);
};

const setStorageData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const getKawasans = () => Promise.resolve(getStorageData());

export const getKawasanById = (id) => {
  const data = getStorageData();
  const kawasan = data.find(item => item.id === id);
  return Promise.resolve(kawasan || null);
};

export const updateKawasan = (id, kawasanData) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index] = { ...data[index], ...kawasanData };
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Kawasan not found'));
};

export const toggleKawasanStatus = (id) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index].status = data[index].status === 'active' ? 'inactive' : 'active';
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Kawasan not found'));
};
