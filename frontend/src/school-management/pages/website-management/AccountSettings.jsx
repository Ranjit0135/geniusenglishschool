import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Save, Loader2, User, Lock, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../../../api';
import { logout, updateUserInfo } from '../../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    const [formData, setFormData] = useState({
        currentPassword: '',
        name: user?.name || '',
        newEmail: user?.email || '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setIsLoading(false);
            return;
        }

        try {
            const hasCredentialChanges = (formData.newEmail !== user?.email) || (formData.newPassword !== '');

            const payload = {
                name: formData.name,
                newEmail: formData.newEmail,
                newPassword: formData.newPassword || undefined
            };

            // Only send currentPassword if credentials are being changed
            if (hasCredentialChanges) {
                payload.currentPassword = formData.currentPassword;
            }

            const response = await api.patch('/auth/update-credentials', payload);

            if (hasCredentialChanges) {
                setMessage({ type: 'success', text: 'Credentials updated successfully. Please login again with your new credentials.' });
                // Wait 2 seconds then logout since email/password changed
                setTimeout(() => {
                    dispatch(logout());
                    navigate('/login');
                }, 2000);
            } else {
                setMessage({ type: 'success', text: 'Profile updated successfully.' });
                // Update local Redux state immediately
                dispatch(updateUserInfo({ name: formData.name }));
                setFormData(prev => ({ ...prev, currentPassword: '' }));
            }

        } catch (error) {
            console.error('Update error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update credentials. Please check your current password.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fileInputRef = React.useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append('avatar', file);

        setIsUploading(true);
        setMessage({ text: null, type: '' });

        try {
            const response = await api.patch('/auth/avatar', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.status === 'success') {
                dispatch(updateUserInfo({ avatar_url: response.data.data.user.avatar_url }));
                setMessage({ type: 'success', text: 'Profile picture updated successfully.' });
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload profile picture.' });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleAvatarRemove = async () => {
        if (!window.confirm('Are you sure you want to remove your profile picture?')) return;

        setIsUploading(true);
        setMessage({ text: null, type: '' });

        try {
            const response = await api.patch('/auth/avatar', { remove: true });

            if (response.data.status === 'success') {
                dispatch(updateUserInfo({ avatar_url: null }));
                setMessage({ type: 'success', text: 'Profile picture removed successfully.' });
            }
        } catch (error) {
            console.error('Avatar remove error:', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to remove profile picture.' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-heading font-heading tracking-tight italic">
                        Account <span className="text-primary">Settings</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Update your profile name and login information</p>
                </div>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl font-bold text-sm flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                    {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-md p-8 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-heading mb-8 flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        Profile Picture
                    </h3>

                    <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#3db2d5] to-[#192f59] flex items-center justify-center font-black text-white text-5xl border-4 border-white shadow-2xl ring-1 ring-gray-100 uppercase tracking-tighter overflow-hidden">
                                {isUploading ? (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="drop-shadow-lg">{formData.name?.charAt(0) || user?.name?.charAt(0) || 'A'}</span>
                                )}
                            </div>
                            <div 
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            >
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">{isUploading ? 'Uploading...' : 'Change'}</span>
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="font-bold text-heading text-lg">Your Profile Photo</h4>
                            <p className="text-gray-400 text-sm mt-1 max-w-sm">This will be displayed on your dashboard and profile. High-quality square images work best.</p>
                            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                                <button 
                                    type="button" 
                                    disabled={isUploading}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 rounded-md text-xs font-black uppercase tracking-widest transition-colors"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload New'}
                                </button>
                                <button 
                                    type="button" 
                                    disabled={isUploading || !user?.avatar_url}
                                    onClick={handleAvatarRemove}
                                    className="px-5 py-2.5 text-red-500 hover:bg-red-50 disabled:opacity-30 rounded-md text-xs font-black uppercase tracking-widest transition-colors"
                                >
                                    Remove
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleAvatarUpload} 
                                    className="hidden" 
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-heading mb-6 pt-10 border-t border-gray-50 flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        Account Profile
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Name field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <User size={14} /> Display Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full bg-gray-50 border-0 rounded-md px-6 py-4 text-sm font-bold text-heading focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                required
                            />
                        </div>

                        {/* Current Password Field (Only required for sensitive changes) */}
                        <div className="space-y-2">
                            <label className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 border-b pb-1 ${
                                (formData.newEmail !== user?.email || formData.newPassword !== '') 
                                ? 'text-primary border-primary/20' 
                                : 'text-gray-400 border-transparent opacity-50'
                            }`}>
                                <Lock size={14} /> {(formData.newEmail !== user?.email || formData.newPassword !== '') ? 'Confirm Current Password' : 'Password Not Required'}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? "text" : "password"}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder={(formData.newEmail !== user?.email || formData.newPassword !== '') ? "Required to save changes" : "Optional for name update"}
                                    className={`w-full border-2 rounded-md px-6 py-4 text-sm font-bold text-heading focus:ring-2 focus:ring-primary/20 transition-all outline-none ${
                                        (formData.newEmail !== user?.email || formData.newPassword !== '')
                                        ? 'bg-primary/5 border-primary/10'
                                        : 'bg-gray-50 border-transparent cursor-default'
                                    }`}
                                    required={(formData.newEmail !== user?.email || formData.newPassword !== '')}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('current')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 pt-6 border-t border-gray-50 flex items-center gap-2">
                        <Lock size={16} /> Security Credentials
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
                        {/* Email field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Mail size={14} /> Registered Email
                            </label>
                            <input
                                type="email"
                                name="newEmail"
                                value={formData.newEmail}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full bg-gray-50 border-0 rounded-md px-6 py-4 text-sm font-bold text-heading focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* New Password field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Lock size={14} /> New Password (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current"
                                    className="w-full bg-gray-50 border-0 rounded-md px-6 py-4 text-sm font-bold text-heading focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('new')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <CheckCircle size={14} /> Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat new password"
                                    className="w-full bg-gray-50 border-0 rounded-md px-6 py-4 text-sm font-bold text-heading focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    required={formData.newPassword !== ''}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePassword('confirm')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-white px-10 py-4 rounded-md font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-heading transition-all duration-300 flex items-center gap-3 disabled:bg-gray-400 disabled:shadow-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AccountSettings;
