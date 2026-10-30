import axios from 'axios';
import { getToken, clearToken, isTokenExpired } from '../utils/auth';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
});


const PUBLIC_ENDPOINTS = ['/token/', '/token/refresh/', '/register/'];

const isPublic = (url?: string) =>
    PUBLIC_ENDPOINTS.some((endpoint) => url?.includes(endpoint));

const redirectToLogin = () => {
    clearToken();
    if (window.location.pathname !== '/login') {
        window.location.replace('/login');
    }
};

api.interceptors.request.use((config) => {
    if (isPublic(config.url)) return config;

    const token = getToken();
    if (token) {
     
        if (isTokenExpired(token, 10)) {
            redirectToLogin();
            return Promise.reject(new axios.CanceledError('Token expirado'));
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        
        if (error.response?.status === 401 && !isPublic(error.config?.url)) {
            redirectToLogin();
        }
        return Promise.reject(error);
    }
);

export default api;