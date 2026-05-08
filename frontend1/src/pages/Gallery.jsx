import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import api, { getImageUrl } from '../api';
import { X, ChevronLeft, ChevronRight, Maximize2, Download, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const Gallery = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allImages, setAllImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [schoolInfo, setSchoolInfo] = useState(null);

    const normalizeCategory = (cat) => {
        if (!cat || cat.trim() === '') return 'General';
        const trimmed = cat.trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get('/gallery');
                if (Array.isArray(response.data)) {
                    const mappedImages = response.data.map(item => ({
                        url: item.imageUrl,
                        title: item.caption || 'Gallery Image',
                        category: normalizeCategory(item.category)
                    }));

                    setAllImages(mappedImages);

                    const uniqueCategories = ['All', ...new Set(mappedImages.map(img => img.category))];
                    setCategories(uniqueCategories);
                }
            } catch (error) {
                console.error('Failed to fetch gallery items:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchSchoolInfo = async () => {
            try {
                const response = await api.get('/settings');
                if (response.data) {
                    setSchoolInfo(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch school info:', error);
            }
        };

        fetchGallery();
        fetchSchoolInfo();
    }, []);

    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredImages(allImages);
        } else {
            setFilteredImages(allImages.filter(img => img.category === activeCategory));
        }
        setCurrentIndex(0);
    }, [activeCategory, allImages]);

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        setCurrentIndex((currentIndex + 1) % filteredImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((currentIndex - 1 + filteredImages.length) % filteredImages.length);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeLightbox();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex, filteredImages.length]);

    const heroImage = getImageUrl(schoolInfo?.gallery_hero_image_url || schoolInfo?.general_hero_image_url);

    return (
        <div className="bg-white min-h-screen">

            <PageHero
                title="School Gallery"
                backgroundImage={heroImage}
                breadcrumbs={[{ label: 'Gallery' }]}
            />

            <div className="container mx-auto px-4 py-12 max-w-[1140px]">
                {/* Category Filter */}
                {!isLoading && allImages.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-8 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 border-2 ${activeCategory === category
                                    ? 'bg-[#192f59] border-[#192f59] text-white shadow-lg'
                                    : 'bg-white border-gray-100 text-gray-500 hover:border-[#3db2d5] hover:text-[#3db2d5]'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#192f59]"></div>
                    </div>
                ) : allImages.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-400 text-xl font-medium">No images found in the gallery.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                        {filteredImages.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => openLightbox(index)}
                                className="relative group overflow-hidden bg-[#f8fafc] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 rounded-sm"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={getImageUrl(image.url)}
                                        alt={image.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-[#192f59]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                                    <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <Maximize2 className="mx-auto mb-4 text-[#ff9d01]" size={32} />
                                        <p className="font-bold text-lg uppercase tracking-wider mb-1">{image.title}</p>
                                        <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full text-white/90 uppercase tracking-widest">{image.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredImages.length === 0 && allImages.length > 0 && (
                    <div className="text-center py-24">
                        <p className="text-gray-400 text-xl font-medium italic">No images found in category "{activeCategory}".</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {isOpen && filteredImages.length > 0 && (
                <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center backdrop-blur-sm">
                    {/* Header Controls */}
                    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[1010] bg-gradient-to-b from-black/50 to-transparent">
                        <div className="text-white/80 text-sm font-bold tracking-widest">
                            {currentIndex + 1} / {filteredImages.length}
                        </div>
                        <div className="flex gap-8 items-center">
                            <button className="text-white/70 hover:text-[#3db2d5] transition-colors">
                                <Share2 size={20} />
                            </button>
                            <button className="text-white/70 hover:text-[#3db2d5] transition-colors">
                                <Download size={20} />
                            </button>
                            <button
                                onClick={closeLightbox}
                                className="text-white/70 hover:text-[#ff9d01] transition-colors transform hover:rotate-90 duration-300"
                            >
                                <X size={32} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-all z-[1010] p-4 group"
                    >
                        <ChevronLeft size={48} className="transform group-hover:-translate-x-2 transition-transform" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-all z-[1010] p-4 group"
                    >
                        <ChevronRight size={48} className="transform group-hover:translate-x-2 transition-transform" />
                    </button>

                    {/* Main Image Container */}
                    <div className="w-full h-full flex items-center justify-center p-4 md:p-24 overflow-hidden">
                        <img
                            src={getImageUrl(filteredImages[currentIndex].url)}
                            alt={filteredImages[currentIndex].title}
                            className="max-w-full max-h-full object-contain select-none shadow-2xl transition-all duration-500 scale-100"
                        />
                    </div>

                    {/* Footer Info */}
                    <div className="absolute bottom-0 left-0 w-full p-10 text-center bg-gradient-to-t from-black/50 to-transparent">
                        <p className="text-white text-2xl font-bold font-['Quicksand'] uppercase tracking-[0.2em] mb-2 drop-shadow-lg">
                            {filteredImages[currentIndex].title}
                        </p>
                        <span className="text-[#ff9d01] text-xs font-bold uppercase tracking-[0.3em] bg-[#ff9d01]/10 px-4 py-1.5 rounded-full border border-[#ff9d01]/20">
                            {filteredImages[currentIndex].category}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
