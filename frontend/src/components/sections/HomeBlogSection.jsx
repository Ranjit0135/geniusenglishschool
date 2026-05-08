import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { Loader2 } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { STATIC_POSTS } from '../../data/blogData';

const HomeBlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/blogs');
            if (response.data && response.data.length > 0) {
                setBlogs(response.data.filter(b => b.is_published).slice(0, 3));
            } else {
                setBlogs(STATIC_POSTS.slice(0, 3));
            }
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
            setBlogs(STATIC_POSTS.slice(0, 3));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && blogs.length === 0) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!isLoading && blogs.length === 0) return null;

    const colors = ['#4dbce1', '#ff5e3a', '#ffc12e'];
    const btnClasses = ['bg-[#4dbce1]', 'bg-[#ff5e3a]', 'bg-[#ffc12e]'];

    return (
        <section className="bg-white py-16 px-5 lg:py-24 animate-fadeIn">
            <div className="container mx-auto max-w-[1180px]">
                <h2 className="text-2xl md:text-4xl font-bold font-heading mb-12 text-center text-[#192f59]">Our Blog</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                    {blogs.map((item, index) => {
                        const color = colors[index % colors.length];
                        const btnClass = btnClasses[index % btnClasses.length];

                        return (
                            <div key={item.id} className="flex flex-col items-center text-center group">
                                {/* Image Section */}
                                <div className="w-full aspect-[5/3] rounded-md overflow-hidden mb-6 shadow-sm border border-gray-100">
                                    {(item.image_url || item.image) ? (
                                        <img
                                            src={getImageUrl(item.image_url || item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 italic uppercase text-[10px] font-bold">No Image</div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <h3 className="text-[1.4rem] md:text-[1.6rem] font-bold font-heading mb-3 tracking-tighter leading-tight group-hover:text-heading transition-colors" style={{ color }}>
                                    {item.title}
                                </h3>
                                <p className="text-[#666] text-[15px] leading-relaxed mb-6 max-w-[320px] line-clamp-2 font-medium">
                                    {item.excerpt || (item.content?.substring(0, 100) + '...')}
                                </p>

                                <Link
                                    to={`/blog/${item.slug}`}
                                    className={`${btnClass} text-white py-3 px-8 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-heading transition-all shadow-md inline-flex items-center gap-2`}
                                >
                                    Read More
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HomeBlogSection;
