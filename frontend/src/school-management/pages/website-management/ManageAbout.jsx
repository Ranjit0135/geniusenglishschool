import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { Upload, CheckCircle, Loader2, Info, Type, AlignLeft, Target, Eye } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';
import PageHeroSettings from '../../components/PageHeroSettings';

const ManageAbout = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        mission: '',
        vision: '',
        tour_title: '',
        tour_description: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [tourImagePreview, setTourImagePreview] = useState(null);
    const [selectedTourFile, setSelectedTourFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchAboutContent();
    }, []);

    const fetchAboutContent = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/ui/about');
            if (response.data) {
                setFormData({
                    title: response.data.title || '',
                    description: response.data.description || '',
                    mission: response.data.mission || '',
                    vision: response.data.vision || '',
                    tour_title: response.data.tour_title || '',
                    tour_description: response.data.tour_description || ''
                });
                setImagePreview(getImageUrl(response.data.image_url));
                setTourImagePreview(getImageUrl(response.data.tour_image_url));
            }
        } catch (error) {
            console.error('Failed to fetch about content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e, type = 'image') => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'image') {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setImagePreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                setSelectedTourFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setTourImagePreview(reader.result);
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('mission', formData.mission);
        data.append('vision', formData.vision);
        data.append('tour_title', formData.tour_title);
        data.append('tour_description', formData.tour_description);

        if (selectedFile) {
            data.append('image', selectedFile);
        }
        if (selectedTourFile) {
            data.append('tour_image', selectedTourFile);
        }

        try {
            await api.post('/ui/about', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: 'About content updated successfully!' });
            setSelectedFile(null);
            setSelectedTourFile(null);
        } catch (error) {
            console.error('Update failed:', error);
            setMessage({ type: 'error', text: 'Failed to update content.' });
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
        <div className="p-8 max-w-6xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="mb-10">
                <h1 className="text-2xl font-black text-[#001c3d] tracking-tight flex items-center gap-3">
                    <Info className="text-[#ff9d01]" size={32} />
                    Manage About Page
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Customize the content for your school's About section.</p>
            </div>

            <PageHeroSettings pageKey="about" pageTitle="About Page" />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Type size={14} className="text-[#ff9d01]" />
                                    Main Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                    placeholder="e.g. About Our School"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                <AlignLeft size={14} className="text-[#ff9d01]" />
                                Main Introduction
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-medium text-gray-600 leading-relaxed"
                                placeholder="Introduce your school to the world..."
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-6 space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Type size={14} className="text-[#ff9d01]" />
                                    Tour Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.tour_title}
                                    onChange={(e) => setFormData({ ...formData, tour_title: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                    placeholder="e.g. Special School Tour"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <AlignLeft size={14} className="text-[#ff9d01]" />
                                    Tour Description
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.tour_description}
                                    onChange={(e) => setFormData({ ...formData, tour_description: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-medium text-gray-600 leading-relaxed"
                                    placeholder="Details about the school tour..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Target size={14} className="text-[#ff9d01]" />
                                    Our Mission
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.mission}
                                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-medium text-gray-600"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                    <Eye size={14} className="text-[#ff9d01]" />
                                    Our Vision
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.vision}
                                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-medium text-gray-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Images & Action */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <label className="block w-full text-xs font-black text-gray-500 uppercase tracking-widest mb-4 ml-1">Main Hero Image</label>
                        <div className="relative group w-full aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-[#ff9d01]/30">
                            {imagePreview ? (
                                <img src={imagePreview} alt="About Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <Upload size={48} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-xs font-bold">Upload Image</p>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <label className="block w-full text-xs font-black text-gray-500 uppercase tracking-widest mb-4 ml-1">School Tour Image</label>
                        <div className="relative group w-full aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-[#ff9d01]/30">
                            {tourImagePreview ? (
                                <img src={tourImagePreview} alt="Tour Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <Upload size={48} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-xs font-bold">Upload Image</p>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileChange(e, 'tour')} />
                        </div>
                    </div>

                    <div>
                        {message.text && (
                            <div className={`p-4 rounded-2xl text-xs font-bold animate-fadeIn ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {message.text}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-[#001c3d] hover:bg-[#e68d00] text-white py-3 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg shadow-orange-950/20 active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                            {isSaving ? 'Saving Changes...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ManageAbout;
