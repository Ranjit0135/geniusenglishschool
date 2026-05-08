import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

const AboutSection = () => {
    const [aboutData, setAboutData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await api.get('/ui/about');
                setAboutData(response.data);
            } catch (error) {
                console.error('Failed to fetch about content:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAbout();
    }, []);

    if (isLoading) return <div className="py-20 h-96 bg-gray-50 animate-pulse flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    const {
        title = "About Our School",
        description = "We are Genius English School. We don't just give students an education and experiences that set them up for success in a career. We help them succeed in their career.",
        mission = "Comprehensive Education",
        vision = "Expert Teachers",
        image_url
    } = aboutData || {};

    return (
        <section className="py-20 px-5 bg-white">
            <div className="container mx-auto flex flex-col md:flex-row gap-[50px] items-center max-w-[1180px]">
                <div className="flex-1 order-2 md:order-1 animate-fadeIn">
                    <h4 className="text-secondary uppercase mb-2.5 font-bold font-heading">About Our School</h4>
                    <h2 className="text-2xl md:text-4xl mb-5 font-bold text-heading font-heading leading-tight">{title}</h2>
                    <p className="mb-5 text-text-main/80 leading-relaxed font-medium">{description}</p>
                    <ul className="mb-[30px] pl-5 list-none space-y-3">
                        <li className="flex items-center gap-3 font-bold text-heading">
                            <span className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs">✔</span>
                            {mission}
                        </li>
                        <li className="flex items-center gap-3 font-bold text-heading">
                            <span className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs">✔</span>
                            {vision}
                        </li>
                    </ul>
                    <Link to="/about" className="inline-block bg-secondary text-white py-[14px] px-10 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary-dark hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                        Learn More
                    </Link>
                </div>
                <div className="flex-1 order-1 md:order-2 w-full animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    <div className="relative">
                        <img
                            src={getImageUrl(image_url)}
                            alt="About Us"
                            className="rounded-md shadow-2xl w-full object-cover min-h-[400px]"
                        />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
