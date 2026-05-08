import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { getImageUrl } from '../../utils/imageUtils';
import { getPlatformInfo } from '../../data/socialPlatforms';

const Footer = () => {
    const [socialLinks, setSocialLinks] = useState([]);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [logoText, setLogoText] = useState({ main: 'Genius', sub: 'School' });
    const [contactInfo, setContactInfo] = useState({
        address: 'Kathmandu, Nepal',
        phone: '+977-980000000',
        email: 'info@geniusenglish.edu.np'
    });

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                // Fetch social links
                const socialResponse = await api.get('/social-links');
                setSocialLinks(socialResponse.data.filter(link => link.is_active));

                // Fetch school info (from navigation API which includes school metadata)
                const navResponse = await api.get('/public/navigation');
                if (navResponse.data.school) {
                    setSchoolInfo(navResponse.data.school);

                    // Parse school name into main and sub parts
                    const nameParts = navResponse.data.school.name.split(' ');
                    if (nameParts.length >= 2) {
                        setLogoText({ main: nameParts[0], sub: nameParts.slice(1).join(' ') });
                    } else {
                        setLogoText({ main: navResponse.data.school.name, sub: '' });
                    }
                }

                // Fetch contact info
                const contactResponse = await api.get('/ui/contact');
                if (contactResponse.data) {
                    setContactInfo({
                        address: contactResponse.data.address || 'Kathmandu, Nepal',
                        phone: contactResponse.data.phone || '+977-980000000',
                        email: contactResponse.data.email || 'info@geniusenglish.edu.np'
                    });
                }
            } catch (error) {
                console.error('Failed to fetch footer data:', error);
            }
        };
        fetchFooterData();
    }, []);

    return (
        <footer className="bg-heading text-gray-400 py-16 text-sm">
            <div className="container mx-auto px-24 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Brand Column */}
                <div>
                    <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-[1.01] active:scale-95 mb-6">
                        <div className="flex flex-col items-start leading-[1.1]">
                            <span className="font-bold tracking-tighter italic text-[1.4rem] text-secondary break-words line-clamp-2">
                                {logoText.main}
                                <span className="text-white italic ml-1">{logoText.sub}</span>
                            </span>
                            <div className="h-[3px] w-10 bg-primary rounded-full mt-0.5"></div>
                        </div>
                    </Link>
                    <p className="mb-6 leading-relaxed">
                        {schoolInfo?.description || "Genius English School is committed to providing quality education in a safe, supportive, and disciplined environment. We focus on academic excellence and character development."}
                    </p>
                    <div className="flex gap-4">
                        {socialLinks.map((link) => {
                            const platformInfo = getPlatformInfo(link.platform, link.icon_url);
                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-md flex items-center justify-center hover:scale-110 transition-all overflow-hidden text-white shadow-sm shadow-black/20"
                                    style={{ backgroundColor: platformInfo.color }}
                                >
                                    {link.icon_url && !link.icon_url.startsWith('icon:') ? (
                                        <img src={getImageUrl(link.icon_url)} alt={link.platform} className="w-full h-full object-contain p-1.5" />
                                    ) : (
                                        (() => {
                                            const Icon = platformInfo.icon;
                                            return <Icon size={16} />;
                                        })()
                                    )}
                                </a>
                            );
                        })}
                    </div>
                </div>



                {/* Campus Life */}
                <div>
                    <h3 className="text-white text-lg font-bold font-heading mb-6 border-b border-gray-700 pb-2 inline-block">School Life</h3>
                    <ul className="space-y-3">
                        <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
                        <li><Link to="/events" className="hover:text-primary transition-colors">Events & Celebrations</Link></li>
                        {/* <li><Link to="/school-life" className="hover:text-primary transition-colors">School Life</Link></li> */}
                        <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                    </ul>
                </div>

                {/* Academics */}
                <div>
                    <h3 className="text-white text-lg font-bold font-heading mb-6 border-b border-gray-700 pb-2 inline-block">Academics</h3>
                    <ul className="space-y-3">
                        <li><Link to="/courses" className="hover:text-primary transition-colors">Our Courses</Link></li>
                        <li><Link to="/submit-testimonial" className="hover:text-primary transition-colors">Parent Feedback</Link></li>
                        <li><Link to="/contact" className="hover:text-primary transition-colors">Admissions</Link></li>
                    </ul>
                </div>

                {/* contacts */}
                <div>
                    <h3 className="text-white text-lg font-bold font-heading mb-6 border-b border-gray-700 pb-2 inline-block">Contact</h3>
                    <ul className="space-y-3">
                        <li><span className="hover:text-primary transition-colors">{contactInfo.address}</span></li>
                        <li><span className="hover:text-primary transition-colors">{contactInfo.phone}</span></li>
                        <li><span className="hover:text-primary transition-colors">{contactInfo.email}</span></li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-5 mt-16 pt-8 border-t border-gray-800 text-center">
                <p>&copy; {new Date().getFullYear()} {schoolInfo?.name || 'Genius School'}. All Rights Reserved. </p>
            </div>
        </footer>
    );
};

export default Footer;
