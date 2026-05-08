import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Layout,
    FileText,
    Image,
    Menu,
    ChevronRight,
    Globe,
    CheckCircle,
    ShieldCheck,
    HardDrive,
    Zap,
    ExternalLink,
    Clock,
    Sparkles,
    ArrowUpRight
} from 'lucide-react';

const QuickActionCard = ({ icon: Icon, title, description, path, color }) => (
    <Link
        to={path}
        className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
    >
        <div className="flex items-start justify-between mb-6">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100 transition-colors group-hover:scale-110 duration-500`}>
                <Icon size={28} style={{ color }} />
            </div>
            <div className="p-2 bg-gray-50 rounded-full text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <ArrowUpRight size={20} />
            </div>
        </div>
        <h3 className="text-xl font-black text-heading italic uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
            {title}
        </h3>
        <p className="text-text-light text-sm font-medium leading-relaxed italic">
            {description}
        </p>
    </Link>
);

const AdminDashboard = () => {
    const { school, user } = useSelector((state) => state.auth);
    const isApproved = school?.is_approved;

    const recentUpdates = [
        { title: 'Hero Section Updated', time: '2 hours ago', icon: Layout, color: '#ff9d01' },
        { title: 'New Blog Post Published', time: '5 hours ago', icon: FileText, color: '#3db2d5' },
        { title: 'Gallery Item Added', time: 'Yesterday', icon: Image, color: '#64748b' },
    ];

    return (
        <div className="space-y-10 pb-20 animate-fadeIn">
            {/* 1. Header Section */}
            <div className="relative bg-akkhor-dark p-10 rounded-[40px] shadow-2xl overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                                {school?.name || 'Command Center'}
                            </h2>
                            {isApproved && (
                                <div className="flex items-center gap-2 px-5 py-2 bg-akkhor-orange text-white rounded-full shadow-lg shadow-akkhor-orange/30 border border-white/20">
                                    <CheckCircle size={18} className="fill-white text-akkhor-orange" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Hub</span>
                                </div>
                            )}
                        </div>
                        <p className="text-blue-100/60 font-medium italic text-lg max-w-xl">
                            Welcome back, <span className="text-akkhor-orange font-bold">{user?.name}</span>. Your school management tools are ready.
                        </p>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-akkhor-orange/20 rounded-full blur-[100px] -mr-40 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
            </div>

            {/* 2. Management Hub Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <QuickActionCard
                    icon={Layout}
                    title="Hero Design"
                    description="Update primary visuals, slogans, and call-to-actions."
                    path="/school-admin/website/hero"
                    color="#ff9d01"
                />
                <QuickActionCard
                    icon={FileText}
                    title="Content"
                    description="Manage news, blog insights, and your notice board."
                    path="/school-admin/website/blogs"
                    color="#3db2d5"
                />
                <QuickActionCard
                    icon={Image}
                    title="Media Center"
                    description="Organize your school's visual gallery and creative assets."
                    path="/school-admin/website/gallery"
                    color="#64748b"
                />
                <QuickActionCard
                    icon={Menu}
                    title="Navigation"
                    description="Refine your site's structure and menu organization."
                    path="/school-admin/website/menu"
                    color="#ff007c"
                />
            </div>

            {/* 3. Bottom Row: Activity */}
            <div className="grid grid-cols-1 gap-8">
                {/* Content Modification Timeline */}
                <div className="bg-white p-10 rounded-[40px] shadow-premium border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-akkhor-orange/10 flex items-center justify-center text-akkhor-orange">
                                <Clock size={20} />
                            </div>
                            <h3 className="text-xl font-black text-heading italic uppercase tracking-tighter">Modification Loop</h3>
                        </div>
                        <span className="text-[10px] font-black italic text-akkhor-orange uppercase tracking-[0.2em]">Latest Updates</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentUpdates.map((update, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 relative overflow-hidden group hover:bg-white hover:border-primary/30 transition-all duration-300">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`} style={{ backgroundColor: `${update.color}15`, color: update.color }}>
                                    <update.icon size={20} />
                                </div>
                                <h4 className="text-sm font-black text-heading uppercase italic tracking-tight mb-1">{update.title}</h4>
                                <p className="text-[10px] font-bold text-gray-400 italic mb-2">{update.time}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 rounded-[32px] bg-akkhor-dark text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-akkhor-dark/20 relative overflow-hidden group">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 text-akkhor-orange">
                                <Sparkles />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Success Recommendation</p>
                                <p className="text-lg font-bold italic leading-tight">Fresh contents like blogs increases site SEO by 45%. Post a new update today!</p>
                            </div>
                        </div>
                        <Link to="/school-admin/website/blog/add" className="relative z-10 px-8 py-4 bg-akkhor-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg truncate">
                            Write New Post
                        </Link>
                        {/* Decorative Background for Tip */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-akkhor-orange/10 blur-[60px] rounded-full -mr-20 -mt-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
