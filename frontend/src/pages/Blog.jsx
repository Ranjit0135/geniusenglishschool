import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import FloatingSocialIcons from '../components/common/FloatingSocialIcons';
import PageHero from '../components/common/PageHero';
import api from '../api';
import { getImageUrl } from '../utils/imageUtils';
import { STATIC_POSTS } from '../data/blogData';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;

    useEffect(() => {
        fetchPosts();
        fetchSchoolInfo();
    }, []);

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

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/blogs');
            if (response.data && response.data.length > 0) {
                setPosts(response.data.filter(p => p.is_published));
            } else {
                setPosts(STATIC_POSTS);
            }
        } catch (error) {
            console.error('Failed to fetch blog posts:', error);
            setPosts(STATIC_POSTS);
        } finally {
            setIsLoading(false);
        }
    };

    // Pagination Logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll past hero
    };

    return (
        <div className="blog-page font-base text-[#666] bg-[#f5f5f5]">
            <FloatingSocialIcons />
            <InfoBar />
            <Navbar />

            <PageHero
                title="School Blog"
                subtitle="Our Latest Stories"
                backgroundImage={getImageUrl(schoolInfo?.blog_hero_image_url || schoolInfo?.general_hero_image_url)}
                fallbackImage="https://images.unsplash.com/photo-1503919219737-6762b3bb1b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />

            {/* Main Content Area */}
            <div className="py-20 px-5">
                <div className="container mx-auto max-w-[1180px] grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Blog Posts Column */}
                    <div className="lg:col-span-8">
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : currentPosts.length > 0 ? (
                            <>
                                {currentPosts.map((post) => (
                                    <article key={post.id} className="bg-white rounded-sm overflow-hidden shadow-sm mb-12 flex flex-col">
                                        <img
                                            src={getImageUrl(post.image_url || post.image)}
                                            alt={post.title}
                                            className="w-full h-auto max-h-[400px] object-cover"
                                        />
                                        <div className="p-12 relative">
                                            {post.is_sticky && (
                                                <span className="absolute top-[-25px] left-12 bg-white px-5 py-2 text-[11px] font-bold text-heading shadow-md flex items-center gap-2">
                                                    <span className="text-secondary text-base">★</span> STICKY POST
                                                </span>
                                            )}
                                            <Link to={`/blog/${post.slug}`}>
                                                <h2 className="text-[1.5rem] font-bold text-heading font-heading mb-6 hover:text-primary transition-colors cursor-pointer leading-tight font-heading">
                                                    {post.title}
                                                </h2>
                                            </Link>
                                            <div className="flex gap-4 text-[13px] text-[#9a9a9a] font-bold mb-8 uppercase tracking-normal">
                                                <span>{new Date(post.createdAt || post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="opacity-30">/</span>
                                                <span className="hover:text-primary cursor-pointer uppercase">BY {post.author_name || 'ADMIN'}</span>
                                                <span className="opacity-30">/</span>
                                                <span className="hover:text-primary cursor-pointer uppercase">{post.category || 'BLOG'}</span>
                                            </div>
                                            <p className="text-[15px] leading-[1.9] text-[#787878] font-medium mb-10">
                                                {post.excerpt || (post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content)}
                                            </p>
                                            <Link to={`/blog/${post.slug}`} className="inline-block bg-[#56c0e0] hover:bg-heading text-white px-8 py-3.5 rounded-sm font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300">
                                                Read More
                                            </Link>
                                        </div>
                                    </article>
                                ))}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-2 mt-4 mb-20 font-bold font-heading text-sm">
                                        {/* Prev Button */}
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-100 ${
                                                currentPage === 1 
                                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                                                : 'bg-white text-heading hover:bg-[#56c0e0] hover:text-white cursor-pointer'
                                            }`}
                                        >
                                            ‹
                                        </button>

                                        {/* Page Numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                            <button
                                                key={number}
                                                onClick={() => paginate(number)}
                                                className={`w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-100 ${
                                                    currentPage === number
                                                        ? 'bg-[#56c0e0] text-white'
                                                        : 'bg-white text-heading hover:bg-[#56c0e0] hover:text-white cursor-pointer'
                                                }`}
                                            >
                                                {number}
                                            </button>
                                        ))}

                                        {/* Next Button */}
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`w-10 h-10 flex items-center justify-center transition-all duration-300 border border-gray-100 ${
                                                currentPage === totalPages
                                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                : 'bg-white text-heading hover:bg-[#56c0e0] hover:text-white cursor-pointer'
                                            }`}
                                        >
                                            ›
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white p-20 text-center rounded-sm shadow-sm">
                                <h3 className="text-2xl font-bold text-gray-400">No blog posts found.</h3>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-6">

                        {/* Tag Cloud Widget */}
                        <div className="bg-[#f2f2f2] p-4 border-t-[3px] border-secondary/10">
                            <h3 className="text-sm font-bold text-heading font-heading mb-6 tracking-wide uppercase">Categories</h3>
                            <div className="w-full h-[1px] bg-heading/10 mb-2"></div>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(new Set(posts.map(p => p.category).filter(Boolean))).map(cat => (
                                    <span key={cat} className="bg-secondary text-white text-[10px] font-bold px-3 py-2 rounded-sm cursor-pointer hover:bg-heading transition-all duration-300 tracking-tighter">
                                        {cat.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {/* Recent News Widget */}
                        <div className="bg-[#f2f2f2] p-8 border-t-[3px] border-secondary/10">
                            <h3 className="text-sm font-bold text-heading font-heading mb-6 tracking-wide uppercase">Recent News</h3>
                            <div className="w-full h-[1px] bg-heading/10 mb-8"></div>
                            <div className="space-y-8">
                                {posts.slice(0, 3).map((post) => (
                                    <Link to={`/blog/${post.slug}`} key={post.id} className="flex gap-4 group cursor-pointer">
                                        <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-sm overflow-hidden">
                                            <img src={getImageUrl(post.image_url) || 'https://via.placeholder.com/100'} alt="news" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-[14px] font-bold text-heading leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h4>
                                            <div className="text-[11px] font-bold text-[#b5b5b5] mt-2 uppercase flex gap-2">
                                                {new Date(post.createdAt).toLocaleDateString()} <span className="opacity-30">/</span> BY {post.author_name || 'ADMIN'}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>



                    </aside>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Blog;
