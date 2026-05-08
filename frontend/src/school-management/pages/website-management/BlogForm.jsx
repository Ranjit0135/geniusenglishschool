import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import { ChevronLeft, Save, Loader2, Image as ImageIcon, Upload, X, Info, Plus, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';

const BlogForm = () => {
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
        category: 'Blog',
        tags: '',
        is_published: true
    });


    useEffect(() => {
        if (isEdit) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/blogs/id/${id}`);
            const post = response.data;
            if (post) {
                setFormData({
                    title: post.title,
                    content: post.content,
                    excerpt: post.excerpt || '',
                    author_name: post.author_name || '',
                    category: post.category || 'Blog',
                    tags: post.tags || '',
                    is_published: post.is_published
                });
                setPreviewUrl(getImageUrl(post.image_url));
            }
        } catch (error) {
            console.error('Failed to fetch post:', error);
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

        // Append basic fields
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
                await api.patch(`/blogs/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/blogs', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/school-admin/website/blogs');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save blog post.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-[#ff9d01]" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-50/30 min-h-screen">
            <button
                onClick={() => navigate('/school-admin/website/blogs')}
                className="flex items-center gap-2 text-gray-500 hover:text-[#001c3d] font-bold mb-8 transition-colors group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Blogs
            </button>

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-[#001c3d] tracking-tight">
                        {isEdit ? 'Edit Blog Post' : 'Create New Post'}
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Capture your school's latest stories and achievements.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Post Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-2xl outline-none transition-all font-bold text-xl text-[#001c3d]"
                                placeholder="Enter post title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Short Excerpt</label>
                            <textarea
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-600 italic"
                                placeholder="A brief summary for the blog list page..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Full Content</label>
                            <textarea
                                required
                                rows={15}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-600 leading-relaxed"
                                placeholder="Write your post content here..."
                            />
                        </div>



                        <div className="pt-4 border-t border-gray-50 space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-[#ff9d01] focus:ring-[#ff9d01]"
                                />
                                <span className="text-xs font-black text-gray-600 uppercase tracking-widest group-hover:text-[#ff9d01] transition-colors">Published</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    {/* Featured Image */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-4 ml-1">Featured Image</label>
                        <div className="relative group aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-[#ff9d01]/30">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-[10px] font-bold">Select Photo</p>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />

                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Author Name</label>
                            <input
                                type="text"
                                value={formData.author_name}
                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff9d01]/20 font-bold text-gray-700"
                                placeholder="Admin"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff9d01]/20 font-bold text-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Tags (Comma separated)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff9d01]/20 font-bold text-gray-700"
                                placeholder="news, updates..."
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="bg-[#001c3d] p-6 rounded-3xl shadow-xl">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-[#ff9d01] hover:bg-[#e68d00] text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            {isSaving ? 'Processing...' : (isEdit ? 'Update Post' : 'Publish Blog')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;
