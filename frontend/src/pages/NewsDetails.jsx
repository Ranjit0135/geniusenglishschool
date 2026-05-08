import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../api';
import { getImageUrl } from '../utils/imageUtils';

import { STATIC_NEWS } from '../data/newsData';

const NewsDetails = () => {
    const { slug } = useParams();
    const [newsItem, setNewsItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNewsDetail();
    }, [slug]);

    const fetchNewsDetail = async () => {
        setIsLoading(true);

        // 1. Check static data first
        const staticItem = STATIC_NEWS.find(item => item.slug === slug);
        if (staticItem) {
            setNewsItem(staticItem);
            setIsLoading(false);
            return;
        }

        // 2. Try API if not in static
        try {
            const response = await api.get(`/news/${slug}`);
            if (response.data) {
                setNewsItem(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch news details from API:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56c0e0]"></div>
            </div>
        );
    }

    if (!newsItem) {
        return (
            <div className="min-h-screen bg-white">
                <InfoBar />
                <Navbar />
                <div className="py-20 text-center">
                    <h1 className="text-4xl font-bold font-heading text-heading">News Not Found</h1>
                    <Link to="/" className="text-[#56c0e0] font-bold mt-4 inline-block hover:underline">Back to Home</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const newsDate = new Date(newsItem.createdAt);

    return (
        <div className="news-details-page font-base text-[#666] bg-white">
            <InfoBar />
            <Navbar />

            {/* Redesigned News Hero Section (Kingster Style) */}
            <section className="relative h-[250px] md:h-[300px] flex items-center text-white overflow-hidden bg-[#e24b4b]">
                <div className="absolute inset-0 bg-black/5 opacity-10"></div>

                <div className="container mx-auto px-5 relative z-10 max-w-[1180px]">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        {/* Date Block */}
                        <div className="flex flex-col items-center min-w-[60px]">
                            <span className="text-[2.2rem] md:text-[2.8rem] font-bold leading-none mb-1 text-white">
                                {newsDate.getDate().toString().padStart(2, '0')}
                            </span>
                            <span className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] opacity-90 text-white">
                                {newsDate.toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                        </div>

                        {/* Vertical Separator */}
                        <div className="hidden md:block w-[1px] h-16 bg-white/30"></div>

                        {/* Title and Meta Block */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-[2.8rem] font-bold font-heading leading-tight mb-4 drop-shadow-sm text-white">
                                {newsItem.title}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-[12px] md:text-[13px] font-bold uppercase tracking-widest opacity-80 text-white">
                                <div className="flex items-center gap-2">
                                    <span className="opacity-60 text-[10px]">BY</span>
                                    <span>{newsItem.author_name || 'Admin'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="opacity-30">|</span>
                                    <span>{newsItem.category || 'School News'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* News Content Area */}
            <div className="py-20 px-5">
                <div className="container mx-auto max-w-[1180px]">
                    <div className="flex justify-center">
                        {/* Main Content - Centered */}
                        <article className="max-w-[850px] w-full">
                            {/* Featured Image inside content block */}
                            {(newsItem.image || newsItem.image_url) && (
                                <div className="mb-14 shadow-sm rounded-sm overflow-hidden bg-gray-50 aspect-[16/10]">
                                    <img
                                        src={getImageUrl(newsItem.image || newsItem.image_url)}
                                        alt={newsItem.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Primary Description */}
                            <div className="text-[17px] md:text-[19px] leading-[1.8] text-[#555] font-medium whitespace-pre-wrap mb-16">
                                {newsItem.content}
                            </div>

                            {/* Additional Sections (Iterative Blocks) */}
                            {/* {newsItem.additional_sections && newsItem.additional_sections.map((section, index) => (
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
                            ))} */}

                            {/* Back to Home/News Navigation */}
                            <div className="mt-20 pt-10 border-t border-gray-100 italic">
                                <Link to="/" className="flex items-center gap-2 text-[#e24b4b] font-bold uppercase text-[12px] tracking-widest hover:gap-4 transition-all duration-300">
                                    <span className="text-xl">←</span> Back to News
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

export default NewsDetails;
