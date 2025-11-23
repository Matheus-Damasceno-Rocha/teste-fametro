import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const isGuest = user ? JSON.parse(user).isGuest : false;
    
    // Só adiciona token se não for visitante
    if (token && !isGuest) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const user = localStorage.getItem('user');
    const isGuest = user ? JSON.parse(user).isGuest : false;
    
    // Só redireciona para login se não for visitante e der erro 401
    if (error.response?.status === 401 && !isGuest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
