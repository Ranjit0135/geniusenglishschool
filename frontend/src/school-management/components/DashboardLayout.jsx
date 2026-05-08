import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar, { menuItems } from './Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Mail, ChevronDown, Menu, Globe, ExternalLink, LogOut } from 'lucide-react';
import { logout } from '../../redux/authSlice';

const DashboardLayout = ({ children }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, school } = useSelector((state) => state.auth);
    const location = useLocation();
    const isApproved = school?.is_approved;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const getActiveLabel = () => {
        if (location.pathname === '/school-admin') return 'Overview';
        for (const item of menuItems) {
            if (item.path === location.pathname) return item.label;
            if (item.subItems) {
                const subItem = item.subItems.find(si => si.path === location.pathname);
                if (subItem) return subItem.label;
            }
        }
        return 'Dashboard';
    };

    const activeLabel = getActiveLabel();

    return (
        <div className="flex h-screen bg-[#f0f1f3] font-sans scroll-smooth">
            {/* Sidebar */}
            <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white shadow-header border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-[80]">
                    {/* Left: Search & Menu Toggle */}
                    <div className="flex items-center gap-6 ml-7 flex-1">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="text-gray-500 lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <span className="text-[20px] font-bold text-gray-800">{activeLabel}</span>
                    </div>

                    {/* Right: Notifications, Messaging, Profile */}
                    <div className="flex items-center gap-3 sm:gap-6">


                        {/* Status Badge */}
                        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100 shadow-sm shadow-green-100/50">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified </span>
                        </div>



                        {/* Vertical Divider */}
                        <div className="w-[1px] h-8 bg-gray-200 hidden sm:block"></div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 group p-1.5 px-3 rounded-xl transition-all relative">
                            <div className="text-right hidden sm:block">
                                <p className="text-[14px] font-bold text-gray-800 leading-none">{user?.name || school?.name || 'Administrator'}</p>
                                <p className="text-[11px] text-[#a1a1a1] uppercase font-bold mt-1 tracking-wider">{user?.role || 'Admin'}</p>
                            </div>
                            <div className="relative cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3db2d5] to-[#192f59] flex items-center justify-center font-black text-white border-2 border-white shadow-md ring-1 ring-gray-100 group-hover:ring-primary/20 transition-all overflow-hidden uppercase tracking-tighter">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[18px] drop-shadow-md">{user?.name?.charAt(0) || 'A'}</span>
                                    )}
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>

                            {/* Dropdown/Logout Overlay */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] translate-y-2 group-hover:translate-y-0">
                                <div className="px-4 py-2 border-b border-gray-50 mb-1 sm:hidden">
                                    <p className="text-[13px] font-bold text-gray-800">{user?.name || school?.name || 'Administrator'}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-black">{user?.role}</p>
                                </div>
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

                {/* Dashboard Scrollable Area */}
                <main className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#f0f1f3]">
                    <div className="container mx-auto max-w-[1400px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
