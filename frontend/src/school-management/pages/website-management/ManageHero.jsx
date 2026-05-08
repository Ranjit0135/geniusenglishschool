import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { Save, Loader2, Image as ImageIcon, Layout, Type, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';
import PageHeroSettings from '../../components/PageHeroSettings';

const ManageHero = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [principalImagePreview, setPrincipalImagePreview] = useState(null);
    const [principalImageFile, setPrincipalImageFile] = useState(null);

    const [formData, setFormData] = useState({
        subtitle: '',
        title_main: '',
        title_highlight: '',
        description: '',
        button_text: '',
        button_link: '',
        principal_name: '',
        principal_role: 'Principal',
        principal_message: '',
        principal_facebook: '',
        principal_twitter: '',
        principal_linkedin: '',
        principal_instagram: '',
        is_active: true
    });

    useEffect(() => {
        fetchHeroContent();
    }, []);

    const fetchHeroContent = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/ui/hero');
            if (response.data) {
                setFormData({
                    subtitle: response.data.subtitle || '',
                    title_main: response.data.title_main || '',
                    title_highlight: response.data.title_highlight || '',
                    description: response.data.description || '',
                    button_text: response.data.button_text || '',
                    button_link: response.data.button_link || '',
                    principal_name: response.data.principal_name || '',
                    principal_role: response.data.principal_role || 'Principal',
                    principal_message: response.data.principal_message || '',
                    principal_facebook: response.data.principal_facebook || '',
                    principal_twitter: response.data.principal_twitter || '',
                    principal_linkedin: response.data.principal_linkedin || '',
                    principal_instagram: response.data.principal_instagram || '',
                    is_active: response.data.is_active
                });
                if (response.data.image_url) {
                    setImagePreview(getImageUrl(response.data.image_url));
                }
                if (response.data.principal_image_url) {
                    setPrincipalImagePreview(getImageUrl(response.data.principal_image_url));
                }
            }
        } catch (error) {
            console.error('Failed to fetch hero content:', error);
        } finally {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500); // Small delay for smooth feel
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

    const handlePrincipalImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPrincipalImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPrincipalImagePreview(reader.result);
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
        if (imageFile) {
            data.append('image', imageFile);
        }
        if (principalImageFile) {
            data.append('principal_image', principalImageFile);
        }

        try {
            await api.patch('/ui/hero', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Hero section updated successfully!');
            fetchHeroContent();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to update hero section.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Loading Hero Settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-8xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="max-w-8xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-2xl md:text-2xl font-black text-[#001c3d] tracking-tight flex items-center gap-4">
                            <Layout className="text-primary" size={36} />
                            Hero Section Management
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Customize the main welcome section of your school's website.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white p-6 md:p-10 rounded-md md:rounded-md shadow-sm border border-gray-100">
                        <div className="flex flex-col lg:flex-row gap-10">

                            {/* Left Side: Content Fields */}
                            <div className="flex-1 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Type size={12} className="text-primary" /> Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-bold text-gray-700"
                                            placeholder="e.g., Welcome to"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Type size={12} className="text-primary" /> Main Title
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title_main}
                                            onChange={(e) => setFormData({ ...formData, title_main: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-black text-xl text-[#001c3d]"
                                            placeholder="e.g., Genius English"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <Type size={12} className="text-primary" /> Title Highlight
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title_highlight}
                                            onChange={(e) => setFormData({ ...formData, title_highlight: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-bold text-secondary"
                                            placeholder="e.g., School"
                                        />
                                    </div>
                                    <div className="space-y-2 font-medium">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <AlertCircle size={12} className="text-primary" /> Status
                                        </label>
                                        <div className="flex items-center gap-4 h-[60px]">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_active}
                                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                    className="w-6 h-6 rounded-lg border-gray-200 text-primary focus:ring-primary/20"
                                                />
                                                <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">Visible on Website</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Main Description</label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-medium text-gray-600 leading-relaxed"
                                        placeholder="Tell your visitors what makes your school special..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <LinkIcon size={12} className="text-primary" /> Button Text
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.button_text}
                                            onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-bold text-[#001c3d]"
                                            placeholder="e.g., Take a Tour"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <LinkIcon size={12} className="text-primary" /> Button Link
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.button_link}
                                            onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-bold text-[#001c3d]"
                                            placeholder="e.g., #tour or /contact"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Image Upload */}
                            <div className="w-full md:w-[350px] space-y-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <ImageIcon size={12} className="text-primary" /> Background Image
                                </label>
                                <div className="relative group">
                                    <div className={`aspect-[4/3] lg:aspect-[4/5] rounded-md md:rounded-md overflow-hidden transition-all ${imagePreview ? 'border-primary/20' : 'border-gray-100 bg-gray-50'}`}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Hero Background" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                                                <ImageIcon size={64} className="opacity-20" />
                                                <p className="text-xs font-black uppercase tracking-widest text-center px-4">No Image Selected</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="bg-white text-[#001c3d] px-6 py-3 rounded-md font-black text-xs uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                                                Change Photo
                                                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                    </div>

                                </div>

                                <div className="pt-6 lg:pt-10">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full bg-primary hover:bg-[#e68d00] text-white py-3 rounded-md flex items-center justify-center gap-4 font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                                        {isSaving ? 'Saving Changes...' : 'Save Hero Settings'}
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </form>

            </div>
        </div>
    );
};

export default ManageHero;
