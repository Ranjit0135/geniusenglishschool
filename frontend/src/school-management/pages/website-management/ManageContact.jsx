import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { CheckCircle, Loader2, Phone, Mail, MapPin, Globe, AlignLeft, Info, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';
import PageHeroSettings from '../../components/PageHeroSettings';

const ManageContact = () => {
    const [formData, setFormData] = useState({
        address: '',
        email: '',
        phone: '',
        map_url: '',
        description: '',
        hero_image_url: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/ui/contact');
            if (response.data) {
                setFormData({
                    address: response.data.address || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    map_url: response.data.map_url || '',
                    description: response.data.description || '',
                    hero_image_url: response.data.hero_image_url || ''
                });
                if (response.data.hero_image_url) {
                    setImagePreview(getImageUrl(response.data.hero_image_url));
                }
            }
        } catch (error) {
            console.error('Failed to fetch contact info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        const data = new FormData();
        data.append('address', formData.address);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('map_url', formData.map_url);
        data.append('description', formData.description);
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            await api.patch('/ui/contact', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: 'Contact information updated successfully!' });
            fetchContactInfo(); // Refresh to get latest data and URLs
        } catch (error) {
            console.error('Update failed:', error);
            setMessage({ type: 'error', text: 'Failed to update contact information.' });
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
                    <Phone className="text-[#ff9d01]" size={32} />
                    Manage Contact Information
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Update your school's contact details and map location.</p>
            </div>

            <PageHeroSettings pageKey="contact" pageTitle="Contact Page" />

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Address */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                <MapPin size={14} className="text-[#ff9d01]" />
                                Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                placeholder="e.g. Sorakhutte, Kathmandu"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                <Mail size={14} className="text-[#ff9d01]" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                placeholder="e.g. contact@genius.edu.np"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                <Phone size={14} className="text-[#ff9d01]" />
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                placeholder="e.g. +977 1234567890"
                            />
                        </div>

                        {/* Map URL */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                                <Globe size={14} className="text-[#ff9d01]" />
                                Google Maps Iframe URL
                            </label>
                            <input
                                type="text"
                                value={formData.map_url}
                                onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                                className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                placeholder="The 'src' attribute from Google Maps embed code"
                            />
                            <p className="text-[10px] text-gray-400 font-medium ml-1 flex items-center gap-1">
                                <Info size={10} />
                                Go to Google Maps {'>'} Share {'>'} Embed a map {'>'} Copy ONLY the URL in 'src'
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                            <AlignLeft size={14} className="text-[#ff9d01]" />
                            Intro Description
                        </label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-medium text-gray-600 leading-relaxed"
                            placeholder="A short message for the contact page..."
                        />
                    </div>

                </div>

                <div className="max-w-xs">
                    {message.text && (
                        <div className={`mb-4 p-4 rounded-2xl text-xs font-bold animate-fadeIn ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
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
            </form>
        </div>
    );
};

export default ManageContact;
