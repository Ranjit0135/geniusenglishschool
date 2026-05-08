import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { Plus, Edit2, Trash2, BookOpen, User, GraduationCap, Image as ImageIcon, Loader2, Save, X } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';

import PageHeroSettings from '../../components/PageHeroSettings';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        teacher: '',
        grade: '',
        category: '',
        description: '',
        sub_description: '',
        detailed_text: '',
        curriculum: ''
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/ui/courses');
            setCourses(response.data || []);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            teacher: '',
            grade: '',
            category: '',
            description: '',
            sub_description: '',
            detailed_text: '',
            curriculum: ''
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (course) => {
        setFormData({
            title: course.title,
            teacher: course.teacher || '',
            grade: course.grade || '',
            category: course.category || '',
            description: course.description || '',
            sub_description: course.sub_description || '',
            detailed_text: course.detailed_text || '',
            curriculum: Array.isArray(course.curriculum) ? course.curriculum.join('\n') : ''
        });
        setImagePreview(getImageUrl(course.image_url));
        setEditingId(course.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'curriculum') {
                const curriculumArray = formData.curriculum
                    .split('\n')
                    .map(item => item.trim())
                    .filter(item => item !== '');
                data.append(key, JSON.stringify(curriculumArray));
            } else {
                data.append(key, formData[key]);
            }
        });
        if (imageFile) data.append('image', imageFile);

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (editingId) {
                await api.patch(`/ui/courses/${editingId}`, data, config);
            } else {
                await api.post('/ui/courses', data, config);
            }
            fetchCourses();
            resetForm();
        } catch (error) {
            console.error('Failed to save course:', error);
            alert('Failed to save course.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await api.delete(`/ui/courses/${courseId}`);
            fetchCourses();
        } catch (error) {
            console.error('Failed to delete course:', error);
            alert('Failed to delete course.');
        }
    };

    if (isLoading && courses.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-black text-[#001c3d] tracking-tight flex items-center gap-3">
                        <BookOpen className="text-primary" size={32} />
                        Courses Management
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage the learning programs offered by your school.</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary hover:bg-[#e68d00] text-white px-6 py-2.5 rounded-md flex items-center gap-3 font-bold transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Add New Course</span>
                    </button>
                )}
            </div>

            <PageHeroSettings pageKey="courses" pageTitle="Courses Page" />

            {showForm && (
                <div className="bg-white p-8 rounded-md shadow-xl border border-gray-100 mb-10 animate-slideDown">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                        <h2 className="text-xl font-black text-[#001c3d] flex items-center gap-2">
                            {editingId ? <Edit2 size={20} className="text-primary" /> : <Plus size={20} className="text-primary" />}
                            {editingId ? 'Edit Course' : 'Create New Course'}
                        </h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Course Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-bold text-gray-700"
                                        placeholder="e.g., Art Program For Kids"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Teacher Name</label>
                                    <input
                                        type="text"
                                        value={formData.teacher}
                                        onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-bold text-gray-700"
                                        placeholder="e.g., Carol Smith"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Grade / Level</label>
                                    <input
                                        type="text"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-bold text-gray-700"
                                        placeholder="e.g., Grade 3"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Category (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-bold text-gray-700"
                                        placeholder="e.g., Arts, Science"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Short Description (for list)</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-medium text-gray-600 leading-relaxed"
                                    placeholder="Enter short description for specific course..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Sub Description (Highlight)</label>
                                <textarea
                                    rows={2}
                                    value={formData.sub_description}
                                    onChange={(e) => setFormData({ ...formData, sub_description: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-medium text-[#e24b4b] italic leading-relaxed"
                                    placeholder="Enter highlighted sub-description..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Detailed Text</label>
                                <textarea
                                    rows={4}
                                    value={formData.detailed_text}
                                    onChange={(e) => setFormData({ ...formData, detailed_text: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-medium text-gray-600 leading-relaxed"
                                    placeholder="Enter full course details..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Curriculum (One item per line)</label>
                                <textarea
                                    rows={5}
                                    value={formData.curriculum}
                                    onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-md outline-none transition-all font-medium text-gray-600 leading-relaxed"
                                    placeholder="Drawing&#10;Painting&#10;Sculpture"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <ImageIcon size={12} className="text-primary" /> Course Image
                            </label>
                            <div className="relative group aspect-[4/3] rounded-md overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-primary transition-all">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                                        <ImageIcon size={48} className="opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-center px-4">Click to upload image</p>
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <span className="bg-white text-[#001c3d] px-4 py-2 rounded-md font-black text-[10px] uppercase tracking-widest shadow-xl">Choose Photo</span>
                                    <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full bg-primary hover:bg-[#e68d00] text-white py-4 rounded-md flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? 'Processing...' : (editingId ? 'Update Course' : 'Create Course')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-md shadow-md border border-gray-100 overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col">
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                            {course.image_url ? (
                                <img src={getImageUrl(course.image_url)} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <GraduationCap size={64} className="opacity-10" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(course)} className="p-2 bg-white text-blue-600 rounded-md shadow-lg hover:bg-blue-50 transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDelete(course.id);
                                    }}
                                    className="p-2 bg-white text-red-600 rounded-md shadow-lg hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-lg font-black text-[#001c3d] group-hover:text-primary transition-colors mb-4 line-clamp-1">{course.title}</h3>
                            <div className="space-y-2 mb-6 flex-1">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                    <User size={14} className="text-primary/60" />
                                    <span>Teacher: <span className="text-gray-700 font-medium">{course.teacher || 'TBA'}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                    <GraduationCap size={14} className="text-primary/60" />
                                    <span>Grade: <span className="text-gray-700 font-medium">{course.grade || 'N/A'}</span></span>
                                </div>
                            </div>
                            {course.category && (
                                <div className="mt-auto">
                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-md">
                                        {course.category}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {courses.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-white rounded-md shadow-sm border border-dashed border-gray-200">
                    <BookOpen size={64} className="mx-auto text-gray-200 mb-4 opacity-10" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No courses found. Add your first program!</p>
                </div>
            )}
        </div>
    );
};

export default ManageCourses;
