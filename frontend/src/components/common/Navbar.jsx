import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import api from '../../api';
import { getImageUrl } from '../../utils/imageUtils';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [logoText, setLogoText] = useState({ main: 'Genius', sub: 'English School' });
    const [logoUrl, setLogoUrl] = useState('');
    const location = useLocation();

    useEffect(() => {
        const fetchNavigation = async () => {
            try {
                const response = await api.get('/public/navigation');
                if (response.data.menu) {
                    setMenuItems(response.data.menu);
                }
                if (response.data.school) {
                    setLogoUrl(getImageUrl(response.data.school.logo));

                    // Parse school name into main and sub parts
                    const nameParts = response.data.school.name.split(' ');
                    if (nameParts.length >= 2) {
                        setLogoText({ main: nameParts[0], sub: nameParts.slice(1).join(' ') });
                    } else {
                        setLogoText({ main: response.data.school.name, sub: '' });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch navigation:', error);
                setMenuItems([
                    { label: 'Home', path: '/' },
                    { label: 'About', path: '/about' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Events', path: '/events' },
                    { label: 'Gallery', path: '/gallery' },
                    { label: 'Contact', path: '/contact' },
                ]);
            }
        };

        fetchNavigation();
    }, []);

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="h-[100px] bg-white shadow-sm sticky top-0 z-[100] flex items-center">
            <div className="container mx-auto lg:px-10 md:px-8 sm:px-4 px-2 flex justify-between items-center w-full max-w-[1400px]">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 md:gap-4 transition-transform hover:scale-[1.01] active:scale-95">
                    {logoUrl && (
                        <div className="h-[40px] md:h-[50px] flex-shrink-0 flex items-center">
                            <img src={logoUrl} alt="Logo" className="h-full object-contain " />
                        </div>
                    )}

                    <div className="flex flex-col items-start leading-[1.1] max-w-[180px] md:max-w-[300px]">
                        <span className={`font-bold  tracking-tighter italic ${logoUrl ? 'text-[1.0rem] md:text-[1.6rem]' : 'text-[1.0rem] md:text-[1.6rem]'} text-secondary break-words line-clamp-2`}>
                            {logoText.main}
                            <span className="text-tpl-heading italic ml-1">{logoText.sub}</span>
                        </span>
                        <div className="h-[3px] w-10 bg-primary rounded-full mt-0.5"></div>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden [@media(min-width:1024px)]:flex gap-8 items-center">
                    {menuItems.map((item) => (
                        <div key={item.path} className="relative group/menu">
                            <Link
                                to={item.path}
                                className={`font-bold text-[15px] py-10 transition-all duration-300 flex items-center gap-1.5 ${isActive(item.path)
                                    ? 'text-primary'
                                    : 'text-heading hover:text-primary/80'
                                    }`}
                            >
                                {item.label}
                                {item.subItems && item.subItems.length > 0 && (
                                    <ChevronDown size={14} className="group-hover/menu:rotate-180 transition-transform duration-300" />
                                )}
                            </Link>

                            {/* Dropdown Menu */}
                            {item.subItems && item.subItems.length > 0 && (
                                <div className="absolute top-[100%] left-[-20px] bg-white shadow-xl py-4 min-w-[200px] border-t-2 border-primary opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0 translate-y-4 transition-all duration-300 rounded-b-xl z-[150]">
                                    {item.subItems.map(sub => (
                                        <Link
                                            key={sub.path}
                                            to={sub.path}
                                            className="block px-6 py-2.5 text-[14px] font-bold text-heading hover:bg-gray-50 hover:text-primary transition-colors border-l-4 border-transparent hover:border-primary"
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}


                    <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/80 transition-all active:scale-90"><Link to="/login">Login</Link></button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="[@media(min-width:1024px)]:hidden text-3xl text-heading focus:outline-none hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                {/* Mobile Menu Dropdown */}
                <div className={`${isMenuOpen ? 'flex' : 'hidden'} fixed top-[100px] left-0 w-full h-[calc(100vh-100px)] bg-white/95 backdrop-blur-md p-6 shadow-2xl flex-col gap-2 [@media(min-width:1024px)]:hidden overflow-y-auto animate-slideDown`}>
                    {menuItems.map((item) => (
                        <div key={item.path} className="w-full">
                            <Link
                                to={item.path}
                                className={`flex justify-between items-center w-full font-bold text-xl py-3 border-b border-gray-100 ${isActive(item.path) ? 'text-primary' : 'text-heading'}`}
                                onClick={() => !item.subItems?.length && setIsMenuOpen(false)}
                            >
                                {item.label}
                                {item.subItems && item.subItems.length > 0 && <ChevronDown size={20} />}
                            </Link>

                            {item.subItems && item.subItems.length > 0 && (
                                <div className="pl-6 py-2 flex flex-col gap-3">
                                    {item.subItems.map(sub => (
                                        <Link
                                            key={sub.path}
                                            to={sub.path}
                                            className="text-lg font-medium text-gray-500 hover:text-primary transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button className="bg-primary text-white  py-2 w-24 rounded-full hover:bg-primary/80 transition-all active:scale-90"><Link to="/login">Login</Link></button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
