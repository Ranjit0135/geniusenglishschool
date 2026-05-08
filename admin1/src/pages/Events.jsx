import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit, Trash2, Calendar, MapPin, Clock, ChevronLeft, Save, Loader2, Image as ImageIcon, Send, Sparkles, Filter, Tally1 } from 'lucide-react';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        imageUrl: '',
        category: 'Academic',
        status: 'upcoming'
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            description: item.description,
            date: item.date,
            time: item.time || '',
            location: item.location || '',
            imageUrl: item.imageUrl || '',
            category: item.category || 'Academic',
            status: item.status || 'upcoming'
        });
        setCurrentId(item.id);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setFormData({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            time: '',
            location: '',
            imageUrl: '',
            category: 'Academic',
            status: 'upcoming'
        });
        setCurrentId(null);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (error) {
            console.error('Deletion failed:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (currentId) {
                await api.patch(`/events/${currentId}`, formData);
            } else {
                await api.post('/events', formData);
            }
            setIsEditing(false);
            fetchEvents();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !isEditing) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-accent animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Calendar...</span>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
            {!isEditing ? (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <div>
                            <h1 className="text-2xl font-black text-primary tracking-tight uppercase italic underline decoration-primary/20 underline-offset-8">School Calendar</h1>
                            <p className="text-gray-500 mt-3 font-bold text-sm tracking-wide">Schedule important dates, parent meetings, and institutional celebrations.</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="w-full md:w-auto bg-primary hover:bg-[#e68d00] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-orange-100 transition-all active:scale-95"
                        >
                            <Plus size={18} /> Schedule Event
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {events.length > 0 ? (
                            events.map((item) => (
                                <div key={item.id} className="bg-white rounded-md shadow-premium border border-gray-100 overflow-hidden group hover:scale-[1.01] transition-all duration-500 relative flex flex-col h-full">
                                    <div className="aspect-video relative overflow-hidden bg-[#f8f9fb]">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <Calendar size={48} strokeWidth={1} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button onClick={() => handleEdit(item)} className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-lg flex items-center justify-center">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg flex items-center justify-center">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-7 flex flex-col flex-1 gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-accent/10 text-accent rounded-lg border border-accent/10">
                                                {item.category}
                                            </span>
                                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'upcoming' ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                {item.status}
                                            </span>
                                        </div>

                                        <h3 className="text-[19px] font-bold text-gray-800 leading-[1.3] line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>

                                        <div className="space-y-3 mt-2">
                                            <div className="flex items-center gap-3 text-gray-500 font-bold text-[12px] uppercase tracking-wide">
                                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/5 transition-colors">
                                                    <Calendar size={14} className="text-primary" />
                                                </div>
                                                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                {item.time && (
                                                    <>
                                                        <div className="w-[1px] h-3 bg-gray-200 mx-1"></div>
                                                        <span className="text-gray-400">{item.time}</span>
                                                    </>
                                                )}
                                            </div>
                                            {item.location && (
                                                <div className="flex items-center gap-3 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                                                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary/5 transition-colors">
                                                        <MapPin size={14} className="text-primary/50" />
                                                    </div>
                                                    {item.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="md:col-span-2 xl:col-span-3 bg-white p-20 rounded-md shadow-premium border border-dashed border-gray-200 text-center flex flex-col items-center gap-6">
                                <div className="p-10 bg-gray-50 rounded-full text-gray-200">
                                    <Calendar size={100} strokeWidth={1} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-primary mb-2">Calendar is Clear</h3>
                                    <p className="text-gray-400 font-medium max-w-sm mx-auto">Build excitement by listing your upcoming school events, exams, and festivities.</p>
                                </div>
                                <button onClick={handleCreate} className="bg-primary hover:bg-accent text-white px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all shadow-xl shadow-orange-100">
                                    Schedule First Event
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in zoom-in-95 duration-500 font-base mt-4">
                    <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-header">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-4 bg-gray-50 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-primary hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                            <ChevronLeft size={18} className="inline mr-2" /> Back to Calendar
                        </button>
                        <button type="submit" disabled={isSaving} className="bg-primary hover:bg-[#e68d00] text-white px-12 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-orange-100 active:scale-95 transition-all">
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {currentId ? 'Synchronize Event' : 'Launch Event'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-10">
                            <div className="bg-white p-12 rounded-md shadow-premium border border-gray-100 space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Event Title</label>
                                    <input
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ex: Annual Sports Day 2026"
                                        className="w-full px-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-black text-2xl text-primary outline-none transition-all italic tracking-tight"
                                        required
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Description / Details</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="10"
                                        placeholder="Outline the schedule, performers, or rules..."
                                        className="w-full px-8 py-8 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-medium text-heading leading-relaxed outline-none transition-all resize-none font-base"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-10">
                            <div className="bg-white p-10 rounded-md shadow-premium border border-gray-100 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Visual Pointer (URL)</label>
                                    <div className="relative group/input">
                                        <ImageIcon size={18} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                        <input
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-primary outline-none transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-6 py-4 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl font-bold text-gray-700 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Time / Schedule</label>
                                        <input
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            placeholder="Ex: 10:00 AM - 4:00 PM"
                                            className="w-full px-6 py-4 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl font-bold text-gray-700 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Location</label>
                                        <input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Ex: Main Campus Ground"
                                            className="w-full px-6 py-4 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl font-bold text-gray-700 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Classification</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-8 py-4 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl font-black text-[10px] uppercase tracking-widest text-primary outline-none appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="Academic">Academic</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Exams">Exams</option>
                                        <option value="Holiday">Holidays</option>
                                    </select>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center space-y-4">
                                    <div className="p-4 bg-white rounded-full w-fit mx-auto shadow-sm text-accent border border-gray-50">
                                        <Sparkles size={20} />
                                    </div>
                                    <p className="text-[12px] font-bold text-gray-400 italic">"Events are where the community comes together. Keep it accurate and inviting!"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EventsPage;
