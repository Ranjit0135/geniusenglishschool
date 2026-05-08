import React from 'react';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingSocialIcons from '../components/common/FloatingSocialIcons';
import api from '../api';
import { getImageUrl } from '../utils/imageUtils';
import PrincipalMessage from '../components/sections/PrincipalMessage';
import PageHero from '../components/common/PageHero';

const About = () => {
    const [aboutData, setAboutData] = React.useState(null);
    const [schoolInfo, setSchoolInfo] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await api.get('/ui/about');
                setAboutData(response.data);
            } catch (error) {
                console.error('Failed to fetch about content:', error);
            }
        };

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

        const loadAll = async () => {
            setIsLoading(true);
            await Promise.all([fetchAbout(), fetchSchoolInfo()]);
            setIsLoading(false);
        };
        loadAll();
    }, []);

    const {
        title = "About Us",
        description = "If you would like to study in a school in the heart of the city that focuses on changing the world for a better tomorrow, you’ve chosen the right place.",
        mission = "To provide a nurturing and challenging environment that empowers students to reach their full potential.",
        vision = "To be a leading educational institution recognized for excellence in academic achievement and character development.",
        image_url,
        history_title = "Our Story",
        tour_title = "Special School Tour",
        tour_description = "Our campus tour is designed for prospective students and parents. You will see our facilities, meet our dedicated staff, and experience the life in our school. We invite you to explore our environment and decide what is best for your child's future.",
        tour_image_url,
    } = aboutData || {};

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="about-page font-base text-[#666]">
            <FloatingSocialIcons />
            <InfoBar />
            <Navbar />

            <PageHero
                title={title}
                subtitle="Know Us Better"
                backgroundImage={getImageUrl(schoolInfo?.about_hero_image_url || image_url || schoolInfo?.general_hero_image_url)}
                fallbackImage="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            {/* Introductory Section */}
            <section className="py-20 px-5 bg-white">
                <div className="container mx-auto max-w-[900px] text-center">
                    <div className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        Who We Are
                    </div>
                    <h2 className="text-[2.2rem] md:text-[2.8rem] font-black text-heading font-heading mb-8 leading-tight tracking-tighter">
                        Building a Better <span className="text-secondary italic">Tomorrow</span>
                    </h2>
                    <p className="text-[17px] md:text-[19px] leading-[1.8] text-[#787878] font-medium whitespace-pre-wrap max-w-[800px] mx-auto italic border-l-4 border-primary/20 pl-8 text-left">
                        {description}
                    </p>
                </div>
            </section>

            {/* Principal Message Section */}
            <PrincipalMessage />

            {/* School Tour Section */}
            <section className="py-16 px-5 bg-[#f5f5f5]">
                <div className="container mx-auto max-w-[1180px] flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <div className="md:max-w-[450px]">
                            <div className="w-16 h-16 mb-8 text-secondary">
                                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-3h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                                </svg>
                            </div>
                            <h2 className="text-[2.2rem] font-bold text-heading font-heading mb-6 leading-tight">{tour_title}</h2>
                            <p className="text-[15px] leading-[1.8] text-[#787878] font-medium mb-4 whitespace-pre-wrap">
                                {tour_description}
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative">
                        <img
                            src={tour_image_url ? getImageUrl(tour_image_url) : ""}
                            alt="School Environment"
                            className="rounded-sm shadow-xl w-full"
                        />
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 px-5 bg-[#f9f9f9]">
                <div className="container mx-auto max-w-[1180px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Our Mission */}
                        <div className="bg-white p-10 md:p-12 shadow-sm border-t-4 border-secondary transition-all duration-300 hover:shadow-md group">
                            <div className="w-16 h-16 bg-secondary/10 flex items-center justify-center mb-8 rounded-full group-hover:bg-secondary transition-colors duration-300">
                                <svg className="w-8 h-8 text-secondary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-[1.8rem] font-bold text-heading font-heading mb-6">Our Mission</h3>
                            <p className="text-[15px] leading-[1.8] text-[#787878] font-medium whitespace-pre-wrap">
                                {mission}
                            </p>
                        </div>

                        {/* Our Vision */}
                        <div className="bg-white p-10 md:p-12 shadow-sm border-t-4 border-primary transition-all duration-300 hover:shadow-md group">
                            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-8 rounded-full group-hover:bg-primary transition-colors duration-300">
                                <svg className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-[1.8rem] font-bold text-heading font-heading mb-6">Our Vision</h3>
                            <p className="text-[15px] leading-[1.8] text-[#787878] font-medium whitespace-pre-wrap">
                                {vision}
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            <Footer />
        </div>
    );
};

export default About;
