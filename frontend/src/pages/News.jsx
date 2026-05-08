import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHero from '../components/common/PageHero';
import api from '../api';
import { getImageUrl } from '../utils/imageUtils';

const STATIC_NEWS = [
    {
        id: 's1',
        title: 'Welcome to Our New Academic Session 2024-25',
        slug: 'welcome-academic-session-2024-25',
        image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop',
        createdAt: new Date().toISOString(),
        category: 'School News',
        is_published: true,
        excerpt: 'We are excited to welcome all students back to campus for another year of learning and growth.'
    },
    {
        id: 's2',
        title: 'Annual Sports Meet 2024: A Great Success',
        slug: 'annual-sports-meet-2024',
        image_url: 'https://images.unsplash.com/photo-1526676023131-d352423b0694?q=80&w=2070&auto=format&fit=crop',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        category: 'Events',
        is_published: true,
        excerpt: 'Students demonstrated incredible sportsmanship and talent at our annual sports competition.'
    },
    {
        id: 's3',
        title: 'Science Fair 2024: Innovation at its Best',
        slug: 'science-fair-2024',
        image_url: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?q=80&w=1932&auto=format&fit=crop',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        category: 'Academic',
        is_published: true,
        excerpt: 'Our students showcased amazing innovative projects at the annual science and technology fair.'
    }
];

const NewsCard = ({ item }) => {
    const newsDate = new Date(item.createdAt);
    return (
        <div className="news-card flex flex-col group h-full">
            <div className="aspect-[360/240] overflow-hidden mb-6 shadow-md rounded-sm relative">
                <img
                    src={getImageUrl(item.image_url) || 'https://via.placeholder.com/400x300'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#56c0e0] text-white p-2 min-w-[50px] text-center shadow-lg">
                    <span className="block text-xl font-bold font-heading leading-none">{newsDate.getDate()}</span>
                    <span className="block text-[10px] uppercase font-bold tracking-widest">{newsDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
            </div>

            <div className="flex flex-col flex-1 px-2">
                <span className="text-[11px] font-bold text-[#56c0e0] uppercase tracking-widest mb-3">
                    {item.category || 'SCHOOL NEWS'}
                </span>
                <Link to={`/news/${item.slug}`}>
                    <h3 className="text-[1.3rem] font-bold font-heading text-heading mb-4 hover:text-[#56c0e0] transition-colors leading-tight line-clamp-2">
                        {item.title}
                    </h3>
                </Link>
                <p className="text-[#777] text-[14px] leading-relaxed mb-6 line-clamp-3">
                    {item.excerpt}
                </p>
                <div className="mt-auto">
                    <Link
                        to={`/news/${item.slug}`}
                        className="text-[#192f59] font-bold text-[12px] uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all duration-300 border-b-2 border-[#56c0e0]/20 pb-1 inline-block"
                    >
                        Read More <span>→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const News = () => {
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schoolInfo, setSchoolInfo] = useState(null);

    useEffect(() => {
        fetchNews();
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

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/news');
            if (response.data && response.data.length > 0) {
                setNews(response.data.filter(post => post.is_published));
            } else {
                setNews(STATIC_NEWS);
            }
        } catch (error) {
            console.error('Failed to fetch news:', error);
            setNews(STATIC_NEWS);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="news-page font-base text-[#666] bg-white">
            <InfoBar />
            <Navbar />

            <PageHero
                title="School News"
                subtitle="Everything about Genius School"
                backgroundImage={getImageUrl(schoolInfo?.news_hero_image_url || schoolInfo?.general_hero_image_url)}
                fallbackImage="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop"
            />

            {/* News Grid Area */}
            <div className="py-24 px-5">
                <div className="container mx-auto max-w-[1180px]">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56c0e0]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                            {news.map((item) => (
                                <NewsCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default News;
