import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronRight, Tag, ArrowLeft } from 'lucide-react';
import PageHero from '../components/PageHero';
import api, { getImageUrl } from '../api';
import { useEffect, useState } from 'react';

const EventDetails = () => {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [recentEvents, setRecentEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schoolInfo, setSchoolInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch event details (try slug, then ID as fallback)
                let detailsRes;
                try {
                    detailsRes = await api.get(`/events/${slug}`);
                } catch (err) {
                    if (!isNaN(slug)) {
                        detailsRes = await api.get(`/events/id/${slug}`);
                    } else {
                        throw err;
                    }
                }

                // Fetch other data
                const [allEventsRes, navRes] = await Promise.all([
                    api.get('/events'),
                    api.get('/public/navigation')
                ]);

                setEvent(detailsRes.data);

                if (Array.isArray(allEventsRes.data)) {
                    // Filter out current event and shows only published ones
                    const filtered = allEventsRes.data
                        .filter(item => item.is_published && item.slug !== slug && item.id.toString() !== slug)
                        .slice(0, 4);
                    setRecentEvents(filtered);
                }

                if (navRes.data.school) {
                    setSchoolInfo(navRes.data.school);
                }
            } catch (error) {
                console.error('Failed to fetch event details:', error);
            } finally {
                setIsLoading(false);
                window.scrollTo(0, 0);
            }
        };

        fetchData();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="flex justify-center py-24 min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#192f59]"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto px-6 py-24 text-center min-h-screen">
                <h1 className="text-2xl font-bold text-[#192f59] mb-4 font-['Quicksand']">Event Not Found</h1>
                <Link to="/news-events" className="inline-flex items-center gap-2 text-[#3db2d5] font-bold hover:text-[#192f59] transition-colors">
                    <ArrowLeft size={18} /> Back to News & Events
                </Link>
            </div>
        );
    }

    const { day, month, year } = {
        day: new Date(event.date).getDate(),
        month: new Date(event.date).toLocaleDateString('en-US', { month: 'long' }),
        year: new Date(event.date).getFullYear()
    };

    const heroImage = getImageUrl(event.image_url || schoolInfo?.event_hero_image_url || schoolInfo?.general_hero_image_url);

    return (
        <div className="bg-white min-h-screen font-['Inter',sans-serif]">
            <PageHero
                title="Event Detail"
                backgroundImage={heroImage}
                breadcrumbs={[
                    { label: 'News & Events', path: '/news-events' },
                    { label: 'Event Detail' }
                ]}
            />

            <section className="py-20 px-6">
                <div className="container mx-auto max-w-[1140px]">
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* Main Content */}
                        <article className="lg:w-2/3">
                            <div className="mb-10">
                                <div className="flex flex-wrap items-center gap-6 text-[12px] font-bold uppercase tracking-widest text-[#3db2d5] mb-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{month} {day}, {year}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-[#ff9d01]" />
                                        <span>{event.category || 'School Event'}</span>
                                    </div>
                                </div>

                                <h1 className="text-3xl md:text-5xl font-bold text-[#192f59] font-['Quicksand'] italic leading-tight mb-10">
                                    {event.title}
                                </h1>

                                {event.image_url ? (
                                    <div className="rounded-sm overflow-hidden shadow-2xl mb-12 group">
                                        <img
                                            src={getImageUrl(event.image_url)}
                                            alt={event.title}
                                            className="w-full h-auto object-cover transition-transform duration-[2s] group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop";
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-sm overflow-hidden shadow-2xl mb-12 bg-gray-100 aspect-video flex items-center justify-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop"
                                            alt="Fallback"
                                            className="w-full h-full object-cover opacity-50"
                                        />
                                    </div>
                                )}

                                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                                    {event.description ? (
                                        <div
                                            className="event-content space-y-6"
                                            dangerouslySetInnerHTML={{ __html: event.description }}
                                        />
                                    ) : (
                                        <p className="text-lg italic text-gray-400">Join us for our upcoming school event: <strong>{event.title}</strong>. This event is part of our commitment to fostering a vibrant and engaged school community.</p>
                                    )}
                                </div>
                            </div>

                            {/* Navigation back */}
                            <div className="mt-16 pt-8 border-t border-gray-100">
                                <Link
                                    to="/news-events"
                                    className="inline-flex items-center gap-3 px-8 py-3 bg-[#192f59] text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#3db2d5] transition-all duration-300 shadow-lg shadow-[#192f59]/20"
                                >
                                    <ArrowLeft size={16} />
                                    Back to News & Events
                                </Link>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:w-1/3">
                            <div className="sticky top-32 space-y-12">
                                {/* Event Info Card */}
                                <div className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-sm shadow-sm">
                                    <h3 className="text-[#192f59] font-black text-[14px] uppercase tracking-[0.2em] mb-8 border-b-2 border-[#ff9d01] pb-2 inline-block">
                                        Event Information
                                    </h3>

                                    <div className="space-y-8">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-[#192f59] p-3 text-white rounded-sm">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-[#3db2d5] mb-1">Date</div>
                                                <div className="text-[15px] font-bold text-[#192f59]">{month} {day}, {year}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="bg-[#192f59] p-3 text-white rounded-sm">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-[#3db2d5] mb-1">Time</div>
                                                <div className="text-[15px] font-bold text-[#192f59]">{event.time_range || '9:00 AM – 3:00 PM'}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="bg-[#192f59] p-3 text-white rounded-sm">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-[#3db2d5] mb-1">Location</div>
                                                <div className="text-[15px] font-bold text-[#192f59]">{event.location || 'School Playground'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full mt-10 py-4 bg-[#ff9d01] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#192f59] transition-all duration-300 shadow-lg shadow-[#ff9d01]/20">
                                        Add to Calendar
                                    </button>
                                </div>

                                {/* Other Events */}
                                {recentEvents.length > 0 && (
                                    <div className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-sm shadow-sm">
                                        <h3 className="text-[#192f59] font-black text-[14px] uppercase tracking-[0.2em] mb-8 border-b-2 border-[#3db2d5] pb-2 inline-block">
                                            Upcoming Events
                                        </h3>

                                        <div className="space-y-8">
                                            {recentEvents.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    to={`/event/${item.slug}`}
                                                    className="group flex gap-4"
                                                >
                                                    <div className="w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden bg-gray-100">
                                                        <img
                                                            src={getImageUrl(item.image_url)}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <span className="text-[10px] font-bold text-[#3db2d5] uppercase tracking-widest mb-1">
                                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                        <h4 className="text-[13px] font-bold text-[#192f59] group-hover:text-[#3db2d5] transition-colors line-clamp-2 leading-snug">
                                                            {item.title}
                                                        </h4>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default EventDetails;
