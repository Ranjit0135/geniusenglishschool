import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { Upload, X, CheckCircle, Loader2, Image as ImageIcon, Trash2, Plus, Grid, Filter, Edit2 } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';
import PageHeroSettings from '../../components/PageHeroSettings';

const ManageGallery = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Upload/Edit State
    const [showUpload, setShowUpload] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        media_type: 'image'
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    const fetchGalleryItems = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/ui/gallery');
            setItems(response.data || []);
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            category: item.category || '',
            media_type: item.media_type || 'image'
        });
        setPreviewUrl(getImageUrl(item.media_url));
        setShowUpload(true);
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

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile && !editingItem) return;

        setIsSaving(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('media_type', formData.media_type);
        if (selectedFile) {
            data.append('media', selectedFile);
        }

        try {
            if (editingItem) {
                await api.patch(`/ui/gallery/${editingItem.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage({ type: 'success', text: 'Item updated successfully!' });
            } else {
                await api.post('/ui/gallery', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessage({ type: 'success', text: 'Item added to gallery!' });
            }
            setFormData({ title: '', category: '', media_type: 'image' });
            setSelectedFile(null);
            setPreviewUrl(null);
            setShowUpload(false);
            setEditingItem(null);
            fetchGalleryItems();
        } catch (error) {
            console.error('Operation failed:', error);
            setMessage({ type: 'error', text: `Failed to ${editingItem ? 'update' : 'upload'} item.` });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Remove this item from gallery?')) {
            try {
                await api.delete(`/ui/gallery/${id}`);
                fetchGalleryItems();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    if (isLoading && items.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-[#ff9d01]" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-black text-[#001c3d] tracking-tight flex items-center gap-3">
                        <Grid className="text-[#ff9d01]" size={24} />
                        Website Gallery
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage school photos and videos displayed on the public site.</p>
                </div>
                {!showUpload && (
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setFormData({ title: '', category: '', media_type: 'image' });
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setShowUpload(true);
                        }}
                        className="bg-[#ff9d01] hover:bg-[#e68d00] text-white px-6 py-2 rounded-xl flex items-center gap-3 font-bold transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add Media</span>
                    </button>
                )}
            </div>

            <PageHeroSettings pageKey="gallery" pageTitle="Gallery Page" />

            {showUpload && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10 animate-slideDown">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#001c3d] text-white">
                        <h2 className="text-xl font-bold">{editingItem ? 'Edit Media' : 'Upload New Media'}</h2>
                        <button onClick={() => { setShowUpload(false); setEditingItem(null); }} className="bg-white/10 hover:bg-white/20 p-2 rounded-xl">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleUpload} className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4">
                            <div className="relative aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                                        <p className="text-xs font-bold">Select File</p>
                                    </div>
                                )}
                                <input type="file" required={!editingItem} className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Title (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sports, Events"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setShowUpload(false)} className="px-8 py-3 font-bold text-gray-500">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-[#ff9d01] text-white rounded-xl font-bold flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                    {isSaving ? 'Saving...' : (editingItem ? 'Update Changes' : 'Confirm Upload')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                        <div className="aspect-square relative overflow-hidden">
                            <img src={getImageUrl(item.media_url)} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button onClick={() => handleEdit(item)} className="bg-white text-[#001c3d] p-3 rounded-2xl hover:bg-gray-100 transition-colors shadow-lg">
                                    <Edit2 size={20} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white p-3 rounded-2xl hover:bg-red-600 transition-colors shadow-lg">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            {item.category && (
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-[#001c3d]">
                                        {item.category}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-[#001c3d] truncate">{item.title || 'Untitled'}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Added {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                {items.length === 0 && !showUpload && (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                        <ImageIcon size={64} className="mx-auto mb-4 text-gray-200" />
                        <h3 className="text-xl font-bold text-gray-400">Gallery is empty</h3>
                        <p className="text-gray-400 mt-2">Start adding photos of your school events.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageGallery;
