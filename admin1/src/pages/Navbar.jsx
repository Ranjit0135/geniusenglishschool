import { useState, useEffect, useMemo } from 'react';
import api from '../api';
import {
    Plus,
    Edit,
    Trash2,
    ChevronRight,
    ListTree,
    Upload,
    X,
    CheckCircle,
    Image as ImageIcon,
    Loader2,
    Sparkles,
    Layout,
    Link as LinkIcon,
    Eye,
    EyeOff,
    ArrowUpDown,
    Save
} from 'lucide-react';

const NavbarManagement = () => {
    // Tabs state
    const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'identity'

    // Identity State
    const [logoPreview, setLogoPreview] = useState(null);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [schoolName, setSchoolName] = useState('');
    const [currentLogo, setCurrentLogo] = useState('');

    // Menu State
    const [navItems, setNavItems] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        label: '',
        path: '',
        order: 0,
        parent_id: '',
        is_visible: true
    });

    // Global UI State
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
                // Note: logo preview logic may need adjustment based on how backend serves files
                if (response.data.school.logo) {
                    setLogoPreview(`http://localhost:5001/uploads/${response.data.school.logo}`);
                }
            }
            setNavItems(response.data.menu || []);
        } catch (error) {
            console.error('Failed to fetch navbar data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Identity Logic ---
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
            setMessage({ type: 'success', text: 'Identity updated successfully!' });
            setSelectedLogo(null);
            fetchData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update branding.' });
        } finally {
            setIsSaving(false);
        }
    };

    // --- Menu Logic ---
    const allItemsFlat = useMemo(() => {
        const flattened = [];
        const traverse = (items, level = 0) => {
            if (!items) return;
            [...items].sort((a, b) => (a.order || 0) - (b.order || 0)).forEach(item => {
                flattened.push({ ...item, level });
                if (item.subItems && item.subItems.length > 0) {
                    traverse(item.subItems, level + 1);
                }
            });
        };
        traverse(navItems);
        return flattened;
    }, [navItems]);

    const potentialParents = useMemo(() => navItems.filter(item => !item.parent_id), [navItems]);

    const resetMenuForm = () => {
        setFormData({ label: '', path: '', order: 0, parent_id: '', is_visible: true });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleEditItem = (item) => {
        setFormData({
            label: item.label,
            path: item.path,
            order: item.order,
            parent_id: item.parent_id || '',
            is_visible: item.is_visible
        });
        setEditingId(item.id);
        setIsAdding(true);
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = { ...formData, parent_id: formData.parent_id || null };
            if (editingId) {
                await api.patch(`/public/navigation/${editingId}`, payload);
            } else {
                await api.post('/public/navigation', payload);
            }
            resetMenuForm();
            fetchData();
            setMessage({ type: 'success', text: 'Menu item saved!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save menu item.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Remove this navigation item? All sub-items will be unlinked.')) return;
        try {
            await api.delete(`/public/navigation/${id}`);
            fetchData();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Navbar Engine...</span>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-primary italic tracking-tight">Navbar Architect</h2>
                    <p className="text-slate-500 text-sm font-medium mt-2">Design the gateway to your school's digital presence.</p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-1 p-1 bg-slate-100/50 rounded-2xl w-full max-w-md mb-10 border border-slate-100">
                <button
                    onClick={() => setActiveTab('menu')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-primary/70'}`}
                >
                    <ListTree size={14} /> Navigation Menu
                </button>
                <button
                    onClick={() => setActiveTab('identity')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'identity' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-primary/70'}`}
                >
                    <Layout size={14} /> Brand Identity
                </button>
            </div>

            {message.text && (
                <div className={`p-6 rounded-2xl font-bold text-[13px] uppercase tracking-widest border-l-4 shadow-sm mb-8 animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-500' : 'bg-rose-50 text-rose-700 border-rose-500'}`}>
                    {message.text}
                </div>
            )}

            {activeTab === 'menu' ? (
                <div className="space-y-10">
                    {/* Menu Form Card */}
                    {isAdding && (
                        <div className="bg-white p-10 lg:p-14 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden animate-in slide-in-from-top-10 duration-500">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 flex items-center gap-4">
                                    <span className="p-2 bg-primary/5 rounded-lg"><Sparkles size={16} className="text-primary" /></span>
                                    {editingId ? 'Modify Entry' : 'New Navigation Entry'}
                                </h3>
                                <button onClick={resetMenuForm} className="text-slate-400 hover:text-rose-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleMenuSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Visible Label</label>
                                        <input
                                            value={formData.label}
                                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                            className="w-full px-8 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-primary focus:bg-white focus:border-primary transition-all underline-none"
                                            placeholder="e.g. Academic Excellence"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Route / Link</label>
                                        <div className="relative group/input">
                                            <LinkIcon size={18} className="text-slate-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                            <input
                                                value={formData.path}
                                                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                                className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-primary focus:bg-white focus:border-primary transition-all underline-none"
                                                placeholder="/path or #anchor"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority Order</label>
                                        <div className="relative group/input">
                                            <ArrowUpDown size={18} className="text-slate-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                            <input
                                                type="number"
                                                value={formData.order}
                                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                                className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-primary focus:bg-white focus:border-primary transition-all underline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Parent Group</label>
                                        <select
                                            value={formData.parent_id}
                                            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                            className="w-full px-8 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-widest text-primary focus:bg-white focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="">Root Level</option>
                                            {potentialParents.filter(item => item.id !== editingId).map(item => (
                                                <option key={item.id} value={item.id}>{item.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl w-full border border-slate-100 cursor-pointer hover:bg-white hover:border-primary/20 transition-all">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_visible}
                                                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                                                className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary"
                                            />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Public Visibility</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:bg-secondary hover:shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                                    >
                                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        {editingId ? 'Apply Manifest' : 'Commit to Menu'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Menu List Card */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-black text-primary italic tracking-tight">Menustructure Manifesto</h3>
                            {!isAdding && (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="bg-primary text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-secondary transition-all"
                                >
                                    <Plus size={16} /> New Entry
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Structural Hierarchy</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Destination</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Priority</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {allItemsFlat.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4" style={{ paddingLeft: `${item.level * 40}px` }}>
                                                    {item.level > 0 && <span className="text-slate-200">└─</span>}
                                                    <div className={`p-2 rounded-lg ${item.level === 0 ? 'bg-primary/5 text-primary' : 'bg-secondary/5 text-secondary'}`}>
                                                        <Layout size={16} />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-primary block">{item.label}</span>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                            {item.level === 0 ? 'Main Nav' : 'Sub Module'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <code className="text-xs font-bold text-slate-400 bg-slate-100/50 px-3 py-1 rounded-md">{item.path}</code>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="text-sm font-black text-primary">{item.order}</span>
                                            </td>
                                            <td className="px-10 py-6 text-right space-x-2">
                                                <button
                                                    onClick={() => handleEditItem(item)}
                                                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-90"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {allItemsFlat.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-10 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="p-6 bg-slate-50 rounded-full text-slate-200">
                                                        <ListTree size={40} />
                                                    </div>
                                                    <p className="text-slate-400 font-bold italic">No navigation links projected yet.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-10 lg:p-14 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        {/* Identity Preview Card */}
                        <div className="space-y-8">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <Eye size={16} className="text-secondary" /> Institutional Projection
                            </label>

                            <div className="relative aspect-[16/6] bg-slate-900 rounded-[2.5rem] overflow-hidden group/preview shadow-2xl ring-8 ring-slate-50">
                                <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logo" className="max-h-[80px] object-contain drop-shadow-[0_10px_10px_rgba(255,255,255,0.1)] transition-transform duration-700 group-hover/preview:scale-105" />
                                    ) : (
                                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-white/10 uppercase font-black text-[10px] tracking-widest border border-white/5">
                                            No Shield
                                        </div>
                                    )}
                                    <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                                        {schoolName || 'Institution Name'}
                                    </h4>
                                </div>
                                {selectedLogo && (
                                    <button
                                        onClick={() => { setSelectedLogo(null); setLogoPreview(currentLogo ? `http://localhost:5001/uploads/${currentLogo}` : null); }}
                                        className="absolute top-6 right-6 p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
                                    <span className="text-secondary font-black tracking-widest text-[10px] uppercase block mb-1">Preview Logic</span>
                                    This is how your institution will appear in the main navigation bar. Ensure the logo is legible against dark backgrounds.
                                </p>
                            </div>
                        </div>

                        {/* Identity Settings Form */}
                        <div className="space-y-12">
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Official Institution Name</label>
                                    <input
                                        type="text"
                                        value={schoolName}
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        className="w-full px-8 py-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] font-black text-2xl text-primary focus:bg-white focus:border-secondary transition-all outline-none italic tracking-tight"
                                        placeholder="Genius English School"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Shield (Logo)</label>
                                    <label className="relative block group/upload cursor-pointer">
                                        <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                        <div className="w-full p-10 border-4 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30 flex flex-col items-center gap-4 group-hover/upload:border-secondary group-hover/upload:bg-white transition-all">
                                            <div className="p-5 bg-white rounded-full shadow-lg text-slate-300 group-hover/upload:text-secondary group-hover/upload:scale-110 transition-all">
                                                <Upload size={32} />
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-[11px] font-black uppercase tracking-widest text-slate-500">Inject New Signal</span>
                                                <span className="text-[10px] text-slate-300 font-bold mt-1">PNG, JPG or SVG • Recommended 2MB max</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleIdentitySave}
                                disabled={isSaving || (!selectedLogo && !schoolName)}
                                className="w-full bg-primary text-white py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 hover:bg-secondary hover:shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                            >
                                {isSaving ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle size={24} />}
                                {isSaving ? 'Processing Manifest...' : 'Update Institutional Brand'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavbarManagement;
