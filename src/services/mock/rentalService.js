import { initialRental } from '../../data/mock/rentalMock';

const STORAGE_KEY = 'bedengan_xplore_admin_rentals';

const getStorageData = () => {
  if (typeof window === 'undefined') return initialRental;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRental));
    return initialRental;
  }
  return JSON.parse(data);
};

const setStorageData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const getRentals = () => Promise.resolve(getStorageData());

export const getRentalById = (id) => {
  const data = getStorageData();
  const rental = data.find(item => item.id === id);
  return Promise.resolve(rental || null);
};

export const createRental = (rentalData) => {
  const data = getStorageData();
  const newRental = {
    ...rentalData,
    id: Date.now().toString(),
    updatedAt: new Date().toISOString()
  };
  setStorageData([...data, newRental]);
  return Promise.resolve(newRental);
};

export const updateRental = (id, rentalData) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index] = { ...data[index], ...rentalData, updatedAt: new Date().toISOString() };
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Rental not found'));
};

export const deleteRental = (id) => {
  const data = getStorageData();
  const filtered = data.filter(item => item.id !== id);
  setStorageData(filtered);
  return Promise.resolve(true);
};

export const toggleRentalStatus = (id) => {
  const data = getStorageData();
  const index = data.findIndex(item => item.id === id);
  
  if (index !== -1) {
    data[index].status = data[index].status === 'active' ? 'inactive' : 'active';
    data[index].updatedAt = new Date().toISOString();
    setStorageData(data);
    return Promise.resolve(data[index]);
  }
  return Promise.reject(new Error('Rental not found'));
};
