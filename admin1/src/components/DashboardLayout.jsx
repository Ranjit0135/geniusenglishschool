import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LogOut, User as UserIcon, Menu, X, Bell, Settings } from 'lucide-react';

const DashboardLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const menuItems = [
        { label: 'Manage Logo', path: '/admin/website/logo' },
        { label: 'Menu Items', path: '/admin/website/menu' },
        { label: 'About Page', path: '/admin/about' },
        { label: 'Gallery', path: '/admin/gallery' },
        { label: 'News & Updates', path: '/admin/news' },
        { label: 'Blogs', path: '/admin/blogs' },
        { label: 'Events', path: '/admin/events' },
        { label: 'Hero Section', path: '/admin/hero' },
        { label: 'Principal Message', path: '/admin/principal' },
        { label: 'Parent Feedback', path: '/admin/feedback' },
        { label: 'Courses', path: '/admin/courses' },
        { label: 'Contact Info', path: '/admin/contact' },
        { label: 'Account Settings', path: '/admin/account' },
    ];

    const getActiveLabel = () => {
        const currentItem = menuItems.find(item => item.path === location.pathname);
        return currentItem ? currentItem.label : 'Admin Console';
    };

    const activeLabel = getActiveLabel();

    return (
        <div className="flex h-screen bg-[#f0f1f3] font-base scroll-smooth">
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header - Exact Reference Spec */}
                <header className="h-20 bg-white shadow-header border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-[80]">
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-gray-500 lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="text-[20px] font-bold text-gray-800">{activeLabel}</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        {/* Status Badge */}
                        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100 shadow-sm shadow-green-100/50">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified </span>
                        </div>

                        <div className="w-[1px] h-8 bg-gray-200 hidden sm:block"></div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 group p-1.5 px-3 rounded-xl transition-all relative">
                            <div className="text-right hidden sm:block">
                                <p className="text-[14px] font-bold text-gray-800 leading-none">Alok Admin</p>
                                <p className="text-[11px] text-[#a1a1a1] uppercase font-bold mt-1 tracking-wider">Super Admin</p>
                            </div>
                            <div className="relative cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary border-2 border-white shadow-sm ring-1 ring-gray-100 group-hover:ring-primary/20 transition-all overflow-hidden">
                                    <span>A</span>
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>

                            {/* Dropdown/Logout Overlay */}
                            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] translate-y-2 group-hover:translate-y-0 overflow-hidden">
                                <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Admin Control</p>
                                </div>
                                <button
                                    onClick={() => window.location.href = '/admin/account'}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-sm"
                                >
                                    <Settings size={16} className="text-primary" />
                                    Account Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#f0f1f3]">
                    <div className="container mx-auto max-w-[1400px]">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;
