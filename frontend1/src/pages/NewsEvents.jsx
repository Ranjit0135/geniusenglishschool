import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ChevronRight, ArrowRight, ChevronLeft } from 'lucide-react';
import PageHero from '../components/PageHero';
import api, { getImageUrl } from '../api';

const NewsEvents = () => {
    const [combinedData, setCombinedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [newsRes, settingsRes] = await Promise.all([
                    api.get('/news'),
                    api.get('/settings')
                ]);

                let items = [];

                if (Array.isArray(newsRes.data)) {
                    items = newsRes.data.map(item => ({
                        ...item,
                        type: item.category === 'Event' ? 'event' : 'news',
                        displayDate: item.createdAt,
                        image_url: item.imageUrl // Map for consistent usage in the component
                    }));
                }

                // Sort by date descending
                const sorted = items.sort((a, b) =>
                    new Date(b.displayDate) - new Date(a.displayDate)
                );

                setCombinedData(sorted);
                setSchoolInfo(settingsRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(combinedData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = combinedData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    const heroImage = getImageUrl(schoolInfo?.news_hero_image_url || schoolInfo?.general_hero_image_url);

    return (
        <div className="bg-white min-h-screen">
            <PageHero
                title="News & Events"
                backgroundImage={heroImage}
                breadcrumbs={[
                    { label: 'About Us', path: '/about' },
                    { label: 'News & Events' }
                ]}
            />

            <div className="container mx-auto px-6 py-20 max-w-[1140px]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-[2px] bg-[#3db2d5]"></div>
                            <span className="text-[#3db2d5] text-[13px] font-black uppercase tracking-[0.3em]">Latest Updates</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#192f59] font-['Quicksand'] italic">News & <span className="text-[#3db2d5] not-italic">Events</span></h2>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#192f59]"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <div key={`${item.type}-${item.id}`} className="flex flex-col h-full bg-white group hover:-translate-y-2 transition-all duration-500">
                                        <div className="relative aspect-[16/10] overflow-hidden mb-8 rounded-sm shadow-lg shadow-black/5">
                                            <img
                                                src={getImageUrl(item.image_url)}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${item.type === 'event' ? 'bg-[#ff9d01]' : 'bg-[#3db2d5]'}`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-grow">
                                            <div className="flex items-center gap-3 text-gray-400 text-[12px] mb-4 font-bold">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-[#3db2d5]" />
                                                    <span>{new Date(item.displayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                                {item.type === 'event' && item.location && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4 text-[#ff9d01]" />
                                                        <span className="truncate max-w-[120px]">{item.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-[17px] font-black text-[#192f59] mb-6 uppercase tracking-tight leading-[1.4] transition-colors group-hover:text-[#3db2d5]">
                                                {item.title}
                                            </h3>

                                            <div className="mt-auto">
                                                <Link
                                                    to={item.type === 'event' ? `/event/${item.slug}` : `/news/${item.slug}`}
                                                    className={`inline-flex items-center gap-2 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-sm ${item.type === 'event'
                                                        ? 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-[#ff9d01] hover:text-white hover:border-[#ff9d01]'
                                                        : 'text-[#3db2d5] hover:text-[#192f59]'
                                                        }`}
                                                >
                                                    {item.type === 'event' ? 'LEARN MORE' : 'Read More'}
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                    <div className="text-gray-300 mb-2 font-black italic text-xl">NO UPDATES FOUND</div>
                                    <p className="text-gray-400 text-sm">Check back later for recent news and upcoming events.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-24 flex justify-center items-center gap-3 md:gap-4">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-100 flex items-center justify-center text-[#192f59] hover:bg-[#192f59] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#192f59] transition-all duration-300 shadow-sm"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => paginate(i + 1)}
                                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-black text-xs md:text-sm transition-all duration-300 shadow-sm border ${currentPage === i + 1
                                                ? 'bg-[#192f59] border-[#192f59] text-white'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-[#3db2d5] hover:text-[#3db2d5]'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-100 flex items-center justify-center text-[#192f59] hover:bg-[#192f59] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#192f59] transition-all duration-300 shadow-sm"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsEvents;
