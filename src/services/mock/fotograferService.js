import { initialFotografer } from '../../data/mock/fotograferMock';

const STORAGE_KEY = 'bedengan_xplore_admin_fotografers';

const getStorageData = () => {
  if (typeof window === 'undefined') return initialFotografer;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFotografer));
    return initialFotografer;
  }
  return JSON.parse(data);
};

const setStorageData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const getFotografers = () => Promise.resolve(getStorageData());

export const getFotograferById = (id) => {
  const data = getStorageData();
  const fotografer = data.find(item => item.id === id);
  return Promise.resolve(fotografer || null);
};

export const createFotografer = (fotograferData) => {
  const data = getStorageData();
  const newFotografer = {
    ...fotograferData,
    id: Date.now().toString(),
    updatedAt: new Date().toISOString()
  };
  setStorageData([...data, newFotografer]);
  return Promise.resolve(newFotografer);
};

export const updateFotografer = (id, fotograferData) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index] = { ...data[index], ...fotograferData, updatedAt: new Date().toISOString() };
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Fotografer not found'));
};

export const deleteFotografer = (id) => {
  const data = getStorageData();
  const filtered = data.filter(item => item.id !== id);
  setStorageData(filtered);
  return Promise.resolve(true);
};

export const toggleFotograferStatus = (id) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index].status = data[index].status === 'active' ? 'inactive' : 'active';
    data[index].updatedAt = new Date().toISOString();
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Fotografer not found'));
};
