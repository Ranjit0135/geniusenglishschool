import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import PageHero from '../components/PageHero';
import api, { getImageUrl } from '../api';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 3;

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsLoading(true);
            try {
                const [newsRes, navRes] = await Promise.all([
                    api.get('/news'),
                    api.get('/public/navigation')
                ]);

                if (Array.isArray(newsRes.data)) {
                    // Filter for published items and sort by date
                    const publishedNews = newsRes.data
                        .filter(item => item.is_published)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setAnnouncements(publishedNews);
                }

                if (navRes.data.school) {
                    setSchoolInfo(navRes.data.school);
                }
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    // Filter announcements based on search
    const filteredAnnouncements = announcements.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    const heroImage = getImageUrl(schoolInfo?.news_hero_image_url || schoolInfo?.general_hero_image_url);

    return (
        <div className="bg-white min-h-screen font-['Inter',sans-serif]">
            <PageHero
                title="Announcements"
                backgroundImage={heroImage}
                breadcrumbs={[
                    { label: 'About Us', path: '/about' },
                    { label: 'Announcements' }
                ]}
            />

            <section className="py-20 px-6">
                <div className="container mx-auto max-w-[1140px]">

                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-[2px] bg-[#3db2d5]"></div>
                                <span className="text-[#3db2d5] text-[13px] font-black uppercase tracking-[0.3em]">Latest Notices</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#192f59] font-['Quicksand'] italic">
                                Important <span className="text-[#3db2d5] not-italic">Announcements</span>
                            </h2>
                        </div>

                        <div className="relative w-full md:w-80 group">
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-12 pr-6 py-4 bg-[#fcfcfc] border border-gray-100 rounded-sm text-sm focus:outline-none focus:border-[#3db2d5] transition-all duration-300 shadow-sm"
                            />
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#3db2d5] transition-colors" />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-24">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#192f59]"></div>
                        </div>
                    ) : filteredAnnouncements.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                {currentItems.map((item) => (
                                    <div key={item.id} className="group bg-[#fcfcfc] flex flex-col h-full border border-gray-100 transition-all duration-500 rounded-sm overflow-hidden">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                                            <img
                                                src={getImageUrl(item.image_url)}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="p-8 flex flex-col flex-grow">
                                            <div className="text-[11px] font-bold text-[#3db2d5] uppercase tracking-widest mb-4">
                                                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <h3 className="text-[16px] font-black text-[#192f59] mb-4 uppercase tracking-tight leading-tight group-hover:text-[#3db2d5] transition-colors duration-300">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-500 text-[13px] leading-relaxed mb-8 flex-grow line-clamp-3">
                                                {item.excerpt || (item.content ? item.content.substring(0, 100) + '...' : 'No description available for this notice.')}
                                            </p>

                                            <Link
                                                to={`/news/${item.slug}`}
                                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 border border-gray-100 text-[11px] font-black uppercase tracking-widest rounded-sm hover:bg-[#192f59] hover:text-white hover:border-[#192f59] transition-all duration-300 group/btn self-start"
                                            >
                                                <span>LEARN MORE</span>
                                                <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-20 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-[#192f59] hover:bg-[#192f59] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#192f59] transition-all duration-300 shadow-sm"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    <div className="flex gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => paginate(i + 1)}
                                                className={`w-12 h-12 rounded-full font-black text-sm transition-all duration-300 shadow-sm border ${currentPage === i + 1
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
                                        className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-[#192f59] hover:bg-[#192f59] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#192f59] transition-all duration-300 shadow-sm"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-sm">
                            <p className="text-gray-300 text-xl font-black italic tracking-widest uppercase">No Announcements Found</p>
                            <p className="text-gray-400 mt-2">Try a different search term or check back later.</p>
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
};

export default Announcements;
