import React, { useState, useEffect } from 'react';
import { Sparkles, Mountain, Waves, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import api, { getImageUrl } from '../api';

const BeyondAcademics = () => {
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const title = "Beyond Academics";
    const description = "Teamwork, leadership, creativity and healthy competition are developed through extra curricular activities. Genius English School has a well-designed curriculum with varied extra-curricular activities along with the normal course of study.";

    useEffect(() => {
        const fetchSchoolInfo = async () => {
            try {
                const response = await api.get('/public/navigation');
                if (response.data.school) {
                    setSchoolInfo(response.data.school);
                }
            } catch (error) {
                console.error('Failed to fetch school info:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchoolInfo();
    }, []);

    const items = [
        {
            title: "Planetarium",
            description: "Marvel at stars and constellations in Genius School's mobile planetarium. Learn and be amazed by the planets, sun and moon in our solar system. Go on an incredible journey through space!",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
            buttonText: "Explore More",
            icon: Sparkles,
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            title: "Wall Climbing",
            description: "Wall Climbing provides opportunity to build physical and cognitive skills. Our facility is designed for safety and challenge. Trained coaches with proper equipment ensure a safe environment for all students.",
            image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop",
            buttonText: "Explore More",
            icon: Mountain,
            color: "text-orange-500",
            bg: "bg-orange-50"
        },
        {
            title: "Indoor Swimming Pool",
            description: "Our indoor swimming pool is a half Olympic size, six lane competition pool, with changing facilities and a multi-purpose teaching space. It's designed for both training and recreational use.",
            image: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?q=80&w=800&auto=format&fit=crop",
            buttonText: "Explore More",
            icon: Waves,
            color: "text-blue-500",
            bg: "bg-blue-50"
        }
    ];

    const heroImage = getImageUrl(schoolInfo?.general_hero_image_url);

    if (isLoading) {
        return (
            <div className="flex justify-center py-24 min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#192f59]"></div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-['Inter',sans-serif]">
            <PageHero
                title="Beyond Academics"
                backgroundImage={heroImage}
                breadcrumbs={[{ label: 'Beyond Academics' }]}
            />

            <section id="beyond-academics" className="py-20 bg-[#fcfcfc] overflow-hidden">
                <div className="container mx-auto px-6 max-w-[1140px]">

                    {/* Header Section */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="w-10 h-[2px] bg-[#3db2d5]"></div>
                            <span className="text-[#3db2d5] text-[13px] font-black uppercase tracking-[0.3em]">Excellence Beyond Classrooms</span>
                        </div>
                        <h2 className="text-3xl md:text-[2.8rem] font-bold text-[#192f59] mb-6 font-['Quicksand'] italic tracking-tight leading-tight">
                            {title}
                        </h2>
                        <div className="w-20 h-1 bg-[#ff9d01] mx-auto rounded-full mb-8"></div>
                        <p className="text-gray-500 max-w-3xl mx-auto text-[17px] leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>

                    {/* Refined Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-sm border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden"
                            >
                                {/* Image with specialized hover effect */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#192f59]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                        <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500`}>
                                            <item.icon size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Refined Content Area */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <h3 className="text-[#192f59] font-bold text-xl uppercase tracking-tighter italic">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <p className="text-gray-500 text-[15px] leading-relaxed mb-8 flex-grow font-['Inter']">
                                        {item.description}
                                    </p>

                                    <button className="inline-flex items-center gap-2 text-[#192f59] font-black text-[13px] uppercase tracking-widest group/btn transition-colors hover:text-[#3db2d5] self-start">
                                        <span>{item.buttonText}</span>
                                        <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                    </button>
                                </div>

                                {/* Bottom accent bar */}
                                <div className="h-1.5 w-0 bg-gradient-to-r from-[#3db2d5] to-[#ff9d01] transition-all duration-[700ms] group-hover:w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BeyondAcademics;
