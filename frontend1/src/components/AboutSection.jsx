import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api, { getImageUrl } from '../api';

const AboutSection = () => {
    const [aboutData, setAboutData] = useState({
        since: "Since 2000",
        affiliation: "Affiliation Number is 6230006.",
        description: "Genius English School is a top educational institution dedicated to providing quality education manually and technically.",
        imageUrl: "https://images.unsplash.com/photo-1541339905195-062f5570c872?q=80&w=1200&auto=format&fit=crop"
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await api.get('/about');
                if (response.data) {
                    setAboutData({
                        since: response.data.title || "Since 2000",
                        affiliation: response.data.whyGeniusText || "Fostering Excellence",
                        description: response.data.content || "Providing a nurturing environment for students...",
                        imageUrl: getImageUrl(response.data.imageUrl, "https://images.unsplash.com/photo-1541339905195-062f5570c872?q=80&w=1200&auto=format&fit=crop")
                    });
                }
            } catch (error) {
                console.error('Failed to fetch about content:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAbout();
    }, []);

    if (isLoading) return <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading About...</div>;

    return (
        <section id="about" className="py-16 md:py-24 bg-[#f0f2f5]">
            <div className="container mx-auto px-6 max-w-[1140px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-12 lg:gap-16">
                    {/* Image Column */}
                    <div className="relative group">
                        <div className="relative z-10 overflow-hidden rounded-sm shadow-2xl">
                            <img
                                src={aboutData.imageUrl}
                                alt="About School"
                                className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-[2s] group-hover:scale-105"
                            />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -bottom-6 -right-6 w-3/4 h-3/4 bg-[#192f59]/5 -z-0 rounded-sm"></div>
                    </div>

                    {/* Content Column */}
                    <div className="flex items-center">
                        <div className="bg-white p-8 md:p-12 lg:p-16 rounded-sm shadow-xl w-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-[2px] bg-[#3db2d5]"></div>
                                <span className="text-[#3db2d5] text-[13px] font-black uppercase tracking-[0.3em]">Our Legacy</span>
                            </div>

                            <h2 className="text-[2rem] md:text-[2.8rem] font-bold text-[#192f59] mb-6 font-['Quicksand'] italic leading-tight">
                                {aboutData.since}
                            </h2>

                            <p className="text-[#ff9d01] font-black text-sm uppercase tracking-widest mb-8 border-l-4 border-[#ff9d01] pl-4 italic">
                                {aboutData.affiliation}
                            </p>

                            <p className="text-gray-500 mb-10 leading-relaxed text-lg font-medium opacity-90 line-clamp-4">
                                {aboutData.description}
                            </p>

                            <Link
                                to="/about"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-[#192f59] text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-[#3db2d5] transition-all duration-300 shadow-lg shadow-[#192f59]/20 group/btn"
                            >
                                <span>LEARN MORE</span>
                                <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
