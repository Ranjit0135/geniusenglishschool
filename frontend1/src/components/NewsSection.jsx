import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api';

const NewsSection = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get('/news');
                if (Array.isArray(response.data)) {
                    // Regular news items
                    setNewsItems(response.data.filter(item => !item.isAnnouncement).slice(0, 3).map(item => ({
                        title: item.title,
                        link: `/news/${item.slug}`,
                        image: getImageUrl(item.imageUrl),
                        btn: item.buttonText || "Read More"
                    })));

                    // Announcement (latest one marked as announcement)
                    const latestAnnouncement = response.data.find(item => item.isAnnouncement);
                    if (latestAnnouncement) {
                        setAnnouncementData({
                            title: latestAnnouncement.category || "Recent Announcement",
                            subtitle: latestAnnouncement.title,
                            image: getImageUrl(latestAnnouncement.imageUrl),
                            btn: latestAnnouncement.buttonText || "Apply Now",
                            link: `/news/${latestAnnouncement.slug}`
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch news:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    const [announcementData, setAnnouncementData] = useState({
        title: "Recent Announcement",
        subtitle: "Admission Open for 2024-25",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
        btn: "Apply Now",
        link: "/news-events"
    });

    const news = {
        seeAllLink: "/news-events",
        items: newsItems.length > 0 ? newsItems : [
            { title: "Annual Sports Day", link: "#", image: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?q=80&w=800&auto=format&fit=crop", btn: "Read More" },
            { title: "Science Exhibition", link: "#", image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop", btn: "Read More" }
        ]
    };

    const announcement = {
        title: announcementData.title,
        subtitle: announcementData.subtitle,
        image: announcementData.image,
        btn: announcementData.btn,
        seeAllLink: announcementData.link
    };

    if (isLoading) return <div className="py-24 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading Updates...</div>;

    return (
        <section id="news" className="py-24 px-4 bg-white border-t border-gray-100">
            <div className="container mx-auto max-w-[1140px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* News Column */}
                    <div>
                        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-2">
                            <h2 className="text-2xl font-bold text-[#192f59]">News & Events</h2>
                            <a href="/news-events" className="text-[13px] font-bold text-[#ff9d01]">See all</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {news.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="bg-[#f8f9fa] flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-300">
                                    <div className="overflow-hidden aspect-[4/3]">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow items-start">
                                        <h3 className="text-[13px] font-bold text-[#192f59] mb-4 uppercase tracking-wider line-clamp-2">{item.title}</h3>
                                        <a href={item.link} className="btn-small mt-auto">{item.btn}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Announcements Column */}
                    <div>
                        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-2">
                            <h2 className="text-2xl font-bold text-[#192f59]">{announcement.title}</h2>
                            <a href={announcement.seeAllLink} className="text-[13px] font-bold text-[#ff9d01]">See all</a>
                        </div>
                        <div className="bg-[#f8f9fa] p-6 shadow-sm">
                            <div className="mb-6 overflow-hidden">
                                <img
                                    src={announcement.image}
                                    alt="Announcement"
                                    className="w-full aspect-video object-cover"
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px] mb-6">{announcement.subtitle}</p>
                                <a href="#" className="btn-outline px-6 py-2 text-xs">{announcement.btn}</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default NewsSection;
