import { BASE_URL } from '../api';

export const getImageUrl = (url, defaultValue = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80") => {
    if (!url) return defaultValue;
    if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
    // If it's a backend path like uploads\..., replace \ with / and prepend base URL
    return `${BASE_URL}/${url.replace(/\\/g, '/')}`;
};
