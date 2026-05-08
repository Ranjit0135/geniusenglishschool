import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Archive,
    ChevronRight,
    ChevronDown,
    Menu,
    GraduationCap,
    CheckCircle,
    LogOut
} from 'lucide-react';
import { logout } from '../../redux/authSlice';

const SidebarItem = ({ icon: Icon, label, path, badge, subItems }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(path);

    return (
        <div className="w-full">
            <Link
                to={subItems ? '#' : path}
                className={`flex items-center justify-between px-6 py-4 transition-all duration-300 group ${isActive && !subItems ? 'bg-[#ff9d01] text-white' : 'text-[#a1a1a1] hover:text-white hover:bg-[#001b3a]'
                    }`}
            >
                <div className="flex items-center gap-4">
                    <Icon size={20} className={isActive ? 'text-white' : 'text-primary group-hover:text-white'} />
                    <span className="text-[15px] font-medium">{label}</span>
                </div>
                {badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isActive ? 'bg-white text-[#ff9d01]' : 'bg-[#ff9d01] text-white'
                        }`}>
                        {badge}
                    </span>
                )}
            </Link>

            {subItems && (
                <div className="bg-[#001731] py-2">
                    {subItems.map((item, idx) => {
                        const isSubActive = location.pathname === item.path;
                        return (
                            <Link
                                key={idx}
                                to={item.path}
                                className={`flex items-center gap-3 pl-14 pr-6 py-3 text-[14px] transition-colors ${isSubActive ? 'text-white bg-primary/20' : 'text-[#a1a1a1] hover:text-white hover:bg-[#001b3a]'}`}
                            >
                                <ChevronRight size={12} className={isSubActive ? 'text-primary' : 'opacity-50'} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export const menuItems = [
    {
        icon: Archive, label: 'Website Management', path: '/school-admin/website', subItems: [
            { label: 'Manage Logo', path: '/school-admin/website/logo' },
            { label: 'Menu Items', path: '/school-admin/website/menu' },
            { label: 'About Page', path: '/school-admin/website/about' },
            { label: 'Gallery', path: '/school-admin/website/gallery' },
            { label: 'News & Updates', path: '/school-admin/website/news' },
            { label: 'Blogs', path: '/school-admin/website/blogs' },
            { label: 'Events', path: '/school-admin/website/events' },
            { label: 'Hero Section', path: '/school-admin/website/hero' },
            { label: 'Principal Message', path: '/school-admin/website/principal' },
            { label: 'Parent Feedback', path: '/school-admin/website/testimonials' },
            { label: 'Courses', path: '/school-admin/website/courses' },
            { label: 'Contact Info', path: '/school-admin/website/contact' },
            { label: 'Social Links', path: '/school-admin/website/social-links' },
            { label: 'Account Settings', path: '/school-admin/website/account-settings' },
        ]
    },

];
const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { school } = useSelector((state) => state.auth);
    const isApproved = school?.is_approved;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[90] lg:hidden animate-fadeIn"
                    onClick={() => setIsMobileOpen(false)}
                ></div>
            )}

            <aside className={`fixed lg:static top-0 left-0 w-72 h-screen bg-[#001c3d] text-white flex flex-col transition-transform duration-300 z-[100] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}>
                {/* Logo Header */}
                <div className="h-20 bg-[#ff9d01] flex flex-col justify-center px-6 relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                        <Link to="/school-admin" className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg text-[#ff9d01]">
                                <GraduationCap size={24} />
                            </div>
                            <span className="text-xl font-black tracking-tight truncate max-w-[150px]">
                                {school?.name || 'Sera'}
                            </span>
                        </Link>
                        <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-white">
                            <Menu size={24} />
                        </button>
                    </div>

                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-4">
                    {menuItems.map((item, idx) => (
                        <SidebarItem key={idx} {...item} />
                    ))}
                </div>

                {/* User Status/Logout Section (Optional for Akkhor style bottom) */}
                <div className="p-6 border-t border-white/5 bg-[#001731] mt-auto">


                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-300 font-bold text-[14px] group"
                    >
                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
