import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Calendar, User, Tag, Clock, Newspaper } from 'lucide-react';
import api from '../../../api';
import { getImageUrl } from '../../../utils/imageUtils';
import PageHeroSettings from '../../components/PageHeroSettings';

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/news');
            setNews(response.data);
        } catch (error) {
            console.error('Failed to fetch news:', error);
            setMessage({ type: 'error', text: 'Failed to load news items.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this news item?')) return;

        try {
            await api.delete(`/news/${id}`);
            setNews(news.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'News item deleted successfully.' });
        } catch (error) {
            console.error('Delete failed:', error);
            setMessage({ type: 'error', text: 'Failed to delete news item.' });
        }
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-8xl mx-auto animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-black text-[#001c3d] tracking-tight">News & Updates</h1>
                    <p className="text-gray-500 mt-2 font-medium flex items-center gap-2">
                        <Newspaper size={16} className="text-secondary" />
                        Manage informational updates and school news
                    </p>
                </div>
                <Link
                    to="/school-admin/website/news/add"
                    className="bg-primary hover:bg-[#e68d00] text-white px-8 py-3 rounded-md flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all shadow-md shadow-orange-100 active:scale-95 whitespace-nowrap"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>Create News</span>
                </Link>
            </div>

            <PageHeroSettings pageKey="news" pageTitle="News Page" />

            {/* Stats/Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-md shadow-premium border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <Newspaper size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total News</p>
                        <p className="text-2xl font-black text-heading">{news.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-md shadow-premium border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Published</p>
                        <p className="text-2xl font-black text-heading">{news.filter(n => n.is_published).length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-md shadow-premium border border-gray-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Latest Update</p>
                        <p className="text-sm font-bold text-heading">
                            {news.length > 0 ? new Date(news[0].updatedAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Feedback */}
            {message.text && (
                <div className={`mb-8 p-5 rounded-2xl text-[13px] font-bold flex items-center gap-3 animate-fadeIn ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-md shadow-premium border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search news by title or category..."
                            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold text-heading transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">News Item</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                                        <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-16"></div></td>
                                        <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-24 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredNews.length > 0 ? (
                                filteredNews.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                                                    {item.image_url ? (
                                                        <img src={getImageUrl(item.image_url)} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-[#001c3d] leading-tight mb-1 group-hover:text-primary transition-colors">{item.title}</p>
                                                    <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400">
                                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1"><User size={12} /> {item.author_name || 'Admin'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                                {item.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${item.is_published ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${item.is_published ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {item.is_published ? 'Live' : 'Draft'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">

                                                <Link
                                                    to={`/school-admin/website/news/edit/${item.id}`}
                                                    className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                                        No news items found. Create your first update to see it here.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ImageIcon = ({ size, className }) => (
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
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

export default ManageNews;
