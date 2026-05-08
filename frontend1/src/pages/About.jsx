import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import PageHero from '../components/PageHero';
import api, { getImageUrl } from '../api';

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [aboutRes, settingsRes] = await Promise.all([
                    api.get('/about'),
                    api.get('/settings')
                ]);
                setAboutData(aboutRes.data);
                setSchoolInfo(settingsRes.data);
            } catch (error) {
                console.error('Failed to fetch about data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const heroImage = getImageUrl(aboutData?.imageUrl || schoolInfo?.logoUrl);

    const whyReasons = [
        "State-of-the art facilities like an indoor swimming pool, good Computer and Science Labs",
        "Entire English Environment",


    ];

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
                title={aboutData?.title || 'About Us'}
                backgroundImage={heroImage}
                breadcrumbs={[{ label: 'About Us' }]}
            />

            {/* Why Genius? Section */}
            <section className="py-16 px-6 bg-white overflow-hidden">
                <div className="container mx-auto max-w-[1140px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        {/* Image Left */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-[#3db2d5]/5 rounded-sm -z-10 transform -rotate-2"></div>
                            <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative">
                                <img
                                    src={getImageUrl(aboutData?.imageUrl, "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1200&auto=format&fit=crop")}
                                    alt="Genius School Building"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#192f59]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#ff9d01]/10 rounded-full -z-10 blur-2xl"></div>
                        </div>

                        {/* Content Right */}
                        <div>
                            <div className="inline-flex items-center gap-2 mb-6">
                                <div className="w-10 h-[2px] bg-[#3db2d5]"></div>
                                <span className="text-[#3db2d5] text-[13px] font-black uppercase tracking-[0.3em]">Our Unique Identity</span>
                            </div>
                            <h2 className="text-2xl md:text-[2.2rem] font-bold text-[#192f59] mb-8 font-['Quicksand'] leading-[1.1] tracking-tight italic">
                                Why <span className="text-[#3db2d5] not-italic">Genius?</span>
                            </h2>
                            <div className="space-y-6 mb-4 ">
                                <p className="text-gray-500 text-[17px] leading-relaxed font-medium">
                                    {aboutData?.content || 'Genius School is a leading educational institution, now located in Kathmandu...'}
                                </p>
                            </div>

                            <div className="max-h-[500px] overflow-y-auto pr-6 custom-scrollbar scroll-smooth">
                                <ul className="grid grid-cols-1 gap-6">
                                    {whyReasons.map((reason, index) => (
                                        <li key={index} className="flex items-start gap-5 text-gray-600 group bg-[#f8fafc] p-4 rounded-sm border-l-4 border-transparent hover:border-[#ff9d01] hover:bg-white hover:shadow-xl transition-all duration-300">
                                            <div className="mt-1 flex-shrink-0 bg-white w-8 h-8 flex items-center justify-center rounded-full text-[#3db2d5] shadow-md group-hover:bg-[#3db2d5] group-hover:text-white transition-colors duration-300">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                            <span className="text-[15.5px] font-semibold leading-[1.6] text-[#192f59]/80 group-hover:text-[#192f59]">{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-8 px-6 bg-gradient-to-br from-[#1e2e4a] via-[#192f59] to-[#1e2e4a] text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#3db2d5]/[0.02] skew-x-12 translate-x-1/4"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#ff9d01]/5 rounded-full blur-2xl"></div>

                <div className="container mx-auto max-w-[900px] relative z-10">
                    <div className="text-center mb-10">
                        <span className="text-[#3db2d5] text-[10px] font-black uppercase tracking-[0.3em] mb-1 block opacity-80">Our Foundation</span>
                        <h2 className="text-2xl md:text-3xl font-bold font-['Quicksand'] italic tracking-tight underline-offset-[8px] decoration-[#ff9d01]/20">Mission & Vision</h2>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-[#3db2d5] to-[#ff9d01] mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-24 items-stretch">
                        {/* Mission Card */}
                        <div className="bg-white/5 backdrop-blur-md p-5 lg:p-8 rounded-sm border border-white/5 hover:bg-white hover:text-[#192f59] transition-all duration-500 group relative flex flex-col justify-center shadow-xl">
                            <div className="absolute -top-3 -right-3 text-5xl font-black text-white/5 group-hover:text-[#192f59]/5 pointer-events-none transition-colors duration-500">M</div>
                            <h3 className="text-lg font-black mb-4 uppercase tracking-widest text-[#3db2d5] group-hover:text-[#ff9d01] transition-colors flex items-center gap-2">
                                <span className="w-6 h-px bg-gradient-to-r from-[#3db2d5] to-transparent group-hover:from-[#ff9d01]"></span>
                                Mission
                            </h3>
                            <p className="text-[14.5px] leading-[1.6] font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                                "{aboutData?.mission || 'Genius School strives for excellence in everything it does, encouraging students to attain academic and personal success.'}"
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-[#ff9d01] p-5 lg:p-8 rounded-sm shadow-xl text-[#192f59] hover:-translate-y-1 transition-all duration-500 group relative flex flex-col justify-center border-b-2 border-black/10">
                            <div className="absolute -top-3 -right-3 text-5xl font-black text-black/5 pointer-events-none">V</div>
                            <h3 className="text-lg font-black mb-4 uppercase tracking-widest text-[#192f59] flex items-center gap-2">
                                <span className="w-6 h-px bg-[#192f59]/20"></span>
                                Vision
                            </h3>
                            <p className="text-[14.5px] leading-[1.6] font-black italic">
                                "{aboutData?.vision || 'Learning is a life-long process and all students and teachers are challenged to exceed their own expectations.'}"
                            </p>
                        </div>
                    </div>

                    {/* Image Strip Below
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="aspect-[16/9] rounded-sm overflow-hidden shadow-lg relative group">
                            <img src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Students" />
                        </div>
                        <div className="aspect-[16/9] rounded-sm overflow-hidden shadow-lg relative group hidden md:block">
                            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Classroom" />
                        </div>
                        <div className="aspect-[16/9] rounded-sm overflow-hidden shadow-lg relative group hidden md:block">
                            <img src="https://images.unsplash.com/photo-1523050853064-85a177c95a0f?q=80&w=600" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt="Library" />
                        </div>
                    </div> */}
                </div>
            </section>
        </div>
    );
};

export default About;
