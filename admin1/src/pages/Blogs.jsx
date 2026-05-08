import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit, Trash2, Calendar, Tag, ChevronLeft, Save, Loader2, Image as ImageIcon, Send, MessageSquare, User, Sparkles } from 'lucide-react';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        category: 'Education',
        author: 'Admin',
        status: 'published'
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/blogs');
            setBlogs(response.data);
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            content: item.content,
            imageUrl: item.imageUrl || '',
            category: item.category || 'Education',
            author: item.author || 'Admin',
            status: item.status || 'published'
        });
        setCurrentId(item.id);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setFormData({
            title: '',
            content: '',
            imageUrl: '',
            category: 'Education',
            author: 'Admin',
            status: 'published'
        });
        setCurrentId(null);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this blog post?')) return;
        try {
            await api.delete(`/blogs/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error('Deletion failed:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (currentId) {
                await api.patch(`/blogs/${currentId}`, formData);
            } else {
                await api.post('/blogs', formData);
            }
            setIsEditing(false);
            fetchBlogs();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !isEditing) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-secondary animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Perspective...</span>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!isEditing ? (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div>
                            <h1 className="text-2xl font-black text-primary tracking-tight uppercase italic underline decoration-primary/20 underline-offset-8">Institutional Blogs</h1>
                            <p className="text-gray-500 mt-3 font-bold text-sm tracking-wide">Manage academic articles, staff insights, and educational blogs.</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="w-full md:w-auto bg-primary hover:bg-[#e68d00] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-orange-100 transition-all active:scale-95"
                        >
                            <Plus size={18} /> Compose Blog
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {blogs.length > 0 ? (
                            blogs.map((item) => (
                                <div key={item.id} className="bg-white rounded-md shadow-premium border border-gray-100 overflow-hidden group hover:scale-[1.01] transition-all duration-500 relative flex flex-col h-full">
                                    <div className="aspect-video relative overflow-hidden bg-[#f8f9fb]">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <ImageIcon size={48} strokeWidth={1} />
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
                                        <div className="flex items-center gap-4">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-accent/10 text-accent rounded-lg border border-accent/10">
                                                {item.category}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                                <Calendar size={13} className="text-gray-300" />
                                                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-[19px] font-bold text-gray-800 leading-[1.3] line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-[14px] text-gray-500 line-clamp-2 leading-relaxed font-medium">{item.content}</p>

                                        <div className="pt-5 mt-auto border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black text-xs border border-primary/10 shadow-sm">
                                                    {item.author?.[0]}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{item.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                                <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${item.status === 'published' ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-2 xl:col-span-3 bg-white p-20 rounded-md shadow-premium border border-dashed border-gray-200 text-center flex flex-col items-center gap-6">
                                <div className="p-8 bg-gray-50 rounded-full text-gray-200">
                                    <MessageSquare size={80} strokeWidth={1} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-primary mb-2">Voice of Genius</h3>
                                    <p className="text-gray-400 font-medium max-w-sm">Share academic articles, success stories, and institutional news.</p>
                                </div>
                                <button onClick={handleCreate} className="bg-primary hover:bg-accent text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-orange-100">
                                    Compose First Post
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex justify-between items-center gap-6">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-wider text-slate-400 hover:text-primary transition-all shadow-sm">
                            <ChevronLeft size={18} className="inline mr-2" /> Back
                        </button>
                        <button type="submit" disabled={isSaving} className="bg-secondary text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            {currentId ? 'Commit Changes' : 'Publish Blog'}
                        </button>
                    </div>

                    <div className="bg-white p-10 lg:p-14 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Post Title</label>
                                    <input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Captivating Title Here..."
                                        className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl font-black text-2xl text-primary focus:bg-white focus:border-secondary outline-none transition-all italic"
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Blog Content</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows="15"
                                        placeholder="Weaving the story..."
                                        className="w-full px-8 py-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] font-medium text-lg leading-relaxed text-slate-600 focus:bg-white focus:border-secondary outline-none transition-all resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Featured Image URL</label>
                                    <input
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-primary focus:bg-white outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-primary outline-none appearance-none"
                                        >
                                            <option value="Education">Education</option>
                                            <option value="Activities">Activities</option>
                                            <option value="Success">Success Story</option>
                                            <option value="Staff">Teacher Voice</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Author</label>
                                        <input
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center gap-4 text-center">
                                    <div className="p-4 bg-white rounded-full text-secondary shadow-lg">
                                        <Sparkles size={24} />
                                    </div>
                                    <p className="text-[12px] font-bold text-slate-500 italic">"Blogs are the voice of your school. Speak with passion, teach with every word."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Blogs;
