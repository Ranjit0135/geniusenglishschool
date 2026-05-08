import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import { Plus, Edit, Trash2, FileText, Search, Star, Eye, Calendar, User } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';

import PageHeroSettings from '../../components/PageHeroSettings';

const ManageBlogs = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/blogs');
            setPosts(response.data || []);
        } catch (error) {
            console.error('Failed to fetch blog posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await api.delete(`/blogs/${id}`);
                fetchPosts();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.author_name && post.author_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading && posts.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9d01]"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-8xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-black text-[#001c3d] tracking-tight flex items-center gap-3">
                        <FileText className="text-[#ff9d01]" size={32} />
                        Blog Management
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Create and manage your school's blog posts and updates.</p>
                </div>
                <button
                    onClick={() => navigate('/school-admin/website/blog/add')}
                    className="bg-[#ff9d01] hover:bg-[#e68d00] text-white px-6 py-2 rounded-md flex items-center gap-3 font-bold transition-all shadow-lg shadow-orange-100 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Create New Post</span>
                </button>
            </div>

            <PageHeroSettings pageKey="blog" pageTitle="Blog Page" />

            <div className="bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff9d01]/20 focus:border-[#ff9d01] transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#001c3d] text-white">
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Blog Post</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-center">Category</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-center">Status</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-center">Featured</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                {post.image_url ? (
                                                    <img src={getImageUrl(post.image_url)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <FileText size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#001c3d] group-hover:text-[#ff9d01] transition-colors line-clamp-1">{post.title}</h3>
                                                <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-gray-400">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><User size={12} /> {post.author_name || 'Admin'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                            {post.category || 'Blog'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${post.is_published ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {post.is_sticky ? (
                                            <Star className="mx-auto text-[#ff9d01] fill-[#ff9d01]" size={18} />
                                        ) : (
                                            <Star className="mx-auto text-gray-200" size={18} />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">

                                        <button
                                            onClick={() => navigate(`/school-admin/website/blog/edit/${post.id}`)}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                            title="Edit Post"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                            title="Delete Post"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredPosts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold">
                                        No blog posts found.
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

export default ManageBlogs;
