import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { getImageUrl } from '../../utils/imageUtils';
import { STATIC_EVENTS } from '../../data/eventData';
import { Loader2, ArrowRight, MapPin, Clock } from 'lucide-react';

const HomeEventsSection = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/events');
            if (response.data && response.data.length > 0) {
                setEvents(response.data.filter(e => e.is_published).slice(0, 3));
            } else {
                setEvents(STATIC_EVENTS.slice(0, 3));
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setEvents(STATIC_EVENTS.slice(0, 3));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && events.length === 0) {
        return (
            <div className="py-20 flex justify-center bg-white">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!isLoading && events.length === 0) return null;

    return (
        <section className="bg-white py-20 px-5 lg:py-24 overflow-hidden">
            <div className="container mx-auto max-w-[1180px]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-12 h-[2px] bg-primary"></span>
                            <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">Mark Your Calendar</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black font-heading text-heading italic tracking-tighter">
                            Upcoming <span className="text-primary">Events</span>
                        </h2>
                    </div>
                    <Link
                        to="/events"
                        className="group flex items-center gap-2 text-heading font-bold uppercase text-[12px] tracking-widest hover:text-primary transition-colors"
                    >
                        View All Events
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {events.map((event) => {
                        const eventDate = event.date ? new Date(event.date) : new Date();
                        return (
                            <Link
                                to={`/event/${event.slug}`}
                                key={event.id}
                                className="group relative flex flex-col bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-gray-200/50 hover:-translate-y-2 transition-all duration-500 border border-gray-50 h-full"
                            >
                                {/* Image Base */}
                                <div className="relative h-[280px] overflow-hidden">
                                    <img
                                        src={getImageUrl(event.image_url || event.image)}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                    {/* Date Float */}
                                    <div className="absolute top-6 left-6 flex flex-col items-center bg-white rounded-2xl p-3 min-w-[70px] shadow-2xl">
                                        <span className="text-primary font-black text-[1.5rem] leading-none mb-1">
                                            {eventDate.getDate().toString().padStart(2, '0')}
                                        </span>
                                        <span className="text-heading font-black text-[10px] uppercase tracking-widest">
                                            {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    </div>

                                    {/* Bottom Content Over Image */}
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <span className="bg-primary/90 backdrop-blur-sm text-white py-1 px-3 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block">
                                            {event.category || 'School Event'}
                                        </span>
                                        <h3 className="text-white text-xl md:text-2xl font-black font-heading italic leading-tight group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Info Footer */}
                                <div className="p-8 space-y-4 bg-white flex-1 flex flex-col">
                                    <div className="flex flex-wrap gap-6 text-[11px] font-black uppercase tracking-[0.15em] text-heading/40">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-primary" />
                                            <span>{event.time_range || event.time || 'TBA'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-primary" />
                                            <span className="line-clamp-1">{event.location || 'School Campus'}</span>
                                        </div>
                                    </div>
                                    <p className="text-text-main/60 text-sm line-clamp-2 italic font-medium pt-2">
                                        {event.excerpt || (event.content?.substring(0, 100) + '...')}
                                    </p>
                                    <div className="mt-auto pt-6 flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                                        Event Details <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HomeEventsSection;
