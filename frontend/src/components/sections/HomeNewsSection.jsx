import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { getImageUrl } from '../../utils/imageUtils';
import { STATIC_NEWS } from '../../data/newsData';
import { Loader2, ArrowRight, Calendar } from 'lucide-react';

const HomeNewsSection = () => {
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/news');
            if (response.data && response.data.length > 0) {
                setNews(response.data.filter(p => p.is_published).slice(0, 4));
            } else {
                setNews(STATIC_NEWS.slice(0, 4));
            }
        } catch (error) {
            console.error('Failed to fetch news:', error);
            setNews(STATIC_NEWS.slice(0, 4));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && news.length === 0) {
        return (
            <div className="py-20 flex justify-center bg-gray-50">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!isLoading && news.length === 0) return null;

    return (
        <section className="bg-gray-50 py-20 px-5 lg:py-24 overflow-hidden">
            <div className="container mx-auto max-w-[1180px]">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-12 h-[2px] bg-secondary"></span>
                            <span className="text-secondary font-black text-[10px] uppercase tracking-[0.3em]">Latest Updates</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black font-heading text-heading italic tracking-tighter">
                            School <span className="text-secondary">News</span>
                        </h2>
                    </div>
                    <Link
                        to="/news"
                        className="group flex items-center gap-2 text-heading font-bold uppercase text-[12px] tracking-widest hover:text-secondary transition-colors"
                    >
                        View All News
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {news.map((item) => (
                        <Link
                            to={`/news/${item.slug}`}
                            key={item.id}
                            className="bg-white rounded-[24px] overflow-hidden shadow-xl shadow-gray-200/50 group flex flex-col h-full hover:-translate-y-2 transition-all duration-500 border border-gray-100"
                        >
                            <div className="relative h-[220px] overflow-hidden ">
                                {item.image_url ? (
                                    <img
                                        src={getImageUrl(item.image_url)}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 italic">No Image</div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white text-heading py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-2">
                                        <Calendar size={12} className="text-secondary" />
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <span className="text-[10px] uppercase text-secondary font-black tracking-[0.2em] mb-3 block">
                                    {item.category || 'School News'}
                                </span>
                                <h4 className="text-[1.2rem] mb-4 leading-tight font-black font-heading text-heading group-hover:text-secondary transition-colors italic">
                                    {item.title}
                                </h4>
                                <p className="text-text-main/70 text-sm line-clamp-2 font-medium mb-6">
                                    {item.excerpt || (item.content?.substring(0, 100) + '...')}
                                </p>
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-heading/40">Read More</span>
                                    <ArrowRight size={14} className="text-secondary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeNewsSection;
