import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api';
import { ChevronLeft, Save, Loader2, Calendar as CalendarIcon, Clock, MapPin, Info, Image as ImageIcon, X, Plus, Trash2 } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';

const EventForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time_range: '',
        location: '',
        category: 'Academic',
        is_published: true,
        additional_sections: []
    });

    const [sectionFiles, setSectionFiles] = useState({}); // { index: File }
    const [sectionPreviews, setSectionPreviews] = useState({}); // { index: Url }

    useEffect(() => {
        if (isEdit) {
            fetchEvent();
        }
    }, [id]);

    const fetchEvent = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/events/id/${id}`);
            const event = response.data;
            if (event) {
                setFormData({
                    title: event.title,
                    description: event.description || '',
                    date: event.date ? event.date.split('T')[0] : '',
                    time_range: event.time_range || '',
                    location: event.location || '',
                    category: event.category || 'Academic',
                    is_published: event.is_published
                });
                setPreviewUrl(getImageUrl(event.image_url));
            }
        } catch (error) {
            console.error('Failed to fetch event:', error);
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

        if (!formData.date) {
            alert('Please select an event date.');
            setIsSaving(false);
            return;
        }

        try {
            if (isEdit) {
                await api.patch(`/events/${id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/events', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/school-admin/website/events');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save event.');
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
        <div className="p-8 max-w-4xl mx-auto bg-gray-50/30 min-h-screen">
            <button
                onClick={() => navigate('/school-admin/website/events')}
                className="flex items-center gap-2 text-gray-500 hover:text-[#001c3d] font-bold mb-8 transition-colors group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Events
            </button>

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-black text-[#001c3d] tracking-tight">
                        {isEdit ? 'Edit School Event' : 'Schedule New Event'}
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Keep your schedule up to date for parents and students.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Event Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-2xl outline-none transition-all font-bold text-lg text-[#001c3d]"
                                placeholder="e.g., Annual Sports Day 2026"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Featured Image</label>
                            <div className="relative group aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-[#ff9d01]/30">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                                        <p className="text-[10px] font-bold">Select Banner Photo</p>
                                    </div>
                                )}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />

                                {previewUrl && (
                                    <button
                                        type="button"
                                        onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Event Description</label>
                            <textarea
                                rows={10}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-600 leading-relaxed"
                                placeholder="Write all the event details here..."
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <CalendarIcon size={14} className="text-[#ff9d01]" /> Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff9d01]/20 font-bold text-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Clock size={14} className="text-[#ff9d01]" /> Time
                            </label>
                            <input
                                type="text"
                                value={formData.time_range}
                                onChange={(e) => setFormData({ ...formData, time_range: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff9d01]/20 font-bold text-gray-700"
                                placeholder="8:00 AM - 2:00 PM"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <MapPin size={14} className="text-[#ff9d01]" /> Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff9d01]/20 font-bold text-gray-700"
                                placeholder="Main Campus"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                            <input
                                type="text"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff9d01]/20 font-bold text-gray-700"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-50">
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

                    <div className="">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-[#ff9d01] hover:bg-[#e68d00] text-white py-3 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            {isSaving ? 'Processing...' : (isEdit ? 'Update Event' : 'Schedule Event')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
