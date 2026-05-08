import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../api';
import { STATIC_POSTS } from '../data/blogData';
import { getImageUrl } from '../utils/imageUtils';

const BlogDetails = () => {
    const { slug } = useParams();
    console.log(slug, "blogslug");
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchPost = async () => {
        setIsLoading(true);

        // 1. Check static data first
        const staticItem = STATIC_POSTS.find(item => item.slug === slug);
        if (staticItem) {
            setPost(staticItem);
            setIsLoading(false);
            return;
        }

        // 2. Try API if not in static
        try {
            const response = await api.get(`/blogs/${slug}`);
            if (response.data) {
                setPost(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch post details from API:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#f5f5f5]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-[#f5f5f5]">
                <InfoBar />
                <Navbar />
                <div className="py-20 text-center">
                    <h1 className="text-4xl font-bold font-heading text-heading">Post Not Found</h1>
                </div>
                <Footer />
            </div>
        );
    }

    const postDate = new Date(post.createdAt);

    return (
        <div className="blog-details-page font-base text-[#666] bg-[#f5f5f5] min-h-screen">
            <InfoBar />
            <Navbar />

            <main className="container mx-auto px-4 py-16 md:py-24 max-w-[1000px] animate-fadeIn">
                {/* Main Content Card */}
                <article className="bg-white rounded-sm shadow-md overflow-hidden">
                    {/* Hero Image Section */}
                    {post.image_url && (
                        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
                            <img
                                src={getImageUrl(post.image_url)}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Category Badge */}
                            <div className="absolute top-8 left-8">
                                <span className="bg-secondary text-white px-6 py-2 rounded-sm font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg">
                                    {post.category || 'School News'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="p-8 md:p-16 lg:p-20">
                        {/* Header Info */}
                        <div className="mb-12">
                            <div className="flex items-center gap-4 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                                <span>{postDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
                                <span>By {post.author_name || 'Admin'}</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-heading font-heading leading-tight italic tracking-tighter">
                                {post.title}
                            </h1>
                        </div>

                        {/* Primary Content Block */}
                        <div className="text-[17px] md:text-[19px] leading-[1.8] text-text-main/80 font-medium whitespace-pre-wrap mb-16">
                            {post.content}
                        </div>

                        {/* Sub Content Sections (Editorial Style) */}
                        {(post.sub_heading || post.sub_content) && (
                            <div className="mt-16 pt-16 border-t border-gray-100 space-y-8">
                                {post.sub_heading && (
                                    <h2 className="text-2xl md:text-3xl font-bold font-heading text-heading italic tracking-tight">
                                        {post.sub_heading}
                                    </h2>
                                )}

                                {post.sub_image_url && (
                                    <div className="relative rounded-sm overflow-hidden shadow-md group">
                                        <img
                                            src={getImageUrl(post.sub_image_url)}
                                            alt="Section Detail"
                                            className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                )}

                                {post.sub_content && (
                                    <div className="text-[17px] md:text-[19px] leading-[1.8] text-text-main/80 font-medium whitespace-pre-wrap">
                                        {post.sub_content}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Additional Sections (Iterative Blocks) */}
                        {/* {post.additional_sections && post.additional_sections.map((section, index) => (
                            <div key={index} className="mt-16 pt-16 border-t border-gray-100 space-y-8">
                                {section.heading && (
                                    <h2 className="text-2xl md:text-3xl font-bold font-heading text-heading italic tracking-tight">
                                        {section.heading}
                                    </h2>
                                )}

                                {section.image_url && (
                                    <div className="relative rounded-sm overflow-hidden shadow-md group">
                                        <img
                                            src={getImageUrl(section.image_url)}
                                            alt={section.heading || 'Section Detail'}
                                            className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                )}

                                {section.content && (
                                    <div className="text-[17px] md:text-[19px] leading-[1.8] text-text-main/80 font-medium whitespace-pre-wrap">
                                        {section.content}
                                    </div>
                                )}
                            </div>
                        ))} */}
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetails;
