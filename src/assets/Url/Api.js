// src/api/axios.js
import axios from 'axios';
 
const instance = axios.create(); // no baseURL
 
// Add Accept-Language header globally
instance.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = localStorage.getItem('language') || 'en';
  return config;
});
 
export default instance;
