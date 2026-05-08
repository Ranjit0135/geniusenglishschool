import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Image as ImageIcon, Loader2, X, Filter, Camera, Sparkles } from 'lucide-react';

const GalleryPage = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({ imageUrl: '', caption: '', category: 'Campus' });
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Campus', 'Events', 'Sports', 'Academic', 'Extra-Curricular'];

    const fetchGallery = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/gallery');
            setItems(response.data);
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/gallery', formData);
            setFormData({ imageUrl: '', caption: '', category: 'Campus' });
            setShowAdd(false);
            fetchGallery();
        } catch (error) {
            console.error('Failed to add image:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this visual memory?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            fetchGallery();
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    };

    const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Gallery...</span>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700 font-base">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-2xl font-black text-primary tracking-tight uppercase italic underline decoration-primary/20 underline-offset-8 flex items-center gap-3">
                        <ImageIcon size={28} className="text-accent" />
                        Website Gallery
                    </h1>
                    <p className="text-gray-500 mt-3 font-bold text-sm tracking-wide">Manage and showcase the vibrant lifestyle of Genius English School.</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="w-full md:w-auto bg-primary hover:bg-[#e68d00] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-orange-100 transition-all active:scale-95"
                >
                    <Plus size={18} /> Add New Media
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-5 rounded-md shadow-premium border border-gray-100 mb-10 overflow-x-auto no-scrollbar flex items-center gap-6">
                <div className="flex items-center gap-3 px-6 border-r border-gray-100 text-gray-400">
                    <Filter size={16} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Archives</span>
                </div>
                <div className="flex items-center gap-3 px-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === cat
                                ? 'bg-primary text-white shadow-lg shadow-orange-100 scale-105'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-primary border border-transparent'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-premium border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
                            <div className="aspect-square overflow-hidden bg-[#f8f9fb] relative">
                                <img
                                    src={item.imageUrl}
                                    alt={item.caption}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-white text-rose-500 p-4 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-2xl scale-95 group-hover:scale-100"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-primary shadow-lg">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 text-center">
                                <p className="text-[13px] font-bold text-gray-700 leading-tight line-clamp-1 italic">
                                    "{item.caption || 'Institutional Memory'}"
                                </p>
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-2">Captured {new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-20 rounded-md shadow-premium border border-dashed border-gray-200 text-center flex flex-col items-center gap-6">
                    <div className="p-10 bg-gray-50 rounded-full text-gray-200">
                        <Camera size={80} strokeWidth={1} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-primary mb-2 italic">Archives Empty</h3>
                        <p className="text-gray-400 font-medium max-w-xs mx-auto">Publish visual highlights of your school events to populate this collection.</p>
                    </div>
                </div>
            )}

            {/* Add Media Modal */}
            {showAdd && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col border border-gray-100">
                        <div className="p-8 bg-[#001c3d] text-white flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase tracking-widest italic flex items-center gap-3">
                                <Sparkles size={24} className="text-accent" />
                                Add Media Signal
                            </h3>
                            <button
                                onClick={() => setShowAdd(false)}
                                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Media Source (URL)</label>
                                <input
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-primary outline-none transition-all"
                                    placeholder="https://images.unsplash.com/..."
                                    required
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Visual Context</label>
                                <textarea
                                    value={formData.caption}
                                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                    rows="3"
                                    className="w-full px-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-gray-600 outline-none resize-none leading-relaxed transition-all"
                                    placeholder="Describe this moment..."
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Classification</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {categories.filter(c => c !== 'All').map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: c })}
                                            className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${formData.category === c
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-orange-100'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-primary/30'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-primary hover:bg-[#e68d00] text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} />}
                                {isSaving ? 'Processing Content...' : 'Confirm Archival'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
