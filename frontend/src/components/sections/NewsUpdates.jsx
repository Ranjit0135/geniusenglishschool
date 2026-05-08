import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

import { STATIC_NEWS } from '../../data/newsData';
import { STATIC_EVENTS } from '../../data/eventData';

const NewsUpdates = () => {
    const [news, setNews] = useState([]);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [newsRes, eventsRes] = await Promise.allSettled([
                api.get('/news'),
                api.get('/events')
            ]);

            // Handle News
            if (newsRes.status === 'fulfilled' && newsRes.value.data.length > 0) {
                setNews(newsRes.value.data.filter(p => p.is_published).slice(0, 4));
            } else {
                setNews(STATIC_NEWS);
            }

            // Handle Events
            if (eventsRes.status === 'fulfilled' && eventsRes.value.data.length > 0) {
                setEvents(eventsRes.value.data.filter(e => e.is_published).slice(0, 4));
            } else {
                setEvents(STATIC_EVENTS);
            }
        } catch (error) {
            console.error('Failed to fetch home page data:', error);
            setNews(STATIC_NEWS);
            setEvents(STATIC_EVENTS);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && news.length === 0 && events.length === 0) {
        return (
            <div className="bg-sky-blue py-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <section className="bg-[#68bcde] py-20 px-5 overflow-hidden">
            <div className="container mx-auto max-w-[1180px]">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
                    {/* News Section */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-[15px] mb-2.5">
                            <span className="text-[2rem]">📰</span>
                            <h2 className="text-[2.2rem] text-white font-heading font-bold">News & Updates</h2>

                        </div>
                        <Link to="/news">
                            <h1 className="text-[2xl] text-white font-heading font-bold hover:underline cursor-pointer">Read all news</h1>
                        </Link>
                        <p className="text-white mb-[30px] text-[1.1rem] opacity-90">Stay updated with the latest happenings at our school</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {news.map((item) => (
                                <Link to={`/news/${item.slug}`} key={item.id} className="bg-white rounded-md overflow-hidden shadow-md group block">
                                    <div className="relative h-[200px] overflow-hidden">
                                        <img
                                            src={getImageUrl(item.image_url || item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-center object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <span className="absolute top-[15px] left-[15px] bg-secondary text-white py-[5px] px-2.5 text-[0.8rem] font-bold uppercase">
                                            {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <span className="text-[0.75rem] uppercase text-text-light tracking-widest mb-[5px] block">{item.category || 'School News'}</span>
                                        <h4 className="text-[1.1rem] mb-2.5 leading-snug font-heading font-bold text-heading group-hover:text-secondary transition-colors">{item.title}</h4>
                                        <p className="text-text-main/80 text-sm line-clamp-2">{item.excerpt || item.content.substring(0, 100) + '...'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Events Sidebar */}
                    <div className="">
                        <div className="bg-white p-[30px] shadow-md rounded-md">
                            <h3 className="text-[1.4rem] mb-[25px] pb-[15px] border-b-2 border-secondary inline-block font-heading font-bold text-heading">Upcoming Events</h3>
                            <div className="flex flex-col">
                                {events.map((event) => {
                                    // Use event.date if it exists, otherwise construct from day/month
                                    const eventDate = event.date ? new Date(event.date) : new Date(`${new Date().getFullYear()}-${event.month}-${event.day}`);
                                    return (
                                        <Link to={`/events`} key={event.id} className="flex gap-[15px] mb-[25px] items-start hover:opacity-80 transition-opacity block group">
                                            <div className="text-center min-w-[50px]">
                                                <span className="block text-[0.8rem] font-bold text-primary uppercase">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="block text-[1.5rem] font-extrabold text-heading leading-tight group-hover:text-secondary transition-colors">{eventDate.getDate()}</span>
                                            </div>
                                            <div className="">
                                                <h5 className="text-[1rem] mb-[5px] leading-snug font-bold text-heading group-hover:text-secondary transition-colors">{event.title}</h5>
                                                {(event.time_range || event.time) && <span className="text-[0.85rem] text-text-light">🕒 {event.time_range || event.time}</span>}
                                            </div>
                                        </Link>
                                    );
                                })}
                                {events.length === 0 && <p className="text-gray-400 font-medium italic">No upcoming events.</p>}
                            </div>
                            <Link to="/events" className="inline-block mt-5 text-secondary font-bold text-[0.9rem] uppercase hover:underline">View All Events →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsUpdates;
