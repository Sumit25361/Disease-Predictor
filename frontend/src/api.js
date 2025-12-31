import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Warn if accessing production without VITE_API_URL
if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    console.warn('WARNING: VITE_API_URL is not set. API calls usually default to localhost which will fail on deployed sites.');
}

API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export default API;
