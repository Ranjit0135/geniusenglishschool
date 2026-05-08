import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

const PageHeroSettings = ({ pageKey, pageTitle }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/ui/school');
            if (response.data && response.data[`${pageKey}_hero_image_url`]) {
                setImagePreview(getImageUrl(response.data[`${pageKey}_hero_image_url`]));
            }
        } catch (error) {
            console.error(`Failed to fetch ${pageKey} hero settings:`, error);
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
        if (!imageFile) return;

        setIsSaving(true);
        const formData = new FormData();
        formData.append(`${pageKey}_hero`, imageFile);

        try {
            await api.patch('/ui/school', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(`${pageTitle} hero image updated successfully!`);
            setImageFile(null);
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to update hero image.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center justify-center h-20">
                    <Loader2 className="animate-spin text-primary" size={24} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 mb-8">
            <h2 className="text-lg font-black text-[#001c3d] tracking-tight flex items-center gap-3 mb-6">
                <ImageIcon className="text-primary" size={24} />
                {pageTitle} Hero Image
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-64 h-40 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative group">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Hero Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                            <ImageIcon size={32} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                        </div>
                    )}
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Upload className="text-white" size={24} />
                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                    </label>
                </div>

                <div className="flex-1 space-y-4">
                    <p className="text-sm text-gray-500 font-medium">
                        Upload a custom background image for the {pageTitle} page hero section.
                    </p>
                    <button
                        type="submit"
                        disabled={isSaving || !imageFile}
                        className="bg-primary hover:bg-[#e68d00] text-white px-6 py-2.5 rounded-md flex items-center gap-3 font-bold transition-all shadow-lg shadow-orange-100 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? 'Updating...' : 'Update Hero Image'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PageHeroSettings;
