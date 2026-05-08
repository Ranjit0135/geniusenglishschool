import axios from 'axios';



const API_URL = 'http://localhost:5000/api';
export const BASE_URL = 'http://localhost:5000';
export const UPLOADS_URL = 'http://localhost:5000/uploads';

// const API_URL = 'https://api2.geniusenglish.edu.np/api';
// export const BASE_URL = 'https://api2.geniusenglish.edu.np';
// export const UPLOADS_URL = 'https://api2.geniusenglish.edu.np/uploads';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        try {
            const persistRoot = localStorage.getItem('persist:root');
            if (persistRoot) {
                const root = JSON.parse(persistRoot);

                // Strictly use regular Admin Token for this client
                if (root.auth) {
                    const auth = JSON.parse(root.auth);
                    if (auth.accessToken) {
                        config.headers.Authorization = `Bearer ${auth.accessToken}`;
                    }
                    if (auth.school?.id) {
                        config.headers['x-school-id'] = auth.school.id;
                    }
                }
            }

            // Always add current subdomain if available
            const host = window.location.host;
            const subdomain = host.includes('.') ? host.split('.')[0] : null;
            if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
                config.headers['x-subdomain'] = subdomain;
            }

        } catch (err) {
            console.error('Error in request interceptor:', err);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Simplified (No refresh logic)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('persist:root');
            // Only redirect if not already on login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
