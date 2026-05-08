import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, MapPin, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import api, { getImageUrl } from '../api';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [navigation, setNavigation] = useState([]);
    const [logoText, setLogoText] = useState({ main: 'Genius', sub: 'English School' });
    const [logoUrl, setLogoUrl] = useState('/genius logo.webp');
    const [siteInfo, setSiteInfo] = useState({
        name: "Genius English School",
        tagline: "Fostering Excellence",
        logo: "/genius logo.webp",
        location: "Nayabazar",
        phone: "+977-9813990060"
    });
    const location = useLocation();

    const defaultNavigation = [
        { label: 'Home', path: '/', exact: true },
        { label: 'About Us', path: '/about' },
        { label: 'Updates & Events', path: '/news-events' },
        { label: 'Gallery', path: '/gallery' },
        { label: 'Contact Us', path: '/contact' },
    ];

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const response = await api.get('/public/navigation');
                if (response.data) {
                    const { school, menu } = response.data;

                    // Handle School Identity
                    if (school) {
                        if (school.logo) {
                            setLogoUrl(getImageUrl(school.logo, "/genius logo.webp"));
                        } else {
                            setLogoUrl("/genius logo.webp");
                        }
                        const nameParts = (school.name || "Genius English School").split(' ');
                        if (nameParts.length >= 2) {
                            setLogoText({ main: nameParts[0], sub: nameParts.slice(1).join(' ') });
                        } else {
                            setLogoText({ main: school.name, sub: '' });
                        }
                    }

                    // Handle Menu Items
                    if (menu && menu.length > 0) {
                        setNavigation(menu);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch navigation data:', error);
            }
        };

        fetchNavData();
    }, []);

    const menuItems = navigation.length > 0 ? navigation : defaultNavigation;

    // Handle scroll effect for sticky navbar shadow
    // Handle scroll effect for sticky navbar shadow
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        if (path.startsWith('/#')) return false; // Don't highlight hash links as active pages for now
        return location.pathname === path;
    };


    return (
        <nav className={`sticky top-0 left-0 w-full z-50 bg-[#f3f3f3] transition-all duration-300 ${scrolled ? 'shadow-md shadow-black/10' : ''} h-[80px]`}>
            <div className="container mx-auto px-4 lg:px-6 h-full flex justify-between items-center bg-[#f3f3f3]">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-[1.01] active:scale-95 ml-10 md:ml-24">
                    {logoUrl && (
                        <div className="h-[45px] md:h-[55px] flex-shrink-0 flex items-center">
                            <img src={logoUrl} alt="Logo" className="h-full object-contain" />
                        </div>
                    )}

                    <div className="flex flex-col items-start leading-[1.1] max-w-[200px] md:max-w-none">
                        <span className="font-bold tracking-tighter italic text-[1.1rem] md:text-[1.5rem] text-[#ff5722] whitespace-nowrap">
                            {logoText.main}
                            <span className="text-[#192f59] italic ml-1">{logoText.sub}</span>
                        </span>
                        <div className="h-[3px] w-12 bg-[#3db2d5] rounded-full mt-0.5"></div>
                    </div>
                </Link>



                <div className="hidden lg:flex items-center h-full">
                    {menuItems.map((item) => (
                        <div key={item.label} className="group h-full flex items-center relative px-2 xl:px-4">
                            <Link
                                to={item.path}
                                className={`text-[12px] xl:text-[13px] font-black uppercase tracking-widest text-[#192f59] group-hover:text-[#ff9d01] transition-all relative h-full flex items-center whitespace-nowrap ${isActive(item.path) ? 'text-[#ff9d01]' : ''}`}
                            >
                                {item.label}
                                {isActive(item.path) && <span className="absolute bottom-3 left-0 w-full h-0.5 bg-[#ff9d01] transition-transform duration-300"></span>}
                                <span className="absolute bottom-3 left-0 w-0 h-0.5 bg-[#ff9d01] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden text-[#192f59] focus:outline-none relative z-[1100]"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>



            {isOpen &&
                <div className={`fixed top-0 left-0 w-[80%] max-w-[300px] h-full bg-white shadow-2xl z-[1050] transition-transform duration-300 ease-out overflow-y-auto lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full hidden'}`}>
                    <div className="p-6 flex justify-between items-center border-b border-gray-100">
                        <span className="font-bold text-[#192f59]">MENU</span>
                        <button onClick={() => setIsOpen(false)}><X size={24} className="text-gray-500" /></button>
                    </div>

                    <div className="py-2">
                        {menuItems.map((item) => (
                            <div key={item.label}>
                                <div
                                    className="flex justify-between items-center px-6 py-4 border-b border-gray-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Link to={item.path} className={`text-sm font-bold uppercase ${isActive(item.path) ? 'text-[#ff9d01]' : 'text-[#192f59]'}`}>
                                        {item.label}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-gray-50 mt-auto border-t border-gray-100">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <MapPin size={14} />
                                <span>{siteInfo.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Phone size={14} />
                                <span>{siteInfo.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </nav>
    );
};

export default Navbar;
