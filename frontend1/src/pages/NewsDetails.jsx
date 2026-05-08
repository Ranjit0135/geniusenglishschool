import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronRight, User, Tag, Clock, ArrowLeft } from 'lucide-react';
import PageHero from '../components/PageHero';
import api, { getImageUrl } from '../api';

const NewsDetails = () => {
    const { slug } = useParams();
    const [news, setNews] = useState(null);
    const [recentNews, setRecentNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schoolInfo, setSchoolInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let detailsRes;
                try {
                    detailsRes = await api.get(`/news/${slug}`);
                } catch (err) {
                    // Fallback: If slug fails, try fetching by ID if the slug happens to be an ID
                    if (!isNaN(slug)) {
                        detailsRes = await api.get(`/news/id/${slug}`);
                    } else {
                        throw err;
                    }
                }

                const [allNewsRes, navRes] = await Promise.all([
                    api.get('/news'),
                    api.get('/public/navigation')
                ]);

                setNews(detailsRes.data);

                if (Array.isArray(allNewsRes.data)) {
                    const filtered = allNewsRes.data
                        .filter(item => item.is_published && item.slug !== slug && item.id.toString() !== slug)
                        .slice(0, 4);
                    setRecentNews(filtered);
                }

                if (navRes.data.school) {
                    setSchoolInfo(navRes.data.school);
                }
            } catch (error) {
                console.error('Failed to fetch news details:', error);
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

    if (!news) {
        return (
            <div className="container mx-auto px-6 py-24 text-center min-h-screen">
                <h1 className="text-2xl font-bold text-[#192f59] mb-4 font-['Quicksand']">News Story Not Found</h1>
                <Link to="/announcements" className="inline-flex items-center gap-2 text-[#3db2d5] font-bold hover:text-[#192f59] transition-colors">
                    <ArrowLeft size={18} /> Back to Announcements
                </Link>
            </div>
        );
    }

    const heroImage = getImageUrl(news.image_url || schoolInfo?.news_hero_image_url || schoolInfo?.general_hero_image_url);

    return (
        <div className="bg-white min-h-screen font-['Inter',sans-serif]">
            <PageHero
                title="Announcement Detail"
                backgroundImage={heroImage}
                breadcrumbs={[
                    { label: 'Announcements', path: '/announcements' },
                    { label: 'Detail' }
                ]}
            />

            <section className="py-20 px-6">
                <div className="container mx-auto max-w-[1140px]">
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* Main Content */}
                        <article className="lg:w-2/3">
                            <div className="mb-10">
                                <div className="flex flex-wrap items-center gap-6 text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-6">
                                    <div className="flex items-center gap-2 text-[#3db2d5]">
                                        <Calendar size={16} />
                                        <span>{new Date(news.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-[#ff9d01]" />
                                        <span>{news.category || 'School News'}</span>
                                    </div>
                                    {news.author_name && (
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-[#192f59]" />
                                            <span>By {news.author_name}</span>
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-5xl font-bold text-[#192f59] font-['Quicksand'] italic leading-tight mb-10">
                                    {news.title}
                                </h1>

                                {news.image_url ? (
                                    <div className="rounded-sm overflow-hidden shadow-2xl mb-12 group">
                                        <img
                                            src={getImageUrl(news.image_url)}
                                            alt={news.title}
                                            className="w-full h-auto object-cover transition-transform duration-[2s] group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop";
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="rounded-sm overflow-hidden shadow-2xl mb-12 bg-gray-100 aspect-video flex items-center justify-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop"
                                            alt="Fallback"
                                            className="w-full h-full object-cover opacity-50"
                                        />
                                    </div>
                                )}

                                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium">
                                    {news.content ? (
                                        <div
                                            className="announcement-content space-y-6"
                                            dangerouslySetInnerHTML={{ __html: news.content }}
                                        />
                                    ) : (
                                        <p className="text-lg italic text-gray-400">{news.excerpt || 'No additional content provided for this announcement.'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Navigation back */}
                            <div className="mt-16 pt-8 border-t border-gray-100">
                                <Link
                                    to="/announcements"
                                    className="inline-flex items-center gap-3 px-8 py-3 bg-[#192f59] text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#3db2d5] transition-all duration-300 shadow-lg shadow-[#192f59]/20"
                                >
                                    <ArrowLeft size={16} />
                                    Back to Announcements
                                </Link>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:w-1/3">
                            <div className="sticky top-32">
                                <div className="bg-[#fcfcfc] border border-gray-100 p-8 rounded-sm shadow-sm">
                                    <h3 className="text-[#192f59] font-black text-[14px] uppercase tracking-[0.2em] mb-8 border-b-2 border-[#ff9d01] pb-2 inline-block">
                                        Recent Updates
                                    </h3>

                                    <div className="space-y-8">
                                        {recentNews.length > 0 ? recentNews.map((item) => (
                                            <Link
                                                key={item.id}
                                                to={`/news/${item.slug}`}
                                                className="group flex gap-4"
                                            >
                                                <div className="w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden bg-gray-100">
                                                    <img
                                                        src={getImageUrl(item.image_url)}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop";
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <span className="text-[10px] font-bold text-[#3db2d5] uppercase tracking-widest mb-1">
                                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <h4 className="text-[13px] font-bold text-[#192f59] group-hover:text-[#3db2d5] transition-colors line-clamp-2 leading-snug">
                                                        {item.title}
                                                    </h4>
                                                </div>
                                            </Link>
                                        )) : (
                                            <p className="text-gray-400 text-sm italic">No other recent updates available.</p>
                                        )}
                                    </div>

                                    <div className="mt-12 p-6 bg-[#192f59] rounded-sm text-center">
                                        <h4 className="text-white font-['Quicksand'] italic text-lg mb-2">Need More Info?</h4>
                                        <p className="text-gray-400 text-[12px] mb-6">Contact our office for further details about this announcement.</p>
                                        <Link
                                            to="/contact"
                                            className="inline-block w-full py-3 bg-[#3db2d5] text-white text-[11px] font-black uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#192f59] transition-all duration-300"
                                        >
                                            Contact Us
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewsDetails;
