import React, { useState, useEffect } from 'react';
import api from '../../../api';
import {
    Save,
    Loader2,
    Plus,
    Trash2,
    Globe,
    Upload,
    X,
    ExternalLink
} from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';
import { SOCIAL_PLATFORMS as predefinedPlatforms, AVAILABLE_ICONS, getPlatformInfo } from '../../../data/socialPlatforms';

const ManageSocialLinks = () => {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newLink, setNewLink] = useState({ platform: 'Facebook', url: '', is_active: true });
    const [customPlatforms, setCustomPlatforms] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showPlatformCreator, setShowPlatformCreator] = useState(false);
    const [newPlatformName, setNewPlatformName] = useState('');
    const [iconMode, setIconMode] = useState('picker'); // 'picker' or 'upload'
    const [selectedIconName, setSelectedIconName] = useState('LinkIcon');
    const [customIconFile, setCustomIconFile] = useState(null);
    const [customIconPreview, setCustomIconPreview] = useState(null);

    // Merge predefined and custom platforms for the dropdown
    const allPlatforms = [...predefinedPlatforms, ...customPlatforms];



    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const response = await api.get('/social-links');
            const linksData = response.data;
            setLinks(linksData);

            // Discover custom platforms from links
            const discoveredCustom = [];
            linksData.forEach(link => {
                const isPredefined = predefinedPlatforms.some(p => p.name === link.platform);
                const alreadyFound = discoveredCustom.some(p => p.name === link.platform);

                if (!isPredefined && !alreadyFound) {
                    const platformInfo = getPlatformInfo(link.platform, link.icon_url);
                    discoveredCustom.push({
                        name: link.platform,
                        icon: platformInfo.icon,
                        color: platformInfo.color,
                        icon_url: link.icon_url,
                        isCustom: true
                    });
                }
            });
            setCustomPlatforms(discoveredCustom);
        } catch (error) {
            console.error('Failed to fetch social links:', error);
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
            iconUrl = customIconPreview; // Temporary local preview
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

        // 1. Add to the custom list
        setCustomPlatforms(prev => [...prev.filter(p => p.name !== platformName), newPlatform]);

        // 2. Select the new platform
        setNewLink(prev => ({ ...prev, platform: platformName }));

        // 3. Reset all creator states and CLOSE dropdown
        setShowPlatformCreator(false);
        setIsDropdownOpen(false);
        setNewPlatformName('');
        setCustomIconFile(null);
        setCustomIconPreview(null);
        setSelectedIconName('LinkIcon');
    };

    const handleDeletePlatform = (e, platformName) => {
        e.stopPropagation();

        const inUse = links.some(l => l.platform === platformName);
        if (inUse) {
            alert(`Cannot remove "${platformName}" because it is currently used by one or more social links. Delete the links first.`);
            return;
        }

        if (!window.confirm(`Remove "${platformName}" from the dropdown?`)) return;

        setCustomPlatforms(prev => prev.filter(p => p.name !== platformName));
        if (newLink.platform === platformName) {
            setNewLink({ ...newLink, platform: 'Facebook' });
        }
    };



    const handleAddLink = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const selectedPlatform = allPlatforms.find(p => p.name === newLink.platform);

        try {
            let response;
            if (selectedPlatform?.file) {
                // Use FormData for file uploads
                const formData = new FormData();
                formData.append('platform', newLink.platform);
                formData.append('url', newLink.url);
                formData.append('is_active', newLink.is_active);
                formData.append('icon', selectedPlatform.file);

                response = await api.post('/social-links', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Use JSON for standard or icon picker links
                const payload = {
                    platform: newLink.platform,
                    url: newLink.url,
                    is_active: newLink.is_active,
                    icon_url: selectedPlatform?.isCustom ? selectedPlatform.icon_url : null
                };
                response = await api.post('/social-links', payload);
            }

            setLinks([...links, response.data]);
            setNewLink({ platform: 'Facebook', url: '', is_active: true });
            fetchLinks();
        } catch (error) {
            console.error('Failed to add link:', error);
            alert('Failed to add social link.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteLink = async (id) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;

        try {
            await api.delete(`/social-links/${id}`);
            setLinks(links.filter(link => link.id !== id));
        } catch (error) {
            console.error('Failed to delete link:', error);
            alert('Failed to delete link.');
        }
    };

    const toggleStatus = async (link) => {
        try {
            const response = await api.patch(`/social-links/${link.id}`, {
                is_active: !link.is_active
            });
            setLinks(links.map(l => l.id === link.id ? response.data : l));
        } catch (error) {
            console.error('Failed to toggle status:', error);
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
        <div className="p-8 max-w-5xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-2xl font-black text-[#001c3d] tracking-tight">Social Media Management</h1>
                <p className="text-gray-500 mt-2 font-medium">Connect with your community through your social channels.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New Link Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
                        <h2 className="text-lg font-bold text-[#001c3d] mb-6 flex items-center gap-2">
                            <Plus size={20} className="text-[#ff9d01]" /> Add New Link
                        </h2>

                        <form onSubmit={handleAddLink} className="space-y-4">
                            <div className="space-y-1 relative">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Platform</label>
                                <div
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent hover:border-[#ff9d01]/10 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                                    onClick={() => {
                                        setIsDropdownOpen(!isDropdownOpen);
                                        setShowPlatformCreator(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const p = allPlatforms.find(pl => pl.name === newLink.platform) || allPlatforms[0];
                                            const Icon = p.icon;
                                            return (
                                                <>
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white overflow-hidden shadow-inner" style={{ backgroundColor: p.color }}>
                                                        {p.isCustom && p.icon_url && !p.icon_url.startsWith('icon:') ? (
                                                            <img src={getImageUrl(p.icon_url)} alt={p.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Icon size={16} />
                                                        )}
                                                    </div>
                                                    <span className="font-bold text-[#001c3d]">{p.name}</span>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    <Plus size={18} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-45' : ''}`} />
                                </div>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] py-2 overflow-hidden animate-slideUp">
                                        {!showPlatformCreator ? (
                                            <>
                                                <div className="max-h-60 overflow-y-auto">
                                                    {allPlatforms.map(p => {
                                                        const Icon = p.icon;
                                                        return (
                                                            <div
                                                                key={p.name}
                                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group/item transition-colors"
                                                                onClick={() => {
                                                                    setNewLink({ ...newLink, platform: p.name });
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white overflow-hidden shadow-inner" style={{ backgroundColor: p.color }}>
                                                                        {p.isCustom && p.icon_url && !p.icon_url.startsWith('icon:') ? (
                                                                            <img src={getImageUrl(p.icon_url)} alt={p.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <Icon size={16} />
                                                                        )}
                                                                    </div>
                                                                    <span className="font-bold text-[#001c3d]">{p.name}</span>
                                                                </div>

                                                                {p.isCustom && (
                                                                    <button
                                                                        onClick={(e) => handleDeletePlatform(e, p.name)}
                                                                        className={`p-1.5 transition-all rounded-md flex items-center justify-center ${links.some(l => l.platform === p.name)
                                                                            ? 'text-gray-200 cursor-not-allowed'
                                                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                                            }`}
                                                                        title={links.some(l => l.platform === p.name) ? "Platform in use" : "Remove from list"}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="border-t border-gray-50 mt-1">
                                                    <div
                                                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer flex items-center gap-3 transition-colors text-[#ff9d01]"
                                                        onClick={() => {
                                                            setShowPlatformCreator(true);
                                                            setSelectedIconName('LinkIcon'); // Pre-select an icon
                                                        }}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#ff9d01] text-white">
                                                            <Plus size={16} />
                                                        </div>
                                                        <span className="font-bold">Add Custom Platform...</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-4 space-y-4 animate-fadeIn">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Platform</h3>
                                                    <button onClick={() => setShowPlatformCreator(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Platform Name (e.g. TikTok)"
                                                    autoFocus
                                                    value={newPlatformName}
                                                    onChange={(e) => setNewPlatformName(e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#ff9d01]/30 font-bold text-[#001c3d] text-sm"
                                                />

                                                <div className="flex bg-gray-50 p-1 rounded-xl">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIconMode('picker');
                                                            setCustomIconFile(null);
                                                            setCustomIconPreview(null);
                                                            setSelectedIconName('LinkIcon');
                                                        }}
                                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${iconMode === 'picker' ? 'bg-white text-[#ff9d01] shadow-sm' : 'text-gray-400'}`}
                                                    >
                                                        Pick Icon
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIconMode('upload');
                                                            setSelectedIconName('');
                                                        }}
                                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${iconMode === 'upload' ? 'bg-white text-[#ff9d01] shadow-sm' : 'text-gray-400'}`}
                                                    >
                                                        Upload Icon
                                                    </button>
                                                </div>

                                                {iconMode === 'picker' ? (
                                                    <div className="space-y-2">
                                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Select Icon</h3>
                                                        <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 bg-gray-50 rounded-lg border border-gray-100">
                                                            {AVAILABLE_ICONS.map(i => {
                                                                const Icon = i.icon;
                                                                return (
                                                                    <div
                                                                        key={i.name}
                                                                        onClick={() => setSelectedIconName(i.name)}
                                                                        className={`aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all ${selectedIconName === i.name ? 'bg-[#ff9d01] text-white shadow-md scale-105' : 'bg-white text-gray-400 hover:text-[#ff9d01]'}`}
                                                                    >
                                                                        <Icon size={14} />
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Upload Icon</h3>
                                                        <div className="relative aspect-square w-full h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group hover:border-[#ff9d01]/30 transition-colors">
                                                            {customIconPreview ? (
                                                                <img src={customIconPreview} alt="Preview" className="w-full h-full object-contain p-2" />
                                                            ) : (
                                                                <div className="text-center text-gray-300">
                                                                    <Upload size={24} className="mx-auto mb-2" />
                                                                    <span className="block text-[10px] font-black uppercase tracking-tight">Image or SVG</span>
                                                                    <span className="block text-[8px] mt-1 text-gray-400 font-bold">MAX 500KB</span>
                                                                </div>
                                                            )}
                                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                                                            {customIconPreview && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); setCustomIconPreview(null); setCustomIconFile(null); }}
                                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={handleCreatePlatform}
                                                    disabled={!newPlatformName.trim() || (iconMode === 'upload' && !customIconFile) || (iconMode === 'picker' && !selectedIconName)}
                                                    className="w-full bg-[#ff9d01] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#e68d00] transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                                                >
                                                    Add Platform
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL / Link</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://facebook.com/yourschool"
                                    value={newLink.url}
                                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01]/20 focus:bg-white rounded-xl outline-none transition-all font-bold text-[#001c3d]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-[#ff9d01] hover:bg-[#e68d00] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                {isSaving ? 'Saving...' : 'Add Social Link'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Links List */}
                <div className="lg:col-span-2 space-y-4">
                    {links.length === 0 ? (
                        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <Globe size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-[#001c3d]">No links added yet</h3>
                            <p className="text-gray-500 mt-2 font-medium">Add your first social media link using the form.</p>
                        </div>
                    ) : (
                        links.map((link) => {
                            const platformInfo = getPlatformInfo(link.platform, link.icon_url);
                            const PlatformIcon = platformInfo.icon;

                            return (
                                <div key={link.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group animate-fadeIn">
                                    <div className="flex items-center gap-5">
                                        <div
                                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg overflow-hidden"
                                            style={{ backgroundColor: platformInfo.color }}
                                        >
                                            {link.icon_url ? (
                                                <img src={getImageUrl(link.icon_url)} alt={link.platform} className="w-full h-full object-cover" />
                                            ) : (
                                                <PlatformIcon size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-[#001c3d] flex items-center gap-2">
                                                {link.platform}
                                                {!link.is_active && (
                                                    <span className="text-[9px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Inactive</span>
                                                )}
                                            </h3>
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-gray-400 hover:text-[#ff9d01] flex items-center gap-1 transition-colors font-medium lg:max-w-md truncate"
                                            >
                                                {link.url} <ExternalLink size={10} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => toggleStatus(link)}
                                            className={`p-2 rounded-xl transition-all ${link.is_active ? 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-400 hover:text-white'}`}
                                            title={link.is_active ? 'Deactivate' : 'Activate'}
                                        >
                                            <Save size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLink(link.id)}
                                            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageSocialLinks;
