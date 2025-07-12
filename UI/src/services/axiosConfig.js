import axios from 'axios';
import store from '../store/store';
import { removeAuthProfile } from '../store/auth/action';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403) {
        localStorage.removeItem('token');
        store.dispatch(removeAuthProfile())
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );

export default api;
