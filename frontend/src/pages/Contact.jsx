import React, { useState, useEffect } from 'react';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingSocialIcons from '../components/common/FloatingSocialIcons';
import PageHero from '../components/common/PageHero';
import { Link } from 'react-router-dom';
import api from '../api';
import { getImageUrl } from '../utils/imageUtils';

const Contact = () => {
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [socialLinks, setSocialLinks] = useState([]);
    const [contactInfo, setContactInfo] = useState({
        address: '',
        email: '',
        phone: '',
        description: '',
        map_url: ''
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

        const fetchLinks = async () => {
            try {
                const response = await api.get('/social-links');
                setSocialLinks(response.data.filter(link => link.is_active));
            } catch (error) {
                console.error('Failed to fetch social links:', error);
            }
        };

        const fetchContactInfo = async () => {
            try {
                const response = await api.get('/ui/contact');
                if (response.data) {
                    setContactInfo(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch contact info:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchoolInfo();
        fetchLinks();
        fetchContactInfo();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="contact-page font-base text-[#666] bg-white">
            <FloatingSocialIcons />
            <InfoBar />
            <Navbar />

            <PageHero
                title="Contact Us"
                subtitle="Get In Touch"
                backgroundImage={schoolInfo?.contact_hero_image_url || contactInfo.hero_image_url || schoolInfo?.general_hero_image_url}
                fallbackImage="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            {/* Main Content Area */}
            <div className="py-24 px-5">
                <div className="container mx-auto max-w-[1180px] grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Contact Form Column */}
                    <div className="lg:col-span-8">
                        <div className="md:max-w-[700px]">
                            <h2 className="text-2xl font-bold text-heading font-heading mb-6 tracking-wide uppercase">Leave Us Your Info</h2>
                            <p className="text-[15px] leading-[1.8] text-[#787878] font-medium mb-12">
                                {contactInfo.description || "A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart."}
                            </p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                    <input
                                        type="text"
                                        placeholder="Full Name*"
                                        className="w-full bg-[#f7f7f7] border-none px-6 py-4 text-sm focus:ring-2 focus:ring-[#3db2d5] outline-none transition-all placeholder:text-[#999] placeholder:font-medium"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email*"
                                        className="w-full bg-[#f7f7f7] border-none px-6 py-4 text-sm focus:ring-2 focus:ring-[#3db2d5] outline-none transition-all placeholder:text-[#999] placeholder:font-medium"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Subject*"
                                        className="w-full bg-[#f7f7f7] border-none px-6 py-4 text-sm focus:ring-2 focus:ring-[#3db2d5] outline-none transition-all placeholder:text-[#999] placeholder:font-medium"
                                    />
                                    <textarea
                                        placeholder="Message*"
                                        rows="6"
                                        className="w-full bg-[#f7f7f7] border-none px-6 py-4 text-sm focus:ring-2 focus:ring-[#3db2d5] outline-none transition-all placeholder:text-[#999] placeholder:font-medium resize-none"
                                    ></textarea>
                                </div>
                                <button className="w-full bg-[#56c0e0] hover:bg-heading text-white px-8 py-4 rounded-sm font-bold text-[12px] uppercase tracking-[0.25em] transition-all duration-300 shadow-md">
                                    Submit Now
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info Column */}
                    <aside className="lg:col-span-4 space-y-12">

                        {/* Location Section */}
                        <div>
                            <h3 className="text-sm font-bold text-heading font-heading mb-8 tracking-wide uppercase">Location</h3>
                            <div className="space-y-6 text-[14px] leading-relaxed text-[#787878] font-medium">
                                <p>
                                    {contactInfo.address || "Sorakhutte, Kathmandu"}
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4 text-heading/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="hover:text-primary cursor-pointer transition-colors">{contactInfo.email || "contact@infinitewptheme.com"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4 text-heading/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1c-5.054 0-9.141-3.662-9.948-8.487A2 2 0 013 10V5z" />
                                        </svg>
                                        <span>{contactInfo.phone || "+977 9813990060"}</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div>
                            <h3 className="text-sm font-bold text-heading font-heading mb-8 tracking-wide uppercase">Map</h3>
                            <div className="relative aspect-video bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                                {contactInfo.map_url ? (
                                    <iframe
                                        src={contactInfo.map_url}
                                        className="w-full h-full border-0 grayscale"
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Location Map"
                                    ></iframe>
                                ) : (
                                    <>
                                        <img
                                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                                            alt="Location Map"
                                            className="w-full h-full object-cover grayscale"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-8 h-8 bg-secondary rounded-full border-4 border-white shadow-lg animate-bounce"></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                    </aside>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
