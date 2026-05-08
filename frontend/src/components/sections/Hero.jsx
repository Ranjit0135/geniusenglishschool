import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getImageUrl } from '../../utils/imageUtils';

const Hero = () => {
    const [heroData, setHeroData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const response = await api.get('/ui/hero');
                setHeroData(response.data);
            } catch (error) {
                console.error('Failed to fetch hero content:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHero();
    }, []);

    if (isLoading) return <div className="h-[600px] bg-heading animate-pulse flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    // Hide section if explicitly set to inactive
    if (heroData && heroData.is_active === false) return null;

    const {
        subtitle = "Welcome to",
        title_main = "Genius English",
        title_highlight = "School",
        description = "The best start for your child's education. We provide a nurturing environment where every child can discover their potential and love for learning.",
        button_text = "Take a Tour",
        button_link = "/about",
        image_url
    } = heroData || {};

    return (
        <section className="relative min-h-[600px] lg:h-[650px] flex items-center overflow-hidden bg-heading">
            {/* Full-width Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={getImageUrl(image_url)}
                    alt="School Building"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-heading via-heading/20 to-transparent"></div>
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-[1200px] mt-[-50px]">
                {/* Single Column Content */}
                <div className="w-full lg:w-2/3 space-y-2 animate-fadeIn">
                    <div className="inline-block border-l-4 border-secondary pl-4">
                        <h3 className="text-secondary text-base md:text-lg font-bold uppercase tracking-[0.2em] font-heading">
                            {subtitle}
                        </h3>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] text-white font-heading">
                        {title_main} <span className="text-secondary block lg:inline">{title_highlight}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/90 max-w-[600px] leading-relaxed font-medium">
                        {description}
                    </p>

                    <div className="pt-6">
                        <a
                            href={button_link}
                            className="inline-block bg-primary text-white py-4 px-10 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-heading hover:-translate-y-1 hover:shadow-xl transition-all duration-300 active:scale-95"
                        >
                            {button_text}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
