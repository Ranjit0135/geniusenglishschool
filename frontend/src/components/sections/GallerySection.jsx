import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getImageUrl } from '../../utils/imageUtils';

const GallerySection = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get('/ui/gallery');
                if (Array.isArray(response.data)) {
                    // Map to consistent format
                    const mapped = response.data.map(item => ({
                        url: getImageUrl(item.media_url),
                        title: item.title || 'Gallery Image'
                    }));
                    setGalleryImages(mapped);
                }
            } catch (error) {
                console.error('Failed to fetch gallery items:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGallery();
    }, []);

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
        setCurrentIndex((currentIndex + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((currentIndex - 1 + galleryImages.length) % galleryImages.length);
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
    }, [isOpen, currentIndex, galleryImages.length]);

    const defaultImages = [
        { url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", title: "Students Studying" },
        { url: "https://images.unsplash.com/photo-1503919545889-aef6d293c9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", title: "Classroom Activity" },
        { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", title: "Outdoor Learning" },
        { url: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80", title: "Sports Day" },
    ];

    const imagesToDisplay = galleryImages.length > 0
        ? galleryImages.slice(0, 4)
        : defaultImages;

    if (isLoading) return <div className="h-60 bg-gray-50 animate-pulse flex items-center justify-center font-bold text-gray-300 tracking-widest uppercase text-xs">Loading Gallery...</div>;

    return (
        <>
            <section className="flex flex-wrap md:flex-nowrap gap-4 p-1">
                {imagesToDisplay.map((image, index) => (
                    <div
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="w-full md:w-1/4 h-[250px] relative group overflow-hidden cursor-pointer"
                    >
                        <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-white text-xl">＋</span>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Lightbox Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center animate-fadeIn">
                    {/* Header */}
                    <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-[1010]">
                        <div className="text-white/80 text-sm font-bold uppercase tracking-widest">
                            {currentIndex + 1} / {imagesToDisplay.length}
                        </div>
                        <button
                            onClick={closeLightbox}
                            className="text-white hover:text-primary transition-colors text-3xl font-light p-2"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Navigation */}
                    <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 md:left-8 text-white/50 text-5xl hover:text-white transition-colors z-[1010] p-4 group"
                    >
                        <span className="inline-block transition-transform group-hover:-translate-x-2">‹</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 md:right-8 text-white/50 text-5xl hover:text-white transition-colors z-[1010] p-4 group"
                    >
                        <span className="inline-block transition-transform group-hover:translate-x-2">›</span>
                    </button>

                    {/* Image */}
                    <div className="w-full h-full flex items-center justify-center p-4 md:p-20" onClick={closeLightbox}>
                        <img
                            src={imagesToDisplay[currentIndex].url}
                            alt={imagesToDisplay[currentIndex].title}
                            className="max-w-full max-h-full object-contain select-none shadow-2xl animate-zoomIn"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Caption */}
                    <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
                        <p className="text-white text-lg font-black uppercase tracking-[0.2em] drop-shadow-lg">
                            {imagesToDisplay[currentIndex].title}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default GallerySection;
