import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    LayoutDashboard,
    Image,
    FileText,
    Settings,
    Info,
    Video,
    ChevronRight,
    X,
    ListTree,
    LogOut,
    Globe,
    MessageSquare,
    Users,
    GraduationCap,
    Calendar,
    Briefcase
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, badge, subItems, onClose }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(path);
    const [isOpen, setIsOpen] = useState(isActive);

    const handleClick = () => {
        if (subItems) {
            setIsOpen(!isOpen);
        } else if (window.innerWidth < 1024) {
            onClose();
        }
    };

    return (
        <div className="w-full">
            <Link
                to={subItems ? '#' : path}
                onClick={handleClick}
                className={`flex items-center justify-between px-6 py-4 transition-all duration-300 group ${isActive && !subItems ? 'bg-accent text-white' : 'text-[#a1a1a1] hover:text-white hover:bg-[#001b3a]'
                    }`}
            >
                <div className="flex items-center gap-4">
                    <Icon size={20} className={isActive ? 'text-white' : 'text-primary group-hover:text-white'} />
                    <span className="text-[15px] font-medium">{label}</span>
                </div>
                {subItems && (
                    <ChevronRight size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                )}
                {badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${isActive ? 'bg-white text-accent' : 'bg-accent text-white'
                        }`}>
                        {badge}
                    </span>
                )}
            </Link>

            {subItems && isOpen && (
                <div className="bg-[#001731] py-2 animate-in slide-in-from-top-2 duration-300">
                    {subItems.map((item, idx) => {
                        const isSubActive = location.pathname === item.path;
                        return (
                            <Link
                                key={idx}
                                to={item.path}
                                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                className={`flex items-center gap-3 pl-14 pr-6 py-3 text-[14px] transition-colors ${isSubActive ? 'text-white bg-primary/20' : 'text-[#a1a1a1] hover:text-white hover:bg-[#001b3a]'}`}
                            >
                                <ChevronRight size={12} className={isSubActive ? 'text-accent' : 'opacity-30'} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ isOpen, onClose }) => {
    const menuItems = [
        {
            label: 'Website Management',
            path: '/admin',
            icon: ListTree,
            subItems: [
                { label: 'Manage Logo', path: '/admin/website/logo' },
                { label: 'Menu Items', path: '/admin/website/menu' },
                { label: 'About Page', path: '/admin/about' },
                { label: 'Gallery', path: '/admin/gallery' },
                { label: 'News & Updates', path: '/admin/news' },
                { label: 'Blogs', path: '/admin/blogs' },
                { label: 'Events', path: '/admin/events' },
                { label: 'Hero Section', path: '/admin/hero' },
                { label: 'Contact Info', path: '/admin/contact' },
                { label: 'Account Settings', path: '/admin/account' },
            ]
        },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#001c3d] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
            {/* Logo Header - Exact Reference Spec */}
            <div className="h-20 bg-accent flex flex-col justify-center px-6 relative overflow-hidden">
                <div className="flex items-center justify-between z-10">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-accent shadow-sm">
                            <GraduationCap size={24} />
                        </div>
                        <span className="text-xl font-black tracking-tight truncate max-w-[150px] uppercase italic">
                            GENIUS School
                        </span>
                    </Link>
                    <button onClick={onClose} className="lg:hidden text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto no-scrollbar py-4 font-base">
                {menuItems.map((item, idx) => (
                    <SidebarItem key={idx} {...item} onClose={onClose} />
                ))}
            </div>

            {/* Logout Footer - Exact Reference Spec */}
            <div className="p-6 border-t border-white/5 bg-[#001731] mt-auto">
                <button
                    onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-50 text-red-500 hover:text-white rounded-xl transition-all duration-300 font-bold text-[14px] group"
                >
                    <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

// Placeholder for missing User icon in lucide
const UserIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default Sidebar;
