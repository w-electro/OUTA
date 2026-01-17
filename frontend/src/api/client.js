import axios from 'axios';

const authClient = axios.create({
  baseURL: '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

const financeClient = axios.create({
  baseURL: '/api/finance',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
const addAuthToken = (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authClient.interceptors.request.use(addAuthToken);
financeClient.interceptors.request.use(addAuthToken);

// Auth API
export const authAPI = {
  register: (data) => authClient.post('/register', data),
  login: (data) => authClient.post('/login', data),
  getMe: () => authClient.get('/me'),
  logout: () => authClient.post('/logout'),
};

// Finance API
export const financeAPI = {
  createInvoice: (data) => financeClient.post('/invoices', data),
  getInvoices: (params) => financeClient.get('/invoices', { params }),
  getInvoice: (id) => financeClient.get(`/invoices/${id}`),
  approveInvoice: (id) => financeClient.put(`/invoices/${id}/approve`),
  submitToZATCA: (id) => financeClient.post(`/invoices/${id}/submit-zatca`),
  recordPayment: (id, data) => financeClient.post(`/invoices/${id}/payment`, data),
  getRevenueReport: (params) => financeClient.get('/reports/revenue', { params }),
};
