import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создание экземпляра axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nakawin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nakawin_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// API методы
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
};

export const casesAPI = {
  getAll: () => api.get('/cases'),
  open: (caseId) => api.post(`/cases/${caseId}/open`),
  savePrize: (prize) => api.post('/cases/save-prize', { prize }),
  sellPrize: (prize) => api.post('/cases/sell-prize', { prize }),
};

export const wheelAPI = {
  get: () => api.get('/wheel'),
  spin: () => api.post('/wheel/spin'),
  savePrize: (prize) => api.post('/wheel/save-prize', { prize }),
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  sell: (itemId) => api.post(`/inventory/${itemId}/sell`),
  withdraw: (itemId) => api.post(`/inventory/${itemId}/withdraw`),
};

export const paymentAPI = {
  createPayment: (amount) => api.post('/payment/create-payment', { amount }),
  getPaymentStatus: (paymentId) => api.get(`/payment/payment-status/${paymentId}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats/users'),
  getUsers: () => api.get('/admin/users'),
  banUser: (userId) => api.post(`/admin/users/${userId}/ban`),
  makeAdmin: (userId) => api.post(`/admin/users/${userId}/make-admin`),
  getCases: () => api.get('/admin/cases'),
  createCase: (caseData) => api.post('/admin/cases', caseData),
  updateCase: (caseId, caseData) => api.put(`/admin/cases/${caseId}`, caseData),
  getWheel: () => api.get('/admin/wheel'),
  updateWheel: (wheelId, wheelData) => api.put(`/admin/wheel/${wheelId}`, wheelData),
};

export { api };