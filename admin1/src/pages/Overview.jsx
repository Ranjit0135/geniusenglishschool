import { LayoutDashboard, Users, FileText, Image as ImageIcon, ArrowRight, ExternalLink, Clock, Sparkles, Layout, Menu, ArrowUpRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActionCard = ({ icon: Icon, title, description, path, color }) => (
    <Link
        to={path}
        className="group bg-white p-8 rounded-[32px] border border-gray-100 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
    >
        <div className="flex items-start justify-between mb-6">
            <div className={`p-4 rounded-2xl transition-colors group-hover:scale-110 duration-500`} style={{ backgroundColor: `${color}15` }}>
                <Icon size={28} style={{ color }} />
            </div>
            <div className="p-2 bg-gray-50 rounded-full text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <ArrowUpRight size={20} />
            </div>
        </div>
        <h3 className="text-xl font-black text-primary italic uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
            {title}
        </h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed italic">
            {description}
        </p>
    </Link>
);

const Overview = () => {
    const recentUpdates = [
        { title: 'Hero Section Updated', time: '2 hours ago', icon: Layout, color: '#ff9d01' },
        { title: 'New Blog Post Published', time: '5 hours ago', icon: FileText, color: '#3db2d5' },
        { title: 'Gallery Item Added', time: 'Yesterday', icon: ImageIcon, color: '#64748b' },
    ];

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700 font-base">
            {/* 1. Header Section */}
            <div className="relative bg-[#001c3d] p-10 lg:p-14 rounded-[40px] shadow-2xl overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter decoration-orange-500 underline underline-offset-8 decoration-2">
                                Genius School Hub
                            </h2>
                            <div className="flex items-center gap-2 px-5 py-2 bg-[#ff9d01] text-white rounded-full shadow-lg shadow-[#ff9d01]/30 border border-white/20 w-fit">
                                <CheckCircle size={18} className="fill-white text-[#ff9d01]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Hub</span>
                            </div>
                        </div>
                        <p className="text-blue-100/60 font-medium italic text-lg max-w-xl">
                            Everything you need to manage Genius English School is right here. Your system is healthy and all modules are online.
                        </p>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff9d01]/10 rounded-full blur-[100px] -mr-40 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
                <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-5 hidden lg:block">
                    <LayoutDashboard size={250} className="text-white" />
                </div>
            </div>

            {/* 2. Management Hub Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <QuickActionCard
                    icon={Layout}
                    title="Hero Design"
                    description="Update primary visuals, slogans, and call-to-actions."
                    path="/admin/hero"
                    color="#ff9d01"
                />
                <QuickActionCard
                    icon={FileText}
                    title="News & Blog"
                    description="Manage current articles, blog insights, and notices."
                    path="/admin/news"
                    color="#3db2d5"
                />
                <QuickActionCard
                    icon={ImageIcon}
                    title="Media Center"
                    description="Organize your school's visual gallery and assets."
                    path="/admin/gallery"
                    color="#64748b"
                />
                <QuickActionCard
                    icon={Users}
                    title="Institutional"
                    description="Refine your institutional profile and objectives."
                    path="/admin/about"
                    color="#10b981"
                />
            </div>

            {/* 3. Bottom Row: Activity loop */}
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-10 rounded-[40px] shadow-premium border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#ff9d01]/10 flex items-center justify-center text-[#ff9d01]">
                                <Clock size={20} />
                            </div>
                            <h3 className="text-xl font-black text-primary italic uppercase tracking-tighter">Modification Loop</h3>
                        </div>
                        <span className="text-[10px] font-black italic text-[#ff9d01] uppercase tracking-[0.2em]">Latest Internal Signals</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentUpdates.map((update, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 relative overflow-hidden group hover:bg-white hover:border-primary/30 transition-all duration-300">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`} style={{ backgroundColor: `${update.color}15`, color: update.color }}>
                                    <update.icon size={20} />
                                </div>
                                <h4 className="text-sm font-black text-primary uppercase italic tracking-tight mb-1">{update.title}</h4>
                                <p className="text-[10px] font-bold text-gray-400 italic mb-2">{update.time}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-10 rounded-[32px] bg-[#001c3d] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-[#001c3d]/20 relative overflow-hidden group">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl shrink-0 text-[#ff9d01] shadow-xl">
                                <Sparkles size={32} className="animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Success Recommendation</p>
                                <p className="text-lg font-bold italic leading-tight">Fresh contents like blogs increases site SEO by 45%. Post a new update today!</p>
                            </div>
                        </div>
                        <Link to="/admin/news" className="relative z-10 px-10 py-5 bg-[#ff9d01] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e68d00] transition-all shadow-lg shadow-[#ff9d01]/20 flex items-center gap-3">
                            Start Composing <ArrowRight size={16} />
                        </Link>
                        {/* Decorative Background for Tip */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9d01]/10 blur-[60px] rounded-full -mr-20 -mt-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
