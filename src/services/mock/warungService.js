import { initialWarung } from '../../data/mock/warungMock';

const STORAGE_KEY = 'bedengan_xplore_admin_warungs';

const getStorageData = () => {
  if (typeof window === 'undefined') return initialWarung;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialWarung));
    return initialWarung;
  }
  return JSON.parse(data);
};

const setStorageData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const getWarungs = () => {
  return Promise.resolve(getStorageData());
};

export const getWarungById = (id) => {
  const data = getStorageData();
  const warung = data.find(item => item.id === id);
  return Promise.resolve(warung || null);
};

export const createWarung = (warungData) => {
  const data = getStorageData();
  const newWarung = {
    ...warungData,
    id: Date.now().toString(),
    updatedAt: new Date().toISOString()
  };
  setStorageData([...data, newWarung]);
  return Promise.resolve(newWarung);
};

export const updateWarung = (id, warungData) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index] = { ...data[index], ...warungData, updatedAt: new Date().toISOString() };
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Warung not found'));
};

export const deleteWarung = (id) => {
  const data = getStorageData();
  const filtered = data.filter(item => item.id !== id);
  setStorageData(filtered);
  return Promise.resolve(true);
};

export const toggleWarungStatus = (id) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index].status = data[index].status === 'active' ? 'inactive' : 'active';
    data[index].updatedAt = new Date().toISOString();
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Warung not found'));
};
