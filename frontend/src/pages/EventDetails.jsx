import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../api';
import { STATIC_EVENTS } from '../data/eventData';
import { getImageUrl } from '../utils/imageUtils';

const EventDetails = () => {
    const { slug } = useParams();
    console.log(slug, "eventslug");
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEvent();
    }, [slug]);

    const fetchEvent = async () => {
        setIsLoading(true);

        // 1. Check static data first
        const staticItem = STATIC_EVENTS.find(item => item.slug === slug);
        if (staticItem) {
            setEvent(staticItem);
            setIsLoading(false);
            return;
        }

        // 2. Only try API if not in static data
        try {
            const response = await api.get(`/events/${slug}`);
            if (response.data) {
                setEvent(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch event details from API:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e24b4b]"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-white">
                <InfoBar />
                <Navbar />
                <div className="py-20 text-center">
                    <h1 className="text-4xl font-bold font-heading text-heading">Event Not Found</h1>
                    <Link to="/events" className="text-[#e24b4b] font-bold mt-4 inline-block hover:underline">Back to Events</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="event-details-page font-base text-[#666] bg-white">
            <InfoBar />
            <Navbar />

            {/* Redesigned Event Hero Section (Kingster Style) */}
            <section className="relative h-[250px] md:h-[300px] flex items-center text-white overflow-hidden bg-[#e24b4b]">
                <div className="absolute inset-0 bg-black/5 opacity-10"></div>

                <div className="container mx-auto px-5 relative z-10 max-w-[1180px]">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        {/* Date Block */}
                        <div className="flex flex-col items-center min-w-[60px]">
                            <span className="text-[2.2rem] md:text-[2.8rem] font-bold leading-none mb-1 text-white">
                                {event.day || (event.date && new Date(event.date).getDate().toString().padStart(2, '0'))}
                            </span>
                            <span className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] opacity-90 text-white">
                                {event.month || (event.date && new Date(event.date).toLocaleDateString('en-US', { month: 'short' }))}
                            </span>
                        </div>

                        {/* Vertical Separator */}
                        <div className="hidden md:block w-[1px] h-16 bg-white/30"></div>

                        {/* Title and Meta Block */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-[2.8rem] font-bold font-heading leading-tight mb-4 drop-shadow-sm text-white">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-[12px] md:text-[13px] font-bold uppercase tracking-widest opacity-80 text-white">
                                <div className="flex items-center gap-2">
                                    <span className="text-[14px]">🕒</span>
                                    <span>{event.time || event.time_range}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="opacity-30">|</span>
                                    <span className="text-[14px]">📍</span>
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 border-l border-white/20 pl-6 ml-2 hidden sm:flex">
                                    <span>{event.category || 'School Event'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Content Area */}
            <div className="py-20 px-5">
                <div className="container mx-auto max-w-[1180px]">
                    <div className="flex justify-center">
                        {/* Main Content - Centered */}
                        <article className="max-w-[850px] w-full">
                            {/* Featured Image inside content block */}
                            {(event.image || event.image_url) && (
                                <div className="mb-14 shadow-sm rounded-sm overflow-hidden bg-gray-50 aspect-[16/10]">
                                    <img
                                        src={getImageUrl(event.image || event.image_url)}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Primary Description */}
                            <div className="text-[17px] md:text-[19px] leading-[1.8] text-[#555] font-medium whitespace-pre-wrap mb-16">
                                {event.description || event.content || (
                                    <p className="text-gray-400 italic">No description available for this event.</p>
                                )}
                            </div>

                            {/* Additional Sections (Iterative Blocks) */}
                            {event.additional_sections && Array.isArray(event.additional_sections) && event.additional_sections.map((section, index) => (
                                <div key={index} className="mt-16 pt-16 border-t border-gray-100">
                                    {section.heading && (
                                        <h2 className="text-2xl md:text-3xl font-bold font-heading text-heading mb-8 leading-tight italic">
                                            {section.heading}
                                        </h2>
                                    )}

                                    {section.image_url && (
                                        <div className="my-12 shadow-sm rounded-sm overflow-hidden bg-gray-50">
                                            <img
                                                src={getImageUrl(section.image_url)}
                                                alt={section.heading || 'Section Detail'}
                                                className="w-full h-auto object-cover"
                                            />
                                        </div>
                                    )}

                                    {section.content && (
                                        <div className="text-[17px] md:text-[19px] leading-[1.8] text-[#555] font-medium whitespace-pre-wrap">
                                            {section.content}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Back to Events Navigation */}
                            <div className="mt-20 pt-10 border-t border-gray-100 italic">
                                <Link to="/events" className="flex items-center gap-2 text-[#e24b4b] font-bold uppercase text-[12px] tracking-widest hover:gap-4 transition-all duration-300">
                                    <span className="text-xl">←</span> Back to All Events
                                </Link>
                            </div>
                        </article>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default EventDetails;
