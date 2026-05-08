import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getImageUrl } from '../../utils/imageUtils';
import { getPlatformInfo } from '../../data/socialPlatforms';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const InfoBar = () => {
    const [socialLinks, setSocialLinks] = useState([]);
    const [contactInfo, setContactInfo] = useState({
        email: 'gesschool@gmail.com', // Initial fallback matching hardcoded values
        phone: '+977 984-1006459'
    });

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await api.get('/social-links');
                setSocialLinks(response.data.filter(link => link.is_active));
            } catch (error) {
                console.error('Failed to fetch social links:', error);
            }
        };

        const fetchContact = async () => {
            try {
                const response = await api.get('/ui/contact');
                if (response.data) {
                    setContactInfo({
                        email: response.data.email || '',
                        phone: response.data.phone || ''
                    });
                }
            } catch (error) {
                console.error('Failed to fetch contact info:', error);
            }
        };

        fetchLinks();
        fetchContact();
    }, []);

    return (
        <div className=" hidden md:flex bg-primary text-white h-10 flex items-center relative z-50 text-sm">

            <div className="container mx-auto px-5 flex justify-between items-center w-full max-w-[1180px]">
                <div className="flex gap-5">
                    <span className="flex items-center align-middle gap-1.5">
                        <Mail size={16} /> <span className='text-xs'>{contactInfo.email}</span>
                    </span>
                    <span className="flex items-center align-middle gap-1.5">
                        <Phone size={16} /> <span className='text-xs'>{contactInfo.phone}</span>
                    </span>
                </div>

                <div className="flex items-center">
                    <div className="flex items-center gap-2">
                        {socialLinks && socialLinks.map((link) => {
                            const platformInfo = getPlatformInfo(link.platform, link.icon_url);
                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer text-white h-7 w-7 rounded-md transition-all hover:scale-110 flex items-center justify-center overflow-hidden shadow-sm shadow-black/20"
                                    style={{ backgroundColor: platformInfo.color }}
                                >
                                    {link.icon_url && !link.icon_url.startsWith('icon:') ? (
                                        <img src={getImageUrl(link.icon_url)} alt={link.platform} className="w-full h-full object-contain p-1.5" />
                                    ) : (
                                        (() => {
                                            const Icon = platformInfo.icon;
                                            return <Icon size={14} />;
                                        })()
                                    )}
                                </a>
                            );
                        })}
                    </div>
                    <Link to="/contact" className="bg-secondary text-white h-10 flex items-center font-bold text-xs uppercase px-5 ml-5">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InfoBar;
