import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { Save, Loader2, Image as ImageIcon, Layout, Type, Facebook, Linkedin, Instagram, AlertCircle, Plus, Trash2, ChevronDown, Upload, X, ExternalLink, Globe, Link as LinkIcon, User, Quote } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';
import { SOCIAL_PLATFORMS, AVAILABLE_ICONS, getPlatformInfo } from '../../../data/socialPlatforms';

const ManagePrincipal = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        principal_name: '',
        principal_role: 'Principal',
        principal_message: '',
        social_links: [],
        is_active: true
    });

    // Dropdown & Platform Creator State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showPlatformCreator, setShowPlatformCreator] = useState(false);
    const [newPlatformName, setNewPlatformName] = useState('');
    const [iconMode, setIconMode] = useState('picker'); // 'picker' or 'upload'
    const [selectedIconName, setSelectedIconName] = useState('Globe');
    const [customIconFile, setCustomIconFile] = useState(null);
    const [customIconPreview, setCustomIconPreview] = useState(null);
    const [customPlatforms, setCustomPlatforms] = useState([]);
    const [newLink, setNewLink] = useState({ platform: 'Facebook', url: '' });

    const allPlatforms = [...SOCIAL_PLATFORMS, ...customPlatforms];

    useEffect(() => {
        fetchPrincipalContent();
    }, []);

    const fetchPrincipalContent = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/ui/principal-message');
            if (response.data) {
                let socialLinks = response.data.social_links || [];

                // Ensure socialLinks is an array
                if (typeof socialLinks === 'string') {
                    try {
                        socialLinks = JSON.parse(socialLinks);
                    } catch (e) {
                        console.error('Error parsing social_links:', e);
                        socialLinks = [];
                    }
                }

                if (!Array.isArray(socialLinks)) {
                    socialLinks = [];
                }

                // Discover custom platforms from fetched links
                const discoveredCustom = [];
                socialLinks.forEach(link => {
                    const isPredefined = SOCIAL_PLATFORMS.some(p => p.name === link.platform);
                    const alreadyFound = discoveredCustom.some(p => p.name === link.platform);
                    if (!isPredefined && !alreadyFound) {
                        const info = getPlatformInfo(link.platform, link.icon_url);
                        discoveredCustom.push({
                            name: link.platform,
                            icon: info.icon,
                            color: info.color || '#ff9d01',
                            icon_url: link.icon_url,
                            isCustom: true
                        });
                    }
                });
                console.log('DEBUG: Principal Social Links:', socialLinks);
                setCustomPlatforms(discoveredCustom);
                console.log('DEBUG: Discovered Custom Platforms:', discoveredCustom);

                // Initial migration logic: 
                if (socialLinks.length === 0) {
                    const legacy = [
                        { platform: 'Facebook', url: response.data.facebook_url, is_active: true },
                        { platform: 'Twitter', url: response.data.twitter_url, is_active: true },
                        { platform: 'LinkedIn', url: response.data.linkedin_url, is_active: true },
                        { platform: 'Instagram', url: response.data.instagram_url, is_active: true },
                    ].filter(l => l.url);
                    socialLinks = legacy;
                }

                setFormData({
                    principal_name: response.data.principal_name || '',
                    principal_role: response.data.principal_role || 'Principal',
                    principal_message: response.data.principal_message || '',
                    social_links: socialLinks,
                    is_active: response.data.is_active
                });

                if (response.data.principal_image_url) {
                    setImagePreview(getImageUrl(response.data.principal_image_url));
                }
            }
        } catch (error) {
            console.error('Failed to fetch principal content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCustomIconFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setCustomIconPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCreatePlatform = () => {
        const platformName = newPlatformName.trim();
        if (!platformName) return;

        let icon = null;
        let iconUrl = null;
        let fileObj = null;

        if (iconMode === 'picker') {
            if (!selectedIconName) return;
            const found = AVAILABLE_ICONS.find(i => i.name === selectedIconName);
            if (!found) return;
            icon = found.icon;
            iconUrl = `icon:${selectedIconName}`;
        } else {
            if (!customIconFile) return;
            iconUrl = customIconPreview;
            fileObj = customIconFile;
        }

        const newPlatform = {
            name: platformName,
            icon: icon,
            color: '#ff9d01',
            icon_url: iconUrl,
            file: fileObj,
            isCustom: true
        };

        setCustomPlatforms(prev => [...prev.filter(p => p.name !== platformName), newPlatform]);
        setNewLink({ ...newLink, platform: platformName });
        setShowPlatformCreator(false);
        setIsDropdownOpen(false);
        setNewPlatformName('');
        setCustomIconFile(null);
        setCustomIconPreview(null);
    };

    const handleDeletePlatform = (e, platformName) => {
        e.stopPropagation();
        const inUse = formData.social_links.some(l => l.platform === platformName);
        if (inUse) {
            alert(`Cannot remove "${platformName}" because it is used. Delete the links first.`);
            return;
        }
        if (!window.confirm(`Remove "${platformName}" from list?`)) return;
        setCustomPlatforms(prev => prev.filter(p => p.name !== platformName));
    };

    const handleAddLink = () => {
        if (!newLink.url.trim()) return;

        const platformObj = allPlatforms.find(p => p.name === newLink.platform);
        const dynamicLink = {
            platform: newLink.platform,
            url: newLink.url,
            is_active: true,
            icon_url: platformObj?.isCustom ? platformObj.icon_url : null,
            file: platformObj?.isCustom ? platformObj.file : null // Store file to upload later
        };

        setFormData(prev => ({
            ...prev,
            social_links: [...prev.social_links, dynamicLink]
        }));
        setNewLink({ platform: 'Facebook', url: '' });
    };

    const removeLink = (index) => {
        setFormData(prev => ({
            ...prev,
            social_links: prev.social_links.filter((_, i) => i !== index)
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();

        // Add basic fields
        data.append('principal_name', formData.principal_name);
        data.append('principal_role', formData.principal_role);
        data.append('principal_message', formData.principal_message);
        data.append('is_active', formData.is_active);

        // Prep social links - strip files from the JSON we send
        const linksToSubmit = formData.social_links.map((link, idx) => {
            if (link.file) {
                // Append the file with a specific key the backend expects
                data.append(`social_icon_${idx}`, link.file);
            }
            // Return link without binary file
            const { file, ...cleanLink } = link;
            return cleanLink;
        });

        const validLinks = Array.isArray(linksToSubmit) ? linksToSubmit : [];
        data.append('social_links', JSON.stringify(validLinks));

        if (imageFile) {
            data.append('principal_image', imageFile);
        }

        try {
            await api.patch('/ui/principal-message', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Principal message updated successfully!');
            fetchPrincipalContent();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to update principal message.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Loading Settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-black text-[#001c3d] tracking-tight flex items-center gap-3">
                        <Type className="text-[#ff9d01]" size={32} />
                        Principal Message Management
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage the principal's identity, message, and social portfolio.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest ${formData.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {formData.is_active ? 'Visible on Website' : 'Hidden'}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Top Section: Identity & Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 h-full">
                            <h2 className="text-lg font-bold text-[#001c3d] mb-6 flex items-center gap-2 border-b pb-4">
                                <User size={20} className="text-[#ff9d01]" />
                                Principal Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.principal_name}
                                        onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ff9d01]/20 focus:border-[#ff9d01] outline-none transition-all font-bold text-[#001c3d]"
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Designation</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.principal_role}
                                        onChange={(e) => setFormData({ ...formData, principal_role: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ff9d01]/20 focus:border-[#ff9d01] outline-none transition-all font-bold text-[#001c3d]"
                                        placeholder="e.g. Principal"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message Content</label>
                                    <textarea
                                        required
                                        value={formData.principal_message}
                                        onChange={(e) => setFormData({ ...formData, principal_message: e.target.value })}
                                        rows={10}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#ff9d01]/20 focus:border-[#ff9d01] outline-none transition-all font-bold text-[#001c3d] resize-none leading-relaxed"
                                        placeholder="Type the principal's message here..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Portrait & Status */}
                    <div className="space-y-8">
                        {/* Profile Photo */}
                        <div className="bg-white p-8 rounded-md shadow-sm border border-gray-100 flex flex-col items-center">
                            <h2 className="text-lg font-bold text-[#001c3d] mb-6 self-start flex items-center gap-2 border-b w-full pb-4">
                                <ImageIcon size={20} className="text-[#ff9d01]" />
                                Portrait
                            </h2>
                            <div className="relative group w-full max-w-[220px]">
                                <div className="aspect-[3/4] bg-gray-50 rounded-md overflow-hidden border-2 border-gray-100 relative shadow-inner">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                            <User size={48} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="bg-white text-[#001c3d] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-lg hover:scale-105 transition-transform">
                                            Update Photo
                                            <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-4 font-black uppercase tracking-widest">3:4 Ratio Recommended</p>
                        </div>

                    </div>
                </div>

                {/* Social Media Section */}
                <div className=" border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <Globe size={18} className="text-[#ff9d01]" />
                        <h2 className="text-xl font-black text-[#001c3d] tracking-tight uppercase">Social Media Profiles</h2>
                    </div>

                    <div className="bg-white p-10 rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100/50">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                            {/* Left Column: Add Form */}
                            <div className="lg:col-span-5 space-y-8  ">
                                <div className="space-y-6 border-r border-gray-300 p-4 ">
                                    {/* Platform Selector */}
                                    <div className="space-y-2 relative ">
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1">Platform</label>
                                        <div
                                            className="w-full px-6 py-4 bg-[#f8faff] border-2 border-transparent hover:border-[#ff9d01]/10 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                                            onClick={() => {
                                                setIsDropdownOpen(!isDropdownOpen);
                                                setShowPlatformCreator(false);
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                {(() => {
                                                    const p = allPlatforms.find(pl => pl.name === newLink.platform) || allPlatforms[0];
                                                    const Icon = p.icon;
                                                    return (
                                                        <>
                                                            <div
                                                                className="w-10 h-10 rounded-md flex items-center justify-center text-white overflow-hidden shadow-sm"
                                                                style={{ backgroundColor: p.color || '#ff9d01' }}
                                                            >
                                                                {p.isCustom && p.icon_url && !p.icon_url.startsWith('icon:') ? (
                                                                    <img src={getImageUrl(p.icon_url)} alt={p.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    Icon ? <Icon size={20} /> : <Globe size={20} />
                                                                )}
                                                            </div>
                                                            <span className="font-bold text-[#001c3d] text-base">{p.name}</span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                            <Plus size={20} className={`text-gray-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-45' : ''}`} />
                                        </div>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-[24px] shadow-2xl z-[100] py-3 overflow-hidden animate-slideUp">
                                                {!showPlatformCreator ? (
                                                    <>
                                                        <div className="max-h-64 overflow-y-auto px-2">
                                                            {allPlatforms.map(p => {
                                                                const Icon = p.icon;
                                                                return (
                                                                    <div
                                                                        key={p.name}
                                                                        className="px-4 py-3 hover:bg-[#f8faff] rounded-md cursor-pointer flex items-center justify-between group/item transition-colors"
                                                                        onClick={() => {
                                                                            setNewLink({ ...newLink, platform: p.name });
                                                                            setIsDropdownOpen(false);
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <div
                                                                                className="w-8 h-8 rounded-md flex items-center justify-center text-white overflow-hidden"
                                                                                style={{ backgroundColor: p.color || '#ff9d01' }}
                                                                            >
                                                                                {p.isCustom && p.icon_url && !p.icon_url.startsWith('icon:') ? (
                                                                                    <img src={getImageUrl(p.icon_url)} alt={p.name} className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    Icon ? <Icon size={16} /> : <Globe size={16} />
                                                                                )}
                                                                            </div>
                                                                            <span className="font-bold text-[#001c3d]">{p.name}</span>
                                                                        </div>
                                                                        {p.isCustom && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => handleDeletePlatform(e, p.name)}
                                                                                className={`p-1.5 transition-all rounded-md flex items-center justify-center ${formData.social_links.some(l => l.platform === p.name)
                                                                                    ? 'text-gray-200 cursor-not-allowed'
                                                                                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                                                    }`}
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        <div className="border-t border-gray-50 mt-2 p-2">
                                                            <div
                                                                className="px-4 py-3 hover:bg-orange-50 rounded-md cursor-pointer flex items-center gap-3 transition-colors text-[#ff9d01]"
                                                                onClick={() => {
                                                                    setShowPlatformCreator(true);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                            >
                                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#ff9d01] text-white shadow-sm">
                                                                    <Plus size={16} />
                                                                </div>
                                                                <span className="font-bold">New Platform...</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>

                                    {/* URL Input */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1">Profile Link</label>
                                        <div className="relative group">
                                            <input
                                                type="url"
                                                placeholder="https://platform.com/username"
                                                value={newLink.url}
                                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                                className="w-full px-6 py-4 bg-[#f8faff] border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-md outline-none transition-all font-bold text-[#001c3d]"
                                            />
                                            <LinkIcon size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-[#ff9d01] transition-colors" />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddLink}
                                        disabled={!newLink.url.trim()}
                                        className="w-full bg-[#ff9d01] hover:bg-[#e68d00] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                                    >
                                        <Plus size={24} />
                                        Add Link
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Links List */}
                            <div className="lg:col-span-7">
                                {formData.social_links.length === 0 ? (
                                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[40px] p-8 text-center bg-gray-50/30">
                                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 shadow-sm mb-6">
                                            <Globe size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#001c3d]">No links added</h3>
                                        <p className="text-gray-400 mt-2 font-medium max-w-[240px]">Your social profiles will appear here once added.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.social_links.map((link, idx) => {
                                            const info = getPlatformInfo(link.platform, link.icon_url);
                                            const Icon = info.icon;
                                            return (
                                                <div key={idx} className="bg-[#f8faff] p-5 rounded-md border border-gray-50/50 flex items-center justify-between group animate-fadeIn transition-all hover:bg-white hover:shadow-xl hover:shadow-[#001c3d]/5 hover:border-[#ff9d01]/20">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div
                                                            className="w-14 h-14 rounded-md flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0"
                                                            style={{ backgroundColor: info.color || '#ff9d01' }}
                                                        >
                                                            {link.icon_url && !link.icon_url.startsWith('icon:') ? (
                                                                <img src={getImageUrl(link.icon_url)} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                Icon ? <Icon size={24} /> : <Globe size={24} />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-black text-[#001c3d] uppercase tracking-wider text-[11px] truncate">{link.platform}</h4>
                                                                {link.is_active === false && (
                                                                    <span className="text-[8px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Off</span>
                                                                )}
                                                            </div>
                                                            <a
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] text-gray-400 hover:text-[#ff9d01] flex items-center gap-1.5 transition-colors font-bold truncate max-w-[140px]"
                                                            >
                                                                {link.url.replace(/^https?:\/\//, '')} <ExternalLink size={8} />
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updatedLinks = [...formData.social_links];
                                                                updatedLinks[idx] = { ...updatedLinks[idx], is_active: !updatedLinks[idx].is_active };
                                                                setFormData({ ...formData, social_links: updatedLinks });
                                                            }}
                                                            className={`p-2.5 rounded-xl transition-all shadow-sm ${link.is_active !== false ? 'bg-white text-green-500 hover:bg-green-500 hover:text-white' : 'bg-gray-200 text-gray-400 hover:bg-gray-400 hover:text-white'}`}
                                                            title={link.is_active !== false ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {link.is_active !== false ? <Save size={16} /> : <Globe size={16} />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLink(idx)}
                                                            className="p-2.5 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Global Save Action */}
                <div className="bg-white p-8 rounded-md shadow-2xl shadow-gray-200 border border-[#ff9d01]/10 flex flex-col md:flex-row items-center justify-between gap-8 animate-fadeIn">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-md flex items-center justify-center text-[#ff9d01] shadow-inner">
                            <AlertCircle size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#001c3d] uppercase tracking-tight">Final Step: Save Changes</h3>
                            <p className="text-gray-400 text-sm font-medium">All message edits and social profiles must be saved to go live.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                        {/* <div
                                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.is_active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}
                                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${formData.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                        {formData.is_active ? 'Visible Live' : 'Hidden'}
                                    </span>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                </div> */}

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-12 py-3 bg-[#001c3d] hover:bg-[#002b5c] text-white rounded-md flex items-center justify-center gap-4 font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50 min-w-[240px]"
                        >
                            {isSaving ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} className="text-[#ff9d01]" />}
                            {isSaving ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Custom Platform Modal */}
            {showPlatformCreator && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-sm rounded-md overflow-hidden shadow-2xl animate-scaleUp">
                        <div className="bg-[#001c3d] p-8 text-white relative">
                            <button
                                onClick={() => setShowPlatformCreator(false)}
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-xl font-black text-[#ff9d01] flex items-center gap-3">
                                <Plus size={24} /> CREATE PLATEFORM
                            </h2>
                            <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-widest leading-relaxed">Customize your social portfolio with a unique platform.</p>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Platform Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. TikTok"
                                    value={newPlatformName}
                                    onChange={(e) => setNewPlatformName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01]/30 rounded-md outline-none font-bold text-[#001c3d]"
                                />
                            </div>

                            <div className="flex bg-gray-100 p-1 rounded-md">
                                <button
                                    type="button"
                                    onClick={() => setIconMode('picker')}
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${iconMode === 'picker' ? 'bg-white text-[#ff9d01] shadow-sm' : 'text-gray-400'}`}
                                >
                                    Pick Icon
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIconMode('upload')}
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${iconMode === 'upload' ? 'bg-white text-[#ff9d01] shadow-sm' : 'text-gray-400'}`}
                                >
                                    Upload Icon
                                </button>
                            </div>

                            {/* Icon Selection Logic */}
                            {iconMode === 'picker' ? (
                                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-md border border-gray-100 scrollbar-thin scrollbar-thumb-gray-200">
                                    {AVAILABLE_ICONS.map(i => {
                                        const I = i.icon;
                                        return (
                                            <div
                                                key={i.name}
                                                onClick={() => setSelectedIconName(i.name)}
                                                className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all ${selectedIconName === i.name ? 'bg-[#ff9d01] text-white shadow-lg scale-110' : 'bg-white text-gray-400 hover:text-[#ff9d01]'}`}
                                            >
                                                <I size={18} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="relative aspect-square w-full h-32 bg-gray-50 rounded-md border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group">
                                    {customIconPreview ? (
                                        <img src={customIconPreview} alt="Preview" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
                                    ) : (
                                        <div className="text-center text-gray-300">
                                            <Upload size={32} className="mx-auto mb-2" />
                                            <span className="block text-[10px] font-black uppercase tracking-widest">Image or SVG</span>
                                        </div>
                                    )}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                                    {customIconPreview && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setCustomIconPreview(null); setCustomIconFile(null); }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:scale-110 transition-transform z-10"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleCreatePlatform}
                                disabled={!newPlatformName.trim() || (iconMode === 'upload' && !customIconFile)}
                                className="w-full bg-[#ff9d01] hover:bg-[#e68d00] text-white py-4 rounded-md font-black uppercase tracking-widest shadow-lg shadow-orange-100 transition-all active:scale-95 disabled:opacity-30"
                            >
                                Confirm Platform
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default ManagePrincipal;
