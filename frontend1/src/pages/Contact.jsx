import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Phone, Mail, Send } from 'lucide-react';
import api, { getImageUrl } from '../api';
import PageHero from '../components/PageHero';

const Contact = () => {
    const [contactInfo, setContactInfo] = useState({
        address: 'Balkhu, Kathmandu',
        email: 'info@genius.edu.np',
        phone: '+977-9813990060',
        description: 'Got any Queries? Please Send us a Message. We will contact you as soon as possible.',
        map_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.240403132262!2d85.32628997549047!3d27.70997787618096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1908c874a40b%3A0x87a26cbf39dd546!2sRai%20School!5e0!3m2!1sen!2snp!4v1708420000000!5m2!1sen!2snp',
        hero_image_url: null
    });
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    useEffect(() => {
        const fetchContactData = async () => {
            setIsLoading(true);
            try {
                const [contactRes, navRes] = await Promise.all([
                    api.get('/ui/contact'),
                    api.get('/public/navigation')
                ]);

                if (contactRes.data) {
                    setContactInfo(prev => ({
                        ...prev,
                        ...contactRes.data
                    }));
                }

                if (navRes.data.school) {
                    setSchoolInfo(navRes.data.school);
                }
            } catch (error) {
                console.error('Failed to fetch contact data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContactData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here (e.g., send to API)
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', phone: '', message: '' });
    };

    const heroImage = getImageUrl(schoolInfo?.contact_hero_image_url || contactInfo.hero_image_url || schoolInfo?.general_hero_image_url);

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
                title="Contact Us"
                backgroundImage={heroImage}
                breadcrumbs={[{ label: 'Contact Us' }]}
            />

            {/* Main Content Area */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-[1140px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Map Section */}
                        <div className="w-full h-full min-h-[400px] rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-2 bg-white group">
                            <div className="w-full h-full aspect-square lg:aspect-auto min-h-[400px]">
                                <iframe
                                    src={contactInfo.map_url}
                                    className="w-full h-full border-0 transition-opacity duration-700 opacity-90 group-hover:opacity-100"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="School Location Map"
                                ></iframe>
                            </div>
                        </div>

                        {/* Contact Form Section */}
                        <div className="flex flex-col h-full bg-white p-2">
                            <div className="mb-10 text-left">
                                <p className="text-[#192f59] text-[16px] md:text-[18px] font-medium leading-relaxed mb-8 border-l-4 border-[#3db2d5] pl-6 italic">
                                    {contactInfo.description || "Got any Queries? Please Send us a Message. We will contact you as soon as possible."}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[13px] font-bold text-[#192f59] uppercase tracking-wider ml-1">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your Full Name....."
                                        required
                                        className="w-full border border-gray-200 px-6 py-4 text-[15px] focus:outline-none focus:border-[#3db2d5] transition-all placeholder:text-gray-300 rounded-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[13px] font-bold text-[#192f59] uppercase tracking-wider ml-1">Your Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your Phone No........"
                                        required
                                        className="w-full border border-gray-200 px-6 py-4 text-[15px] focus:outline-none focus:border-[#3db2d5] transition-all placeholder:text-gray-300 rounded-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[13px] font-bold text-[#192f59] uppercase tracking-wider ml-1">Your Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Enter your message....."
                                        required
                                        rows="5"
                                        className="w-full border border-gray-200 px-6 py-4 text-[15px] focus:outline-none focus:border-[#3db2d5] transition-all placeholder:text-gray-300 rounded-sm resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#192f59] hover:bg-[#3db2d5] text-white px-10 py-4 rounded-sm font-bold text-[14px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95 group"
                                >
                                    <span>Send</span>
                                    <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </button>
                            </form>
                        </div>

                    </div>

                    {/* Quick Contact Info Strip */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-[#fcfcfc] p-8 rounded-sm border-b-2 border-transparent hover:border-[#ff9d01] transition-all duration-300 group shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3db2d5] mb-6 shadow-sm group-hover:bg-[#3db2d5] group-hover:text-white transition-all duration-300">
                                <MapPin size={24} />
                            </div>
                            <h3 className="text-[15px] font-black text-[#192f59] uppercase tracking-widest mb-3">Address</h3>
                            <p className="text-gray-600 text-[14px] font-medium leading-relaxed">{contactInfo.address}</p>
                        </div>

                        <div className="bg-[#fcfcfc] p-8 rounded-sm border-b-2 border-transparent hover:border-[#ff9d01] transition-all duration-300 group shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3db2d5] mb-6 shadow-sm group-hover:bg-[#3db2d5] group-hover:text-white transition-all duration-300">
                                <Phone size={24} />
                            </div>
                            <h3 className="text-[15px] font-black text-[#192f59] uppercase tracking-widest mb-3">Phone</h3>
                            <p className="text-gray-600 text-[14px] font-medium leading-relaxed">{contactInfo.phone}</p>
                        </div>

                        <div className="bg-[#fcfcfc] p-8 rounded-sm border-b-2 border-transparent hover:border-[#ff9d01] transition-all duration-300 group shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#3db2d5] mb-6 shadow-sm group-hover:bg-[#3db2d5] group-hover:text-white transition-all duration-300">
                                <Mail size={24} />
                            </div>
                            <h3 className="text-[15px] font-black text-[#192f59] uppercase tracking-widest mb-3">Email</h3>
                            <p className="text-gray-600 text-[14px] font-medium leading-relaxed">{contactInfo.email}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
