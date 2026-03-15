import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true  // ← sends cookies automatically with every request
});

// No more manual token injection needed!
// Cookie is sent automatically by the browser

// Auto logout if token expires
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('expensioUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;