import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import api from '../../../../api';

const ListStudents = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/students');
            setStudents(response.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/students/${id}`);
                setStudents(students.filter(student => student.id !== id));
            } catch (error) {
                console.error('Failed to delete student:', error);
            }
        }
    };

    const filteredStudents = students.filter(student =>
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admission_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9d01]"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#001c3d] tracking-tight">Student Management</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage all student records, admissions, and details.</p>
                </div>
                <Link
                    to="/school-admin/students/add"
                    className="bg-[#ff9d01] hover:bg-[#e68d00] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-orange-100 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Add New Student</span>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or admission ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#ff9d01] focus:ring-0 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#001c3d] text-white">
                            <tr>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Student Info</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Admission ID</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Class/Sec</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Contact</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm overflow-hidden">
                                                    {student.photo_url ? (
                                                        <img src={student.photo_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        `${student.first_name[0]}${student.last_name[0]}`
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#001c3d]">{student.first_name} {student.last_name}</div>
                                                    <div className="text-xs text-gray-500">{student.gender}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600 font-bold">{student.admission_id || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <div className="font-bold">{student.class}</div>
                                            <div className="text-xs text-gray-500">Section {student.section}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div>{student.phone}</div>
                                            <div className="text-xs text-gray-400">{student.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                to={`/school-admin/students/edit/${student.id}`}
                                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors inline-flex"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors inline-flex"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No students found matching your search.
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

export default ListStudents;
