import React, { useState, useEffect } from 'react';
import api from '../api';
import { getImageUrl } from '../utils/imageUtils';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHero from '../components/common/PageHero';

const Gallery = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allImages, setAllImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [sortOrder, setSortOrder] = useState('newest');

    const normalizeCategory = (cat) => {
        if (!cat || cat.trim() === '') return 'General';
        const trimmed = cat.trim();
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get('/ui/gallery');
                if (Array.isArray(response.data)) {
                    // Map items with normalized category info
                    const mappedImages = response.data.map(item => ({
                        url: item.media_url,
                        title: item.title || 'Gallery Image',
                        category: normalizeCategory(item.category),
                        createdAt: item.createdAt
                    }));

                    setAllImages(mappedImages);

                    // Extract unique categories (already normalized)
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
                const response = await api.get('/public/navigation');
                if (response.data.school) {
                    setSchoolInfo(response.data.school);
                }
            } catch (error) {
                console.error('Failed to fetch school info:', error);
            }
        };

        fetchGallery();
        fetchSchoolInfo();
    }, []);

    // Filter and Sort images
    useEffect(() => {
        let result = [...allImages];

        // Filter
        if (activeCategory !== 'All') {
            result = result.filter(img => img.category === activeCategory);
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredImages(result);
        setCurrentIndex(0); // Reset lightbox index when filtering/sorting changes
    }, [activeCategory, allImages, sortOrder]);

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeLightbox = () => {
        setIsOpen(false);
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    const nextImage = () => {
        setCurrentIndex((currentIndex + 1) % filteredImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((currentIndex - 1 + filteredImages.length) % filteredImages.length);
    };

    // Keyboard support
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

    return (
        <div className="bg-white min-h-screen">
            <InfoBar />
            <Navbar />

            <PageHero
                title="School Gallery"
                subtitle="Captured Moments"
                backgroundImage={getImageUrl(schoolInfo?.gallery_hero_image_url || schoolInfo?.general_hero_image_url)}
                fallbackImage="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            <div className="container mx-auto px-4 py-8 max-w-[1200px]">
                {/* Controls Bar: Category Filter & Sort */}
                {!isLoading && allImages.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        {/* Categories */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-6 py-2 rounded-full font-bold text-[11px] tracking-wider uppercase transition-all duration-300 border-2 ${activeCategory === category
                                        ? 'bg-[#d32f2f] border-[#d32f2f] text-white shadow-lg'
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-[#d32f2f] hover:text-[#d32f2f]'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3 min-w-[180px]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort:</span>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 outline-none focus:border-[#d32f2f] transition-all cursor-pointer w-full"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                )}


                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : allImages.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl font-medium">No images found in the gallery.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 animate-fadeIn">
                        {filteredImages.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => openLightbox(index)}
                                className="relative group overflow-hidden rounded-lg shadow-md aspect-square bg-[#f5f5f5] cursor-pointer"
                            >
                                <img
                                    src={getImageUrl(image.url)}
                                    alt={image.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 p-4">
                                        <div className="text-2xl mb-2">🔍</div>
                                        <p className="font-bold text-sm uppercase tracking-wider line-clamp-2">{image.title}</p>
                                        <div className="mt-2 flex flex-col gap-1">
                                            <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded text-white/90 uppercase tracking-widest self-center w-fit">{image.category}</span>
                                            {image.createdAt && (
                                                <span className="text-[8px] text-white/60 uppercase tracking-tighter">{new Date(image.createdAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredImages.length === 0 && allImages.length > 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-xl font-medium">No images found in category "{activeCategory}".</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {isOpen && filteredImages.length > 0 && (
                <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center animate-fadeIn">
                    {/* Header: Counter and Controls */}
                    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[1010]">
                        <div className="text-white text-lg font-medium">
                            {currentIndex + 1} / {filteredImages.length}
                        </div>
                        <div className="flex gap-6 items-center">
                            <button
                                onClick={closeLightbox}
                                className="text-white hover:text-gray-300 transition-colors text-3xl font-light"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 md:left-8 text-white text-4xl hover:text-gray-300 transition-colors z-[1010] p-4 group"
                    >
                        <span className="inline-block transition-transform group-hover:-translate-x-1">‹</span>
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-4 md:right-8 text-white text-4xl hover:text-gray-300 transition-colors z-[1010] p-4 group"
                    >
                        <span className="inline-block transition-transform group-hover:translate-x-1">›</span>
                    </button>

                    {/* Main Image Container */}
                    <div className="w-full h-full flex items-center justify-center p-4 md:p-20">
                        <img
                            src={getImageUrl(filteredImages[currentIndex].url)}
                            alt={filteredImages[currentIndex].title}
                            className="max-w-full max-h-full object-contain select-none shadow-2xl animate-zoomIn"
                        />
                    </div>

                    {/* Caption (Optional) */}
                    <div className="absolute bottom-10 left-0 w-full text-center p-4">
                        <p className="text-white text-xl font-bold font-heading uppercase tracking-widest drop-shadow-md">
                            {filteredImages[currentIndex].title}
                        </p>
                        <div className="flex justify-center items-center gap-3 mt-1">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-[0.3em]">{filteredImages[currentIndex].category}</span>
                            {filteredImages[currentIndex].createdAt && (
                                <span className="text-white/40 text-[10px] uppercase font-medium">{new Date(filteredImages[currentIndex].createdAt).toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Gallery;
