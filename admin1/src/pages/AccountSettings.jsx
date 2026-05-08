import { useState, useEffect } from 'react';
import api from '../api';
import { Save, Shield, Key, Loader2, Mail, Lock, Sparkles } from 'lucide-react';

const AccountSettings = () => {
    const [profile, setProfile] = useState({
        email: ''
    });
    const [security, setSecurity] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingSecurity, setIsSavingSecurity] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/profile');
                if (response.data) {
                    setProfile({
                        email: response.data.email || ''
                    });
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSecurityChange = (e) => {
        setSecurity({ ...security, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setMessage({ type: '', text: '' });
        try {
            await api.patch('/auth/profile', {
                email: profile.email
            });
            setMessage({ type: 'success', text: 'Email updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update email.' });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSecuritySubmit = async (e) => {
        e.preventDefault();
        if (security.newPassword !== security.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setIsSavingSecurity(true);
        setMessage({ type: '', text: '' });
        try {
            await api.patch('/auth/profile', {
                password: security.newPassword
            });
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setSecurity({ newPassword: '', confirmPassword: '' });
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password.' });
        } finally {
            setIsSavingSecurity(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Account...</span>
        </div>
    );

    return (
        <div className="p-8 max-w-4xl mx-auto bg-gray-50/30 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700 font-base">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-2xl font-black text-primary tracking-tight uppercase italic flex items-center gap-3">
                        <Shield size={28} className="text-accent" />
                        Account Settings
                    </h1>
                    <p className="text-gray-500 mt-2 font-bold text-sm tracking-wide">Update your login email and password.</p>
                </div>
                {message.text && (
                    <div className={`px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest animate-in slide-in-from-right-10 duration-500 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {/* Email Section */}
                <div className="bg-white p-10 rounded-3xl shadow-premium border border-gray-100">
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <Mail size={20} className="text-primary" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#001c3d]">Administrator Email</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current/New Email</label>
                            <div className="relative group/input">
                                <Mail size={18} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleProfileChange}
                                    className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-primary transition-all outline-none"
                                    placeholder="admin@genius.edu.np"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="bg-primary hover:bg-[#e68d00] text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSavingProfile ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSavingProfile ? 'Updating...' : 'Update Email'}
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white p-10 rounded-3xl shadow-premium border border-gray-100">
                    <form onSubmit={handleSecuritySubmit} className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <Key size={20} className="text-primary" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#001c3d]">Administrative Key</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                                <div className="relative group/input">
                                    <Lock size={18} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={security.newPassword}
                                        onChange={handleSecurityChange}
                                        className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-primary transition-all outline-none"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm Password</label>
                                <div className="relative group/input">
                                    <Shield size={18} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={security.confirmPassword}
                                        onChange={handleSecurityChange}
                                        className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-primary transition-all outline-none"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSavingSecurity}
                            className="bg-[#001c3d] hover:bg-[#002a5c] text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isSavingSecurity ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-accent" />}
                            {isSavingSecurity ? 'Updating...' : 'Set New Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
