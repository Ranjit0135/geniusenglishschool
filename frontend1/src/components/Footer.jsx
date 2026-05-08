import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../api';

const Footer = () => {
    const [settings, setSettings] = useState({
        schoolName: "Genius English School",
        tagline: "Fostering Excellence",
        address: "Nayabazar, Kathmandu, Nepal",
        phone: "+977-9813990060",
        email: "info@genius.edu.np",
        logoUrl: "/genius logo.webp",
        socials: []
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                if (response.data) {
                    const data = response.data;
                    setSettings({
                        ...data,
                        socials: [
                            { icon: Facebook, link: data.facebookUrl || "https://facebook.com", color: "hover:bg-[#1877F2]", target: "_blank" },
                            { icon: Youtube, link: data.youtubeUrl || "https://youtube.com", color: "hover:bg-[#FF0000]", target: "_blank" }
                        ]
                    });
                }
            } catch (error) {
                console.error('Failed to fetch footer settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const footer = {
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        copyright: `© ${new Date().getFullYear()} ${settings.schoolName}. All rights reserved.`,
        socials: settings.socials.length > 0 ? settings.socials : [
            { icon: Facebook, link: "https://www.facebook.com/ourgeniuskids", color: "hover:bg-[#1877F2]", target: "_blank", },
            { icon: Youtube, link: "https://www.youtube.com/@genius.englishschool", color: "hover:bg-[#FF0000]", target: "_blank", },
        ],
        links: [
            { label: "Home", path: "/" },
            { label: "About Us", path: "/about" },
            { label: "Announcements", path: "/news-events" },
            { label: "Gallery", path: "/gallery" },
            { label: "News & Events", path: "/news-events" },
            { label: "Beyond Academics", path: "/beyond-academics" },
            { label: "Contact Us", path: "/contact" }
        ]
    };

    return (
        <footer className="bg-[#fcfcfc] pt-24 border-t border-gray-100 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#3db2d5]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff9d01]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

            <div className="container mx-auto px-6 max-w-[1140px] relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">

                    {/* Branding Section */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1">
                        <Link to="/" className="inline-block group mb-8">
                            <div className="flex items-center gap-4">
                                <img
                                    src={getImageUrl(settings.logoUrl)}
                                    alt={settings.schoolName}
                                    className="w-14 object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="flex flex-col text-left leading-none">
                                    <span className="font-bold tracking-tighter italic text-[1.6rem] text-[#ff5722] leading-tight uppercase">
                                        {settings.schoolName?.split(' ')[0] || "GENIUS"}
                                        <span className="text-[#192f59] block -mt-1 not-italic text-[1.1rem]">{settings.schoolName?.split(' ').slice(1).join(' ') || "ENGLISH SCHOOL"}</span>
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <p className="text-gray-500 text-[15px] leading-relaxed mb-8 max-w-xs font-medium">
                            {settings.tagline || "Providing a nurturing environment where students excel academically and personally."}
                        </p>
                        <div className="flex gap-4">
                            {footer.socials.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.link}
                                    target={social.target}
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#192f59] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md ${social.color}`}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="flex flex-col items-center lg:items-start order-3 lg:order-2">
                        <h3 className="text-[#192f59] font-black text-[14px] uppercase tracking-[0.2em] mb-10 border-b-2 border-[#3db2d5] pb-2 inline-block">
                            Get In Touch
                        </h3>
                        <div className="space-y-6 w-full">
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-sm bg-blue-50 flex items-center justify-center text-[#3db2d5] group-hover:bg-[#3db2d5] group-hover:text-white transition-all duration-300 flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-[#192f59] uppercase tracking-wider mb-1">Our Location</span>
                                    <span className="text-[14px] text-gray-500 font-medium">{footer.address}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-sm bg-orange-50 flex items-center justify-center text-[#ff9d01] group-hover:bg-[#ff9d01] group-hover:text-white transition-all duration-300 flex-shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-[#192f59] uppercase tracking-wider mb-1">Phone Number</span>
                                    <span className="text-[14px] text-gray-500 font-medium">{footer.phone}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="w-10 h-10 rounded-sm bg-green-50 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-[#192f59] uppercase tracking-wider mb-1">Email Address</span>
                                    <span className="text-[14px] text-gray-500 font-medium">{footer.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="flex flex-col items-center lg:items-end lg:text-right order-2 lg:order-3">
                        <h3 className="text-[#192f59] font-black text-[14px] uppercase tracking-[0.2em] mb-10 border-b-2 border-[#ff9d01] pb-2 inline-block">
                            Quick Links
                        </h3>
                        <div className="grid grid-cols-1 gap-y-4">
                            {footer.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.path}
                                    className="group flex items-center lg:justify-end gap-2 text-[14px] font-bold text-gray-400 hover:text-[#192f59] transition-all duration-300"
                                >
                                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#3db2d5]" />
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 py-10">
                    <div className="flex flex-col md:flex-row justify-center  gap-4 text-[12px] font-bold text-gray-400">
                        <p className="uppercase tracking-widest">{footer.copyright}</p>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
