import React from 'react';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Globe,
    Link as LinkIcon,
    MessageCircle,
    Phone,
    Mail,
    Ticket,
    Star,
    Heart,
    MessageSquare,
    Rss,
    Bell,
    Video,
    Music,
    Target
} from 'lucide-react';

const XIcon = ({ size = 24, ...props }) => (
    React.createElement('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        ...props
    }, React.createElement('path', {
        d: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z'
    }))
);

export const SOCIAL_PLATFORMS = [
    { name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { name: 'Twitter', icon: XIcon, color: '#000000' },
    { name: 'X', icon: XIcon, color: '#000000' },
    { name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
    { name: 'YouTube', icon: Youtube, color: '#FF0000' },
    { name: 'TikTok', icon: Music, color: '#000000' },
    { name: 'Threads', icon: Target, color: '#000000' },
    { name: 'WhatsApp', icon: Phone, color: '#25D366' },
    { name: 'Website', icon: Globe, color: '#4B5563' },
    { name: 'Email', icon: Mail, color: '#EA4335' },
    { name: 'Other', icon: LinkIcon, color: '#ff9d01' }
];

export const AVAILABLE_ICONS = [
    { name: 'Globe', icon: Globe },
    { name: 'MessageCircle', icon: MessageCircle },
    { name: 'MessageSquare', icon: MessageSquare },
    { name: 'Phone', icon: Phone },
    { name: 'Mail', icon: Mail },
    { name: 'Star', icon: Star },
    { name: 'Heart', icon: Heart },
    { name: 'Ticket', icon: Ticket },
    { name: 'Rss', icon: Rss },
    { name: 'Bell', icon: Bell },
    { name: 'Video', icon: Video },
    { name: 'Music', icon: Music },
    { name: 'Target', icon: Target },
    { name: 'LinkIcon', icon: LinkIcon }
];

export const getPlatformInfo = (platformName, iconUrl = null) => {
    if (!platformName) return SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];

    // 1. Check if it's a manual icon
    if (iconUrl && iconUrl.startsWith('icon:')) {
        const iconName = iconUrl.replace('icon:', '');
        const found = AVAILABLE_ICONS.find(i => i.name === iconName);
        if (found) {
            return {
                name: platformName,
                icon: found.icon,
                color: '#ff9d01' // Default color for custom
            };
        }
    }

    // 2. Standard platform lookup - Case Insensitive
    const platform = SOCIAL_PLATFORMS.find(p =>
        p.name.toLowerCase() === platformName.toLowerCase()
    );

    return platform || SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
};
