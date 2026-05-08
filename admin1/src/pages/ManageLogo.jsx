import { useState, useEffect } from 'react';
import api from '../api';
import {
    Upload,
    CheckCircle,
    Loader2,
    Sparkles,
    Image as ImageIcon,
    Save,
    X,
    Shield
} from 'lucide-react';

const ManageLogo = () => {
    const [logoPreview, setLogoPreview] = useState(null);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [schoolName, setSchoolName] = useState('');
    const [currentLogo, setCurrentLogo] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/public/navigation');
            if (response.data.school) {
                setSchoolName(response.data.school.name || '');
                setCurrentLogo(response.data.school.logo || '');
                if (response.data.school.logo) {
                    setLogoPreview(`http://localhost:5001/uploads/${response.data.school.logo}`);
                }
            }
        } catch (error) {
            console.error('Failed to fetch navbar data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Logo size exceeds 2MB limit' });
                return;
            }
            setSelectedLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleIdentitySave = async () => {
        setIsSaving(true);
        const data = new FormData();
        if (selectedLogo) data.append('logo', selectedLogo);
        data.append('name', schoolName);

        try {
            await api.patch('/public/school/logo', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: 'Branding updated successfully!' });
            setSelectedLogo(null);
            fetchData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update branding.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Branding Engine...</span>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700 font-base mt-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-2xl font-black text-primary tracking-tight uppercase italic underline decoration-primary/20 underline-offset-8 flex items-center gap-3">
                        <Shield size={28} className="text-accent" />
                        Logo & Branding
                    </h1>
                    <p className="text-gray-500 mt-3 font-bold text-sm tracking-wide">Update your school logo and identity across the entire platform.</p>
                </div>
            </div>

            <div className="bg-white rounded-md shadow-premium border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-12 lg:p-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
                        {/* Preview Area */}
                        <div className="space-y-8 bg-[#f8f9fb] p-8 rounded-2xl border border-gray-100/50">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Sparkles size={14} className="text-orange-400" /> Current Identity Signal
                            </label>
                            <div className="relative group aspect-[16/8] bg-[#001c3d] rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all shadow-premium border-4 border-white">
                                {isLoading ? (
                                    <Loader2 className="animate-spin text-white/30" size={48} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-6 p-10">
                                        {logoPreview && (
                                            <img
                                                src={logoPreview}
                                                alt="Logo"
                                                className="max-h-[100px] w-auto object-contain drop-shadow-2xl transition-transform group-hover:scale-110 duration-700"
                                            />
                                        )}
                                        <div className="text-center space-y-1">
                                            <p className="text-2xl font-black text-white italic tracking-tighter uppercase">
                                                {schoolName || 'Your School'}
                                            </p>
                                            <div className="h-0.5 w-12 bg-[#ff9d01] mx-auto opacity-50 group-hover:w-20 transition-all duration-700"></div>
                                        </div>
                                    </div>
                                )}

                                {selectedLogo && (
                                    <button
                                        onClick={handleIdentitySave}
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
                                        Digital Brandmark
                                    </label>
                                    <label className="relative cursor-pointer block">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                        />
                                        <div className="bg-[#001c3d] hover:bg-[#002a5c] text-white px-8 py-5 rounded-2xl flex items-center justify-center gap-4 font-black transition-all shadow-xl shadow-blue-900/10 active:scale-95 group">
                                            <Upload size={20} className="group-hover:-translate-y-1 transition-transform text-[#ff9d01]" />
                                            <span className="text-[11px] uppercase tracking-widest leading-none">{selectedLogo ? 'Update Brandmark' : 'Upload Asset'}</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <button
                                    onClick={handleIdentitySave}
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
