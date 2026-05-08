import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingSocialIcons from '../components/common/FloatingSocialIcons';
import PageHero from '../components/common/PageHero';
import api from '../api';
import { STATIC_EVENTS } from '../data/eventData';
import { getImageUrl } from '../utils/imageUtils';

const EventCard = ({ date, day, month, title, time, time_range, location, image, image_url, slug }) => {
    // Determine the date to display
    let displayDay = day;
    let displayMonth = month;

    if (date) {
        const d = new Date(date);
        displayDay = d.getDate();
        displayMonth = d.toLocaleDateString('en-US', { month: 'short' });
    }

    return (
        <div className="event-card flex flex-col group">
            <Link to={`/event/${slug}`} className="aspect-[360/220] overflow-hidden mb-8 shadow-sm rounded-sm block bg-gray-100">
                <img src={getImageUrl(image_url) || image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </Link>
            <div className="flex gap-6 pb-12">
                {/* Date Block */}
                <div className="flex flex-col items-center min-w-[50px]">
                    <span className="text-[1.2rem] font-bold text-[#3db2d5] leading-none mb-1">{displayDay}</span>
                    <span className="text-[13px] font-bold text-heading uppercase tracking-wider">{displayMonth}</span>
                    <div className="w-7 h-[2px] bg-[#3db2d5] mt-4"></div>
                </div>

                {/* Content block */}
                <div className="flex flex-col flex-1">
                    <Link to={`/event/${slug}`}>
                        <h3 className="text-[1.1rem] font-bold text-[#e24b4b] font-heading mb-4 hover:text-heading transition-colors cursor-pointer leading-[1.4] uppercase tracking-tight line-clamp-2">
                            {title}
                        </h3>
                    </Link>
                    <div className="space-y-2 mt-auto">
                        <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#9a9a9a]">
                            <svg className="w-3.5 h-3.5 text-[#3db2d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{time_range || time}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#9a9a9a]">
                            <svg className="w-3.5 h-3.5 text-[#3db2d5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{location || 'School Campus'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'

    useEffect(() => {
        fetchEvents();
        fetchSchoolInfo();
    }, []);

    const fetchSchoolInfo = async () => {
        try {
            const response = await api.get('/public/navigation');
            if (response.data.school) {
                setSchoolInfo(response.data.school);
            }
        } catch (error) {
            console.error('Failed to fetch school info:', error);
        }
    };

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/events');
            if (response.data && response.data.length > 0) {
                setEvents(response.data.filter(e => e.is_published));
            } else {
                setEvents(STATIC_EVENTS);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setEvents(STATIC_EVENTS);
        } finally {
            setIsLoading(false);
        }
    };

    // Get unique categories
    const categories = ['All', ...new Set(events.map(event => event.category).filter(Boolean))];

    // Filter and Sort Logic
    const filteredAndSortedEvents = events
        .filter(event => selectedCategory === 'All' || event.category === selectedCategory)
        .sort((a, b) => {
            const dateA = new Date(a.date || 0);
            const dateB = new Date(b.date || 0);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="events-page font-base text-[#666] bg-white">
            <FloatingSocialIcons />
            <InfoBar />
            <Navbar />

            <PageHero
                title="Event Calendar"
                subtitle="Join Our Events"
                backgroundImage={getImageUrl(schoolInfo?.event_hero_image_url || schoolInfo?.general_hero_image_url)}
                fallbackImage="https://images.unsplash.com/photo-1503919219737-6762b3bb1b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            {/* Filter and Sort Bar */}
            <div className="bg-gray-50 border-b border-gray-100 py-6 px-5 sticky top-[70px] z-40">
                <div className="container mx-auto max-w-[1180px] flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Categories */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                                    selectedCategory === category
                                        ? 'bg-[#3db2d5] text-white shadow-md'
                                        : 'bg-white text-[#666] hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Sorting */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Sort By:</span>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-white border border-gray-200 rounded-md px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#3db2d5] outline-none cursor-pointer w-full"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Events Grid Area */}
            <div className="py-16 px-5 min-h-[400px]">
                <div className="container mx-auto max-w-[1180px]">
                    {isLoading && events.length === 0 ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e24b4b]"></div>
                        </div>
                    ) : (
                        <>
                            {filteredAndSortedEvents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                                    {filteredAndSortedEvents.map((event) => (
                                        <EventCard key={event.id} {...event} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="text-gray-300 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400 mb-2">No Events Found</h3>
                                    <p className="text-gray-400">There are no events in the "{selectedCategory}" category at the moment.</p>
                                    <button
                                        onClick={() => setSelectedCategory('All')}
                                        className="mt-6 text-[#3db2d5] font-bold hover:underline"
                                    >
                                        View All Events
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Events;
