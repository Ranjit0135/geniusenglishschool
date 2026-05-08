import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import { ChevronLeft, Save, Loader2, Image as ImageIcon, Upload, X, Info, Plus, Trash2, Newspaper } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';

const NewsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        author_name: '',
        category: 'School News',
        is_published: true
    });

    const [sectionFiles, setSectionFiles] = useState({}); // { index: File }
    const [sectionPreviews, setSectionPreviews] = useState({}); // { index: Url }

    useEffect(() => {
        if (isEdit) {
            fetchNewsItem();
        }
    }, [id]);

    const fetchNewsItem = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/news/id/${id}`);
            const item = response.data;

            if (item) {
                setFormData({
                    title: item.title,
                    content: item.content,
                    excerpt: item.excerpt || '',
                    author_name: item.author_name || '',
                    category: item.category || 'School News',
                    is_published: item.is_published
                });
                setPreviewUrl(getImageUrl(item.image_url));
            }
        } catch (error) {
            console.error('Failed to fetch news item:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (selectedFile) {
            data.append('image', selectedFile);
        } else if (previewUrl && !selectedFile && previewUrl.startsWith('http')) {
            data.append('image_url', previewUrl);
        }

        try {
            if (isEdit) {
                await api.patch(`/news/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/news', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/school-admin/website/news');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save news item.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-50/30 min-h-screen">
            <button
                onClick={() => navigate('/school-admin/website/news')}
                className="flex items-center gap-2 text-gray-400 hover:text-heading font-black mb-8 transition-colors group uppercase tracking-widest text-[10px]"
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
                Back to News Items
            </button>

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-[#001c3d] tracking-tight">
                        {isEdit ? 'Edit News Update' : 'New School Update'}
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Keep your community informed with the latest school news and events.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-premium border border-gray-100 space-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Update Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-black text-2xl text-[#001c3d] placeholder:text-gray-300"
                                placeholder="Enter headlines..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Brief Excerpt</label>
                            <textarea
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-600 italic placeholder:text-gray-300"
                                placeholder="A quick summary for the news preview..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Main Content</label>
                            <textarea
                                required
                                rows={12}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-600 leading-relaxed placeholder:text-gray-300"
                                placeholder="Write the full news story here..."
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-50 space-y-4">
                            <label className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-primary/10 rounded-2xl cursor-pointer group transition-all">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-primary transition-colors">Visible on Site</span>
                                <input
                                    type="checkbox"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="w-6 h-6 rounded-lg border-gray-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    {/* Featured Image */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-6 ml-1">Hero Image</label>
                        <div className="relative group aspect-square bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-primary/30">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-300">
                                    <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Select Hero</p>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />

                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                                    className="absolute top-4 right-4 bg-white/90 text-red-500 p-3 rounded-2xl shadow-xl hover:bg-red-50 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Meta Controls */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Author</label>
                            <input
                                type="text"
                                value={formData.author_name}
                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-heading"
                                placeholder="School Admin"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">News Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl outline-none transition-all font-bold text-heading"
                            />
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="bg-[#001c3d] rounded-[40px] shadow-blue-900/20">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-primary hover:bg-[#e68d00] text-white py-6 rounded-3xl flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50 disabled:grayscale"
                        >
                            {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                            <span>{isSaving ? 'Processing...' : (isEdit ? 'Update News' : 'Publish Update')}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewsForm;
