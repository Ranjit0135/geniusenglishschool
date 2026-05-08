import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import api from '../../../../api';

const AddStudent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: 'Male',
        dob: '',
        blood_group: '',
        religion: '',
        email: '',
        phone: '',
        address: '',
        admission_id: '',
        roll: '',
        class: '',
        section: '',
        bio: '',
        photo_url: ''
    });

    useEffect(() => {
        if (isEditing) {
            fetchStudent();
        }
    }, [id]);

    const fetchStudent = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/students/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error('Failed to fetch student:', error);
            alert('Failed to load student data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditing) {
                await api.put(`/students/${id}`, formData);
            } else {
                await api.post('/students', formData);
            }
            navigate('/school-admin/students');
        } catch (error) {
            console.error('Failed to save student:', error);
            alert(error.response?.data?.message || 'Failed to save student');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && isEditing && !formData.first_name) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen bg-gray-50/30">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/school-admin/students')}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-[#001c3d]" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-[#001c3d] tracking-tight">
                        {isEditing ? 'Edit Student' : 'Add New Student'}
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        {isEditing ? 'Update student information' : 'Enter details for a new student admission'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#001c3d] mb-6 pb-2 border-b border-gray-100">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">First Name</label>
                            <input
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Last Name</label>
                            <input
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Blood Group</label>
                            <input
                                name="blood_group"
                                value={formData.blood_group}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Religion</label>
                            <input
                                name="religion"
                                value={formData.religion}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#001c3d] mb-6 pb-2 border-b border-gray-100">Academic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Admission ID</label>
                            <input
                                name="admission_id"
                                value={formData.admission_id}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Class</label>
                            <input
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Class 10"
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Section</label>
                            <input
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                placeholder="e.g. A"
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Roll Number</label>
                            <input
                                name="roll"
                                value={formData.roll}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#001c3d] mb-6 pb-2 border-b border-gray-100">Contact Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Phone</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] outline-none transition-all font-medium resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#ff9d01] hover:bg-[#e68d00] text-white px-8 py-3 rounded-xl flex items-center gap-3 font-bold transition-all shadow-lg shadow-orange-100 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        <span>{isLoading ? 'Saving...' : 'Save Student'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
