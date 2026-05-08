import React, { useState, useEffect } from 'react';
import api from '../../../api';
import {
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Star,
    User,
    MessageSquare,
    Loader2,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';

const ManageTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        author_name: '',
        author_role: 'Parent',
        content: '',
        rating: 5,
        is_published: true
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/ui/testimonials');
            setTestimonials(response.data);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (imageFile) data.append('image', imageFile);

        try {
            if (editingId) {
                await api.patch(`/ui/testimonials/${editingId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/ui/testimonials', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setShowForm(false);
            resetForm();
            fetchTestimonials();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save testimonial.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (t) => {
        setEditingId(t.id);
        setFormData({
            author_name: t.author_name,
            author_role: t.author_role,
            content: t.content,
            rating: t.rating,
            is_published: t.is_published
        });
        setImagePreview(getImageUrl(t.image_url));
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                await api.delete(`/ui/testimonials/${id}`);
                fetchTestimonials();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            author_name: '',
            author_role: 'Parent',
            content: '',
            rating: 5,
            is_published: true
        });
        setImagePreview(null);
        setImageFile(null);
        setEditingId(null);
    };

    return (
        <div className="p-4 lg:p-8 max-w-8xl mx-auto space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-secondary rounded-md"></div>
                    <h1 className="text-2xl lg:text-2xl font-black text-[#001c3d] tracking-tight mb-2">
                        Parent <span className="text-secondary italic">Feedback</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                        Manage testimonials and student/parent voices
                    </p>
                </div>

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary hover:bg-[#e68d00] text-white px-8 py-3 rounded-md flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-orange-100 active:scale-95 self-start"
                    >
                        <Plus size={20} />
                        Add Testimonial
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="bg-white rounded-md shadow-md shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <div className="p-8 lg:p-12">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black text-[#001c3d]">
                                {editingId ? 'Edit Testimonial' : 'New Testimonial'}
                            </h2>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="flex flex-col lg:flex-row gap-12">
                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Author Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.author_name}
                                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-md outline-none transition-all font-bold text-gray-700"
                                                placeholder="e.g., John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Role / Relation</label>
                                            <input
                                                type="text"
                                                value={formData.author_role}
                                                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-md outline-none transition-all font-bold text-gray-700"
                                                placeholder="e.g., Parent of Grade 5 Student"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Testimonial Content</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary focus:bg-white rounded-md outline-none transition-all font-medium text-gray-600 leading-relaxed italic"
                                            placeholder="What do they have to say about the school?"
                                        />
                                    </div>

                                    <div className="flex items-center gap-10 pt-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, rating: star })}
                                                        className={`p-1 transition-transform hover:scale-125 ${formData.rating >= star ? 'text-secondary' : 'text-gray-200'}`}
                                                    >
                                                        <Star size={24} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">Status</label>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, is_published: !formData.is_published })}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-all font-bold text-[10px] uppercase tracking-widest ${formData.is_published ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                                            >
                                                {formData.is_published ? <CheckCircle2 size={16} /> : <X size={16} />}
                                                {formData.is_published ? 'Published' : 'Hidden'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-[320px] space-y-4">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block">Author Photo</label>
                                    <div className="relative group aspect-square bg-gray-50 rounded-md border-4 border-dashed border-gray-100 flex items-center justify-center overflow-hidden transition-all hover:border-secondary/30">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Author" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center text-gray-300">
                                                <User size={64} className="mx-auto mb-2 opacity-20" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Photo</p>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-center font-medium italic">Square image recommended </p>
                                </div>
                            </div>

                            <div className="pt-10 flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-10 py-2 bg-primary hover:bg-[#e68d00] text-white rounded-md flex items-center justify-center gap-4 font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                    {isSaving ? 'Saving...' : 'Save Testimonial'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); resetForm(); }}
                                    className="px-10 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-md font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                            <Loader2 size={48} className="animate-spin text-secondary" />
                            <p className="font-bold uppercase tracking-widest text-[10px]">Loading Voices...</p>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="col-span-full py-20 bg-gray-50 rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-6 text-gray-400">
                            <MessageSquare size={64} className="opacity-10" />
                            <div className="text-center">
                                <h3 className="text-xl font-black text-gray-400 mb-2">No Testimonials Yet</h3>
                                <p className="font-medium italic">Start collecting the voices that matter.</p>
                            </div>
                            <button onClick={() => setShowForm(true)} className="text-secondary font-black text-xs uppercase tracking-widest hover:underline">Add First Feedback</button>
                        </div>
                    ) : (
                        testimonials.map((t) => (
                            <div key={t.id} className="group bg-white rounded-md border border-gray-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full">
                                {!t.is_published && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-gray-800 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                            <AlertCircle size={10} className="text-secondary" /> Hidden
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner">
                                        {t.image_url ? (
                                            <img src={getImageUrl(t.image_url)} alt={t.author_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <User size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[#001c3d] tracking-tight line-clamp-1">{t.author_name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.author_role}</p>
                                    </div>
                                </div>

                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill={i < t.rating ? '#ff9d01' : 'none'} className={i < t.rating ? 'text-secondary' : 'text-gray-200'} />
                                    ))}
                                </div>

                                <p className="text-gray-500 italic font-medium leading-relaxed flex-grow line-clamp-4">
                                    "{t.content}"
                                </p>

                                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="p-3 bg-secondary hover:bg-[#e68d00] text-white rounded-md transition-all active:scale-90"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-md transition-all active:scale-90"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageTestimonials;
