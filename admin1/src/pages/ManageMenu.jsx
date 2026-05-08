import { useState, useEffect, useMemo } from 'react';
import api from '../api';
import {
    Plus,
    Edit,
    Trash2,
    ListTree,
    X,
    Sparkles,
    Layout,
    Link as LinkIcon,
    ArrowUpDown,
    Save,
    Loader2,
    Menu
} from 'lucide-react';

const ManageMenu = () => {
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
            setNavItems(response.data.menu || []);
        } catch (error) {
            console.error('Failed to fetch navbar data:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Menu Engine...</span>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700 font-base mt-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-2xl font-black text-primary tracking-tight uppercase italic underline decoration-primary/20 underline-offset-8 flex items-center gap-3">
                        <Menu size={28} className="text-accent" />
                        Navigation Architecture
                    </h1>
                    <p className="text-gray-500 mt-3 font-bold text-sm tracking-wide">Refine your site's structure and menu organization.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full md:w-auto bg-primary hover:bg-[#e68d00] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-orange-100 transition-all active:scale-95"
                    >
                        <Plus size={18} /> New Navigation Entry
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`p-6 rounded-2xl font-bold text-[13px] uppercase tracking-widest border-l-4 shadow-sm mb-8 animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-500' : 'bg-rose-50 text-rose-700 border-rose-500'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-10">
                {isAdding && (
                    <div className="bg-white p-10 lg:p-14 rounded-md shadow-premium border border-gray-100 relative overflow-hidden animate-in slide-in-from-top-10 duration-500">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 flex items-center gap-4">
                                <span className="p-2 bg-primary/5 rounded-lg"><Sparkles size={16} className="text-primary" /></span>
                                {editingId ? 'Modify Terminal' : 'Internal Signal Configuration'}
                            </h3>
                            <button onClick={resetMenuForm} className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-xl transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleMenuSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Entry Descriptor (Label)</label>
                                    <input
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                        className="w-full px-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-black text-primary outline-none transition-all"
                                        placeholder="e.g. Academic Excellence"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Terminal Route (Link)</label>
                                    <div className="relative group/input">
                                        <LinkIcon size={18} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                        <input
                                            value={formData.path}
                                            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                            className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-primary outline-none transition-all"
                                            placeholder="/path or #anchor"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Priority Selection</label>
                                    <div className="relative group/input">
                                        <ArrowUpDown size={18} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                            className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-black text-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Parent Hierarchy</label>
                                    <select
                                        value={formData.parent_id}
                                        onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                        className="w-full px-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-black text-[11px] uppercase tracking-widest text-primary outline-none appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">Root Level Architecture</option>
                                        {potentialParents.filter(item => item.id !== editingId).map(item => (
                                            <option key={item.id} value={item.id}>{item.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-4 bg-[#f8f9fb] p-5 rounded-2xl w-full border border-gray-100 cursor-pointer hover:bg-white transition-all group/toggle">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_visible}
                                            onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary h-6 w-6 transition-all"
                                        />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/toggle:text-primary">Deploy to Signal (Public)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end pt-8 border-t border-gray-50">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full md:w-auto bg-primary hover:bg-[#e68d00] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {editingId ? 'Push Manifest Changes' : 'Initialize Terminal Entry'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-md border border-gray-100 shadow-premium overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#001c3d] text-white">
                                <tr>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Hierarchy</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Manifest Path</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-center">Execution Order</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-right">Direct Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {allItemsFlat.map((item) => (
                                    <tr key={item.id} className="group hover:bg-[#f8f9fb] transition-all duration-300">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6" style={{ paddingLeft: `${item.level * 48}px` }}>
                                                {item.level > 0 && (
                                                    <span className="text-primary/30 font-black text-xl leading-none -mt-1 tracking-tighter shrink-0 select-none">
                                                        └─
                                                    </span>
                                                )}
                                                <div className={`p-3 rounded-xl shadow-sm transition-transform duration-500 group-hover:scale-110 ${item.level === 0 ? 'bg-primary/10 text-primary' : 'bg-[#001c3d]/5 text-[#001c3d]'}`}>
                                                    {item.level === 0 ? <Layout size={18} /> : <ListTree size={18} />}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <span className="font-black text-primary uppercase italic tracking-tight block text-lg group-hover:text-accent transition-colors">{item.label}</span>
                                                    {!item.is_visible && (
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 flex items-center gap-1">
                                                            <div className="w-1 h-1 bg-rose-400 rounded-full animate-pulse"></div> Internal Only
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <code className="text-[11px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg italic">{item.path}</code>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <span className="text-sm font-black text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">{item.order}</span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button
                                                    onClick={() => handleEditItem(item)}
                                                    className="p-3.5 bg-white text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100 active:scale-90"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-3.5 bg-white text-gray-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-gray-100 active:scale-90"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMenu;
