import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { Upload, X, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';

const ManageLogo = () => {
    const [logoPreview, setLogoPreview] = useState(null);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [currentLogo, setCurrentLogo] = useState('');
    const [schoolName, setSchoolName] = useState('');

    useEffect(() => {
        fetchSchoolDetails();
    }, []);

    const fetchSchoolDetails = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/public/navigation');
            if (response.data.school) {
                setCurrentLogo(response.data.school.logo);
                setLogoPreview(getImageUrl(response.data.school.logo));
                setSchoolName(response.data.school.name || '');
            }
        } catch (error) {
            console.error('Failed to fetch school details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Logo size must be less than 2MB' });
                return;
            }
            setSelectedLogo(file);
            setLogoPreview(URL.createObjectURL(file));
            setMessage({ type: '', text: '' });
        }
    };

    const handleSave = async () => {
        if (!selectedLogo && !schoolName) return;

        setIsSaving(true);
        const formData = new FormData();
        if (selectedLogo) {
            formData.append('logo', selectedLogo);
        }
        formData.append('name', schoolName);

        try {
            await api.patch('/public/school/logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage({ type: 'success', text: 'Branding updated successfully!' });
            setSelectedLogo(null);
            fetchSchoolDetails();
        } catch (error) {
            console.error('Update failed:', error);
            setMessage({ type: 'error', text: 'Failed to update branding.' });
        } finally {
            setIsSaving(false);
        }
    };

    const removeSelectedLogo = () => {
        setSelectedLogo(null);
        setLogoPreview(getImageUrl(currentLogo));
    };

    return (
        <div className="p-8 max-w-6xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="mb-10">
                <h1 className="text-2xl font-black text-[#001c3d] tracking-tight">Logo & Branding</h1>
                <p className="text-gray-500 mt-2 font-medium">Update your school logo and identity across the entire platform.</p>
            </div>

            <div className="bg-white rounded-md shadow-premium border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-12 lg:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Preview Area */}
                        <div className="space-y-6">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Current Identity Preview
                            </label>
                            <div className="relative group aspect-[16/6] bg-[#001c3d] rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all shadow-xl">
                                {isLoading ? (
                                    <Loader2 className="animate-spin text-white/30" size={48} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        {logoPreview && (
                                            <img
                                                src={logoPreview}
                                                alt="Logo"
                                                className="max-h-[80px] object-contain drop-shadow-xl"
                                            />
                                        )}
                                        <p className="text-2xl font-black text-white italic tracking-tighter">
                                            {schoolName || 'Your School'}
                                        </p>
                                    </div>
                                )}

                                {selectedLogo && (
                                    <button
                                        onClick={removeSelectedLogo}
                                        className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-xl shadow-lg hover:bg-white transition-all hover:scale-110"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Settings Form */}
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                                        School Name
                                    </label>
                                    <input
                                        type="text"
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        placeholder="Enter school name"
                                        className="w-full bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white p-5 rounded-2xl text-heading font-bold outline-none transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Website Logo
                                    </label>
                                    <label className="relative cursor-pointer block">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                        />
                                        <div className="bg-[#001c3d] hover:bg-[#002a5c] text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-xl active:scale-95 group">
                                            <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                                            <span className="text-xs uppercase tracking-widest">{selectedLogo ? 'Change Logo' : 'Choose Logo'}</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || (!selectedLogo && !schoolName)}
                                    className="w-full bg-primary hover:bg-[#e68d00] text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={24} className="animate-spin" />
                                            <span>Saving Changes...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={20} />
                                            <span>Update Branding</span>
                                        </>
                                    )}
                                </button>

                                {message.text && (
                                    <div className={`mt-6 p-5 rounded-2xl text-[13px] font-bold animate-fadeIn flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                        <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        {message.text}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageLogo;
