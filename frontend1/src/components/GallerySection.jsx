import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api';

const GallerySection = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const gallery = {
        title: "Our Gallery",
        subtitle: "A glimpse into the vibrant life at Genius English School.",
    };

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get('/gallery');
                if (Array.isArray(response.data)) {
                    setGalleryImages(response.data.slice(0, 8).map(item => ({
                        url: getImageUrl(item.imageUrl),
                        caption: item.caption || 'Gallery Image'
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch gallery items:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGallery();
    }, []);

    if (isLoading) return <div className="py-24 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading Gallery...</div>;

    const imagesToDisplay = galleryImages.length > 0 ? galleryImages : [
        { url: "https://images.unsplash.com/photo-1577896335477-b5e08b77a3d9?q=80&w=800&auto=format&fit=crop", caption: "Classroom Activities" },
        { url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop", caption: "Cultural Events" },
        { url: "https://images.unsplash.com/photo-1526379566213-3932fa2ed586?q=80&w=800&auto=format&fit=crop", caption: "Art & Craft" },
        { url: "https://images.unsplash.com/photo-1542385108-7b9ec3471021?q=80&w=800&auto=format&fit=crop", caption: "Sports Meet" }
    ];

    return (
        <section className="py-6 px-4 bg-white">
            <div className="container mx-auto max-w-[1140px]">
                <div className="text-center mb-12">
                    <h2 className="section-title">{gallery.title}</h2>
                    <div className="section-divider"></div>
                    <p className="text-gray-500 italic">{gallery.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {imagesToDisplay.map((img, idx) => (
                        <div key={idx} className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 p-2 pb-8 relative group">
                            <div className="overflow-hidden h-48">
                                <img
                                    src={img.url}
                                    alt={img.caption}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-2 text-center bg-white">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter">{img.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <a href="/gallery" className="btn-outline inline-block">View All Gallery</a>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
