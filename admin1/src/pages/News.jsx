import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit, Trash2, Calendar, Tag, ChevronLeft, Save, Loader2, Image as ImageIcon, Bell, Sparkles, Filter, Newspaper, Send, Clock } from 'lucide-react';

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        category: 'General',
        isAnnouncement: false,
        buttonText: 'Read More'
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/news');
            setNews(response.data);
        } catch (error) {
            console.error('Failed to fetch news:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            content: item.content,
            imageUrl: item.imageUrl || '',
            category: item.category || 'General',
            isAnnouncement: item.isAnnouncement,
            buttonText: item.buttonText || 'Read More'
        });
        setCurrentId(item.id);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setFormData({
            title: '',
            content: '',
            imageUrl: '',
            category: 'General',
            isAnnouncement: false,
            buttonText: 'Read More'
        });
        setCurrentId(null);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this article? This action cannot be undone.')) return;
        try {
            await api.delete(`/news/${id}`);
            fetchNews();
        } catch (error) {
            console.error('Deletion failed:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (currentId) {
                await api.patch(`/news/${currentId}`, formData);
            } else {
                await api.post('/news', formData);
            }
            setIsEditing(false);
            fetchNews();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !isEditing) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Fetching Bulletin...</span>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!isEditing ? (
                <>
                    {/* List Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div>
                            <h1 className="text-2xl font-black text-primary tracking-tight uppercase italic underline decoration-primary/20 underline-offset-8">Institutional News</h1>
                            <p className="text-gray-500 mt-3 font-bold text-sm tracking-wide">Broadcast announcements and academic updates to the community.</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="w-full md:w-auto bg-primary hover:bg-[#e68d00] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-orange-100 transition-all active:scale-95"
                        >
                            <Plus size={18} /> New Article
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white p-7 rounded-md shadow-premium border border-gray-100 flex items-center gap-6 group hover:border-primary/20 transition-all">
                            <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Newspaper size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total News</p>
                                <p className="text-2xl font-black text-primary">{news.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-7 rounded-md shadow-premium border border-gray-100 flex items-center gap-6 group hover:border-emerald-200 transition-all">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <Send size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Published</p>
                                <p className="text-2xl font-black text-emerald-500">{news.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-7 rounded-md shadow-premium border border-gray-100 flex items-center gap-6 group hover:border-accent/20 transition-all">
                            <div className="w-14 h-14 bg-accent/5 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                                <Clock size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Latest Push</p>
                                <p className="text-[13px] font-black text-gray-600 uppercase tracking-tight">
                                    {news.length > 0 ? new Date(news[0].updatedAt || news[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Articles List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {news.length > 0 ? (
                            news.map((item) => (
                                <div key={item.id} className="bg-white rounded-md shadow-premium border border-gray-100 overflow-hidden group hover:scale-[1.01] transition-all duration-500 relative flex flex-col h-full">
                                    <div className="aspect-video relative overflow-hidden bg-[#f8f9fb]">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <Newspaper size={48} strokeWidth={1} />
                                            </div>
                                        )}

                                        {item.isAnnouncement && (
                                            <div className="absolute top-4 left-4 p-2.5 bg-accent text-white rounded-xl shadow-lg ring-4 ring-white/20 animate-in zoom-in duration-500">
                                                <Bell size={16} className="animate-bounce" />
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button onClick={() => handleEdit(item)} className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-lg flex items-center justify-center">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg flex items-center justify-center">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-7 flex flex-col flex-1 gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${item.isAnnouncement ? 'bg-accent/10 text-accent border-accent/10' : 'bg-primary/5 text-primary border-primary/10'
                                                }`}>
                                                {item.isAnnouncement ? 'Urgent' : item.category}
                                            </span>
                                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                                <Calendar size={13} className="text-gray-300" />
                                                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <h3 className="text-[19px] font-bold text-gray-800 leading-[1.3] line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-[14px] text-gray-500 line-clamp-2 leading-relaxed font-medium">{item.content}</p>

                                        <div className="pt-5 mt-auto border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-emerald-600">Active</span>
                                            </div>
                                            <button onClick={() => handleEdit(item)} className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-3 transition-all">
                                                Update Feed <Send size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-2 xl:col-span-3 bg-white p-20 rounded-md shadow-premium border border-dashed border-gray-200 text-center flex flex-col items-center gap-6">
                                <div className="p-10 bg-gray-50 rounded-full text-gray-200">
                                    <Newspaper size={80} strokeWidth={1} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-primary mb-2">Editor's Desk is Empty</h3>
                                    <p className="text-gray-400 font-medium max-w-sm mx-auto">Publish your first article or institutional announcement to see it here.</p>
                                </div>
                                <button onClick={handleCreate} className="bg-primary hover:bg-[#e68d00] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-orange-100">
                                    Start Writing
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {/* Editor Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-3 px-8 py-4 bg-white text-gray-500 rounded-2xl border border-gray-100 font-black text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary transition-all shadow-sm group"
                        >
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Newsfeed
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full md:w-auto bg-primary hover:bg-[#e68d00] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-orange-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            {currentId ? 'Synchronize Update' : 'Publish Article'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Content Area */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-white p-10 rounded-md shadow-premium border border-gray-100 space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Article Headline</label>
                                    <input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-8 py-6 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-black text-3xl text-primary placeholder:text-gray-200 outline-none transition-all italic tracking-tight"
                                        placeholder="Breaking: Academic Excellence..."
                                        required
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Main Narrative</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows="18"
                                        className="w-full px-8 py-8 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[2rem] font-medium text-lg leading-relaxed text-gray-600 outline-none transition-all resize-none placeholder:text-gray-200"
                                        placeholder="Detail out the full story here..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Settings */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Media Card */}
                            <div className="bg-white p-8 rounded-md shadow-premium border border-gray-100 space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Featured Visual</label>
                                <div className="relative group aspect-square bg-[#f8f9fb] rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-primary/30">
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="text-center text-gray-300">
                                            <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Visual Anchor</p>
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="Paste Image URL"
                                        className="absolute bottom-6 left-6 right-6 px-4 py-3 bg-white/95 backdrop-blur border border-gray-100 rounded-xl text-xs font-bold outline-none opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                    />
                                </div>
                            </div>

                            {/* Classification */}
                            <div className="bg-white p-8 rounded-md shadow-premium border border-gray-100 space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">News Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-6 py-4 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl font-black text-[11px] uppercase tracking-widest text-primary outline-none appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="General">General News</option>
                                        <option value="Academic">Academic</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Event">Institutional Event</option>
                                    </select>
                                </div>

                                <div className="pt-6 border-t border-gray-50">
                                    <label className="flex items-center justify-between p-5 bg-accent/5 hover:bg-accent/10 rounded-2xl cursor-pointer transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${formData.isAnnouncement ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white text-gray-300'}`}>
                                                <Bell size={16} className={formData.isAnnouncement ? 'animate-swing' : ''} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Push Update</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.isAnnouncement}
                                            onChange={(e) => setFormData({ ...formData, isAnnouncement: e.target.checked })}
                                            className="w-6 h-6 rounded-lg accent-accent border-gray-200 transition-all cursor-pointer"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-primary/5 p-8 rounded-md border border-primary/10">
                                <h4 className="text-primary font-black text-[11px] uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Sparkles size={14} className="text-secondary" /> Publishing Guideline
                                </h4>
                                <p className="text-gray-500 text-[13px] font-medium leading-relaxed italic">
                                    "Ensure headlines stay within 10 words. Announcements will be highlighted at the top of the dashboard and school portal."
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default NewsPage;
