import React, { useState, useEffect } from 'react';
import {
    Phone,
    Mail
} from 'lucide-react';
import api from '../../api';
import { getImageUrl } from '../../utils/imageUtils';
import { getPlatformInfo } from '../../data/socialPlatforms';

const FloatingSocialIcons = () => {
    const [socialLinks, setSocialLinks] = useState([]);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await api.get('/social-links');
                setSocialLinks(response.data.filter(link => link.is_active));
            } catch (error) {
                console.error('Failed to fetch social links:', error);
            }
        };
        fetchLinks();
    }, []);

    // Split links into left and right (simplified: just list all on one side if preferred, 
    // but I'll stick to a similar layout if links are many)

    return (
        <>
            {/* Socials Floating */}
            <div className="fixed left-0 top-1/2 -translate-y-1/2 z-[200] flex flex-col gap-1">
                {socialLinks.map((link) => {
                    const platform = getPlatformInfo(link.platform, link.icon_url);
                    const IconComponent = platform.icon;

                    return (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white p-2.5 rounded-r-md hover:pl-1.5 transition-all duration-300 shadow-lg flex items-center justify-center w-8 h-8 overflow-hidden"
                            style={{ backgroundColor: platform.color }}
                        >
                            {link.icon_url && !link.icon_url.startsWith('icon:') ? (
                                <img src={getImageUrl(link.icon_url)} alt={link.platform} className="w-full h-full object-contain" />
                            ) : (
                                <IconComponent size={20} />
                            )}
                        </a>
                    );
                })}
            </div>

            {/* Default Contact Side (Right) */}
            {/* <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[200] flex flex-col gap-1">
                <a
                    href="tel:+9779813990060"
                    className="bg-[#25D366] text-white p-2.5 rounded-l-md hover:pr-4 transition-all duration-300 shadow-lg"
                >
                    <Phone size={20} />
                </a>
                <a
                    href="mailto:contact@genius-school.com"
                    className="bg-[#EA4335] text-white p-2.5 rounded-l-md hover:pr-4 transition-all duration-300 shadow-lg"
                >
                    <Mail size={20} />
                </a>
            </div> */}
        </>
    );
};

export default FloatingSocialIcons;
