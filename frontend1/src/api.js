import axios from 'axios';

export const BASE_URL = 'http://localhost:5001';
export const API_URL = `${BASE_URL}/api`;
export const UPLOADS_URL = `${BASE_URL}/uploads`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper for image URLs
export const getImageUrl = (url, defaultValue = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop") => {
    if (!url) return defaultValue;
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
    return `${BASE_URL}/uploads/${url.replace(/\\/g, '/')}`;
};

export default api;
