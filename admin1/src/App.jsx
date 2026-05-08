import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import ContactPage from './pages/Contact';
import ManageHero from './pages/Hero';
import AboutPage from './pages/About';
import NewsPage from './pages/News';
import GalleryPage from './pages/Gallery';
import ManageLogo from './pages/ManageLogo';
import ManageMenu from './pages/ManageMenu';
import BlogsPage from './pages/Blogs';
import EventsPage from './pages/Events';
import NavbarPage from './pages/Navbar';
import AccountSettings from './pages/AccountSettings';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const handleStorageChange = () => setToken(localStorage.getItem('token'));
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/admin" />} />
                <Route path="/admin" element={token ? <DashboardLayout /> : <Navigate to="/login" />}>
                    <Route index element={<Navigate to="/admin/website/logo" replace />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="hero" element={<ManageHero />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="news" element={<NewsPage />} />
                    <Route path="blogs" element={<BlogsPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="gallery" element={<GalleryPage />} />
                    <Route path="website">
                        <Route path="logo" element={<ManageLogo />} />
                        <Route path="menu" element={<ManageMenu />} />
                    </Route>
                    <Route path="account" element={<AccountSettings />} />
                    <Route path="navbar" element={<Navigate to="/admin/website/logo" replace />} />
                    {/* Future management modules will go here */}
                </Route>
                <Route path="/" element={<Navigate to="/admin" />} />
            </Routes>
        </Router>
    );
}

export default App;
