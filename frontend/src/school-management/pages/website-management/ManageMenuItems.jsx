import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../api';
import { Plus, Edit, Trash2, X, ChevronRight, ListTree } from 'lucide-react';

const ManageMenuItems = () => {
    const [navItems, setNavItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        label: '',
        path: '',
        order: 0,
        parent_id: '',
        is_visible: true
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/public/navigation');
            // The API returns nested structure { school: ..., menu: [...] }
            setNavItems(response.data.menu || []);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Flatten nested items for table view
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

    // Top-level items that can be parents
    const potentialParents = useMemo(() => navItems.filter(item => !item.parent_id), [navItems]);

    const handleEdit = (item) => {
        setFormData({
            label: item.label,
            path: item.path,
            order: item.order,
            parent_id: item.parent_id || '',
            is_visible: item.is_visible
        });
        setEditingId(item.id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this navigation item?')) {
            try {
                await api.delete(`/public/navigation/${id}`);
                fetchItems();
            } catch (error) {
                console.error('Failed to delete item:', error);
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            label: '',
            path: '',
            order: 0,
            parent_id: '',
            is_visible: true
        });
        setEditingId(null);
        setIsAdding(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                parent_id: formData.parent_id === "" ? null : formData.parent_id
            };

            if (editingId) {
                await api.patch(`/public/navigation/${editingId}`, submissionData);
            } else {
                await api.post('/public/navigation', submissionData);
            }

            handleCancel();
            fetchItems();
        } catch (error) {
            console.error('Failed to save nav item:', error);
        }
    };

    if (isLoading && navItems.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9d01]"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-black text-[#001c3d] tracking-tight flex items-center gap-3">
                        <ListTree className="text-[#ff9d01]" size={32} />
                        Navigation Menu
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your website's main menu links and hierarchy</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#ff9d01] hover:bg-[#e68d00] text-white px-6 py-2 rounded-xl flex items-center gap-3 font-bold transition-all shadow-lg shadow-orange-100 active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add New Entry</span>
                    </button>
                )}
            </div>

            {/* Form Section - Logic from Reference, Design stays Professional */}
            {isAdding && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-10 animate-slideDown">
                    <div className="px-8 py-6 bg-gradient-to-r from-[#001c3d] to-[#012b5a] flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">
                            {editingId ? 'Edit Navigation Item' : 'Create New Navigation Entry'}
                        </h2>
                        <button onClick={handleCancel} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Menu Label</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                    placeholder="e.g. Gallery"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Route Path (Link)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.path}
                                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                    placeholder="e.g. /gallery or #section"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Sort Order</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Parent Item (Optional)</label>
                                <select
                                    value={formData.parent_id}
                                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-[#ff9d01] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-700 appearance-none cursor-pointer"
                                >
                                    <option value="">None (Top Level)</option>
                                    {potentialParents.filter(item => item.id !== editingId).map(item => (
                                        <option key={item.id} value={item.id}>{item.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-3 cursor-pointer group bg-gray-50 p-3 rounded-xl border border-transparent hover:border-gray-200 w-full transition-all">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_visible}
                                        onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-300 text-[#ff9d01] focus:ring-[#ff9d01]"
                                    />
                                    <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Publicly Visible</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-bold transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-[#ff9d01] text-white rounded-xl font-bold hover:bg-[#e68d00] transition-all shadow-lg shadow-orange-100 active:scale-95"
                            >
                                {editingId ? 'Update Item' : 'Create Item'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#001c3d] text-white">
                            <tr>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Navigation Label</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Route Path</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-center">Order</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Type</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {allItemsFlat.map((item) => (
                                <tr key={item.id} className={`hover:bg-gray-50/50 transition-all ${item.parent_id ? 'bg-gray-50/20' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center font-bold text-[#001c3d]" style={{ paddingLeft: `${item.level * 32}px` }}>
                                            {item.level > 0 && <span className="text-gray-400 mr-2 font-light">└─</span>}
                                            {item.label}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">{item.path}</td>
                                    <td className="px-6 py-4 text-center text-gray-700 font-bold">{item.order}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.parent_id ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {item.parent_id ? 'Sub-item' : 'Main Menu'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors inline-flex border border-transparent hover:border-blue-100"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors inline-flex border border-transparent hover:border-red-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {allItemsFlat.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500 font-bold">
                                        No menu items found. Click "Add New Entry" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageMenuItems;
