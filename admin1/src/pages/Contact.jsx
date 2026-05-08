import { useState, useEffect } from 'react';
import api from '../api';
import { Save, Info, MapPin, Phone, Mail, Globe, Loader2, Link as LinkIcon, ShieldCheck, Sparkles, Map } from 'lucide-react';

const ContactPage = () => {
    const [settings, setSettings] = useState({
        schoolName: '',
        tagline: '',
        address: '',
        phone: '',
        email: '',
        mapUrl: '',
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                if (response.data) setSettings(response.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.patch('/settings', settings);
            setMessage({ type: 'success', text: 'Contact & Identity manifest updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to synchronize settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-[#ff9d01] animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Configuration...</span>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700 font-base mt-2">
            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-[#001c3d] tracking-tight uppercase italic underline decoration-[#ff9d01]/20 underline-offset-8 flex items-center gap-4">
                            <Phone className="text-[#ff9d01]" size={32} />
                            Contact & Institutional Identity
                        </h2>
                        <p className="text-gray-500 mt-4 font-bold text-sm tracking-wide max-w-2xl">Manage the touchpoints, physical location, and core identity markers of the institution.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full md:w-auto bg-[#001c3d] hover:bg-[#002a5c] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-2xl shadow-blue-900/10 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin text-[#ff9d01]" /> : <Save size={20} className="text-[#ff9d01]" />}
                        {isSaving ? 'Synchronizing...' : 'Deploy Manifest'}
                    </button>
                </div>

                {message.text && (
                    <div className={`p-6 rounded-2xl font-bold text-[13px] uppercase tracking-widest border-l-4 shadow-md animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-500' : 'bg-rose-50 text-rose-700 border-rose-500'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Institutional Branding */}
                    <div className="bg-white p-10 lg:p-14 rounded-md shadow-premium border border-gray-100 relative overflow-hidden group">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#001c3d]/30 mb-12 flex items-center gap-4">
                            <span className="p-2.5 bg-[#f8f9fb] rounded-xl border border-gray-100"><ShieldCheck size={18} className="text-[#ff9d01]" /></span>
                            Institutional Identity
                        </h3>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Official Nameplate</label>
                                <input
                                    name="schoolName"
                                    value={settings.schoolName || ''}
                                    onChange={handleChange}
                                    placeholder="Genius English School"
                                    className="w-full px-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-2xl font-black text-[#001c3d] uppercase italic tracking-tighter text-lg transition-all outline-none placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Promotional Slogan</label>
                                <input
                                    name="tagline"
                                    value={settings.tagline || ''}
                                    onChange={handleChange}
                                    placeholder="Fostering Excellence"
                                    className="w-full px-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-2xl font-bold text-[#001c3d] italic transition-all outline-none placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="bg-white p-10 lg:p-14 rounded-md shadow-premium border border-gray-100 relative overflow-hidden group">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#001c3d]/30 mb-12 flex items-center gap-4">
                            <span className="p-2.5 bg-[#f8f9fb] rounded-xl border border-gray-100"><Mail size={18} className="text-[#ff9d01]" /></span>
                            Communication Touchpoints
                        </h3>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Physical Location</label>
                                <div className="relative group/input">
                                    <MapPin size={20} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#ff9d01] transition-colors" />
                                    <input
                                        name="address"
                                        value={settings.address || ''}
                                        onChange={handleChange}
                                        className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-2xl font-bold text-[#001c3d] transition-all outline-none"
                                        placeholder="Nayabazar, Kathmandu"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Voice Terminal</label>
                                    <div className="relative group/input">
                                        <Phone size={20} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#ff9d01] transition-colors" />
                                        <input
                                            name="phone"
                                            value={settings.phone || ''}
                                            onChange={handleChange}
                                            className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-2xl font-bold text-[#001c3d] transition-all outline-none"
                                            placeholder="+977-..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Digital Manifest (Email)</label>
                                    <div className="relative group/input">
                                        <Mail size={20} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#ff9d01] transition-colors" />
                                        <input
                                            name="email"
                                            value={settings.email || ''}
                                            onChange={handleChange}
                                            className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-2xl font-bold text-[#001c3d] transition-all outline-none"
                                            placeholder="info@school.edu"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media & Map */}
                    <div className="bg-white p-10 lg:p-14 rounded-md shadow-premium border border-gray-100 lg:col-span-2 relative overflow-hidden group">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#001c3d]/30 mb-12 flex items-center gap-4">
                            <span className="p-2.5 bg-[#f8f9fb] rounded-xl border border-gray-100"><Globe size={18} className="text-[#ff9d01]" /></span>
                            Global digital Presence & Map
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Google Maps Iframe (src URL)</label>
                                    <div className="relative group/input">
                                        <Map size={18} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#ff9d01] transition-colors" />
                                        <input name="mapUrl" value={settings.mapUrl || ''} onChange={handleChange} placeholder="https://www.google.com/maps/embed?..." className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-2xl font-bold text-[#001c3d] transition-all outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Facebook</label>
                                        <div className="relative group/input">
                                            <LinkIcon size={16} className="text-gray-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#ff9d01] transition-colors" />
                                            <input name="facebookUrl" value={settings.facebookUrl || ''} onChange={handleChange} placeholder="URL" className="w-full pl-12 pr-6 py-4 bg-[#f8f9fb] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-2xl font-bold text-[#001c3d] text-sm transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Instagram</label>
                                        <div className="relative group/input">
                                            <LinkIcon size={16} className="text-gray-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#ff9d01] transition-colors" />
                                            <input name="instagramUrl" value={settings.instagramUrl || ''} onChange={handleChange} placeholder="URL" className="w-full pl-12 pr-6 py-4 bg-[#f8f9fb] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-2xl font-bold text-[#001c3d] text-sm transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">YouTube</label>
                                        <div className="relative group/input">
                                            <LinkIcon size={16} className="text-gray-300 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#ff9d01] transition-colors" />
                                            <input name="youtubeUrl" value={settings.youtubeUrl || ''} onChange={handleChange} placeholder="URL" className="w-full pl-12 pr-6 py-4 bg-[#f8f9fb] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-2xl font-bold text-[#001c3d] text-sm transition-all outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Map Preview</label>
                                <div className="h-[240px] bg-[#f8f9fb] rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden">
                                    {settings.mapUrl ? (
                                        <iframe
                                            src={settings.mapUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    ) : (
                                        <div className="text-center p-6">
                                            <Map className="mx-auto text-gray-200 mb-2" size={32} />
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No terminal link provided</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ContactPage;
