import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Facebook, Linkedin, Instagram, Globe } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { getPlatformInfo } from '../../data/socialPlatforms';

const PrincipalMessage = () => {
    const [principalData, setPrincipalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrincipal = async () => {
            try {
                const response = await api.get('/ui/principal-message');
                console.log('DEBUG: Principal Data Fetched:', response.data);
                console.log('DEBUG: Principal is_active:', response.data?.is_active);
                setPrincipalData(response.data);
            } catch (error) {
                console.error('Failed to fetch principal content:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrincipal();
    }, []);

    if (isLoading) return (
        <div className="py-20 h-96 bg-gray-50 animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const {
        principal_name = "Subodh Raimajhi",
        principal_role = "Principal",
        principal_message = "Education is not just about books; it's about building character and igniting a lifelong passion for learning in every child.",
        principal_image_url = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop",
        facebook_url,
        twitter_url,
        linkedin_url,
        instagram_url,
        social_links = [],
        is_active = true
    } = principalData || {};

    // Only hide if explicitly false or 0
    if (is_active === false || is_active === 0) return null;

    // Ensure we handle the case where social_links might be null or string from DB
    let parsedSocialLinks = [];
    try {
        if (social_links) {
            if (typeof social_links === 'string') {
                parsedSocialLinks = JSON.parse(social_links);
            } else if (Array.isArray(social_links)) {
                parsedSocialLinks = social_links;
            }
            console.log('DEBUG: Parsed Social Links:', parsedSocialLinks);
        }
    } catch (e) {
        console.error('Error parsing social_links:', e);
        parsedSocialLinks = [];
    }

    const activeSocialLinks = Array.isArray(parsedSocialLinks)
        ? parsedSocialLinks.filter(l => l && (l.is_active === true || l.is_active === undefined || l.is_active === 1))
        : [];

    // URL Helper: Ensure protocol
    const ensureUrlInfo = (url) => {
        if (!url) return "";
        const trimmed = url.trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
            return trimmed;
        }
        return `https://${trimmed}`;
    };

    // Fallback logic - If new social_links is empty, try legacy fields
    const displayLinks = activeSocialLinks.length > 0
        ? activeSocialLinks
        : [
            { platform: 'Facebook', url: facebook_url },
            { platform: 'Twitter', url: twitter_url },
            { platform: 'LinkedIn', url: linkedin_url },
            { platform: 'Instagram', url: instagram_url }
        ]
            .filter(link => link && link.url && link.url.trim())
            .map(link => ({ ...link, url: ensureUrlInfo(link.url) }));

    console.log('DEBUG: Display Links Calculated:', displayLinks);

    return (
        <section className="py-10 px-5 bg-gray-50 overflow-hidden ">
            <div className="container mx-auto flex flex-col md:flex-row gap-[60px] lg:gap-[100px] items-center max-w-[1180px]">
                {/* Image Column */}
                <div className="flex-1 w-full animate-fadeIn">
                    <div className="relative group">
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10 group-hover:bg-secondary/20 transition-colors duration-500"></div>

                        <div className="relative rounded-md overflow-hidden shadow-2xl border-2 border-white group">
                            <img
                                src={getImageUrl(principal_image_url)}
                                alt={principal_name}
                                className="w-full object-cover min-h-[450px] md:min-h-[550px] transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop" }}
                            />


                        </div>

                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10 translate-x-4 translate-y-4"></div>
                    </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                    <div className="inline-block border-l-4 border-secondary pl-4 mb-6">
                        <h4 className="text-secondary uppercase font-black text-xs tracking-[0.3em] font-heading">
                            Leadership Message
                        </h4>
                    </div>

                    <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-8 text-heading font-heading leading-[1.1] tracking-tighter italic">
                        Message From <span className="text-primary">Principal</span>
                    </h2>

                    <div className="relative mb-4">
                        <span className="absolute -top-6 -left-8 text-secondary/10 text-8xl font-black pointer-events-none">"</span>
                        <p className="text-lg md:text-lg text-text-main/80 leading-relaxed font-medium italic relative z-10">
                            {principal_message}
                        </p>
                    </div>

                    <div className="flex flex-col space-y-1 mb-10">
                        <h3 className="text-2xl font-black text-heading font-heading tracking-tight italic">
                            {principal_name}
                        </h3>
                        <p className="text-secondary font-bold text-[16px] uppercase tracking-[0.1em]">
                            {principal_role}
                        </p>
                    </div>

                    {/* Enhanced Dynamic Social Icons Row */}
                    {displayLinks.length > 0 && (
                        <div className="pt-6 flex flex-col gap-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-gray-200"></span>
                                Stay Connected
                            </p>
                            <div className="flex items-center gap-4">
                                {displayLinks.map((link, idx) => {
                                    const info = getPlatformInfo(link.platform, link.icon_url);
                                    if (!info) return null;
                                    const Icon = info.icon;
                                    const finalUrl = ensureUrlInfo(link.url);

                                    return (
                                        <a
                                            key={idx}
                                            href={finalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={link.platform}
                                            className="w-14 h-14 rounded-full bg-white shadow-lg border border-gray-50 flex items-center justify-center text-heading hover:text-white hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                                        >
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                style={{ backgroundColor: info.color || '#ff9d01' }}
                                            ></div>
                                            <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                                                {link.icon_url && !link.icon_url.startsWith('icon:') ? (
                                                    <img src={getImageUrl(link.icon_url)} alt="" className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />
                                                ) : (
                                                    Icon ? <Icon size={24} /> : <Globe size={24} />
                                                )}
                                            </span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PrincipalMessage;
