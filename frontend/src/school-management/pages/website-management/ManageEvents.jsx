import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import { Plus, Edit, Trash2, Calendar, Search, MapPin, Clock } from 'lucide-react';
import { getImageUrl } from '../../../utils/imageUtils';

import PageHeroSettings from '../../components/PageHeroSettings';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/events');
            setEvents(response.data || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading && events.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff9d01]"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-8xl mx-auto bg-gray-50/30 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-2xl font-black text-[#001c3d] tracking-tight flex items-center gap-3">
                        <Calendar className="text-[#ff9d01]" size={32} />
                        Event Management
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Keep your school community informed about upcoming events and dates.</p>
                </div>
                <button
                    onClick={() => navigate('/school-admin/website/event/add')}
                    className="bg-[#ff9d01] hover:bg-[#e68d00] text-white px-6 py-2 rounded-md flex items-center gap-3 font-bold transition-all shadow-lg shadow-orange-100 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Create New Event</span>
                </button>
            </div>

            <PageHeroSettings pageKey="event" pageTitle="Events Page" />

            <div className="bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9d01]/20 focus:border-[#ff9d01] transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#001c3d] text-white">
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-center">Image</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest">Event Detail</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-center">Date</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-center">Location</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-center">Status</th>
                                <th className="px-6 py-5 font-bold uppercase text-[11px] tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50/50 transition-all group">
                                    <td className="px-6 py-4 text-center">
                                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 mx-auto shadow-sm border border-gray-100">
                                            {event.image_url ? (
                                                <img src={getImageUrl(event.image_url)} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Calendar size={14} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <h3 className="font-bold text-[#001c3d] group-hover:text-[#ff9d01] transition-colors line-clamp-1">{event.title}</h3>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-1 italic">{event.description || 'No description'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-bold text-[#001c3d]">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1"><Clock size={10} /> {event.time_range || 'TBD'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="flex items-center justify-center gap-1 text-[11px] font-bold text-gray-500">
                                            <MapPin size={12} className="text-red-400" />
                                            {event.location || 'School Campus'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${event.is_published ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                            {event.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => navigate(`/school-admin/website/event/edit/${event.id}`)}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                            title="Edit Event"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                            title="Delete Event"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredEvents.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-bold">
                                        No events found.
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

export default ManageEvents;
