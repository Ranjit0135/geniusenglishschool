import { useRef, useEffect, useState } from 'react';
import { Facebook, Instagram, Volume2, VolumeX } from 'lucide-react';
import api, { getImageUrl } from '../api';

const Hero = () => {
    const videoRef = useRef(null);
    const [heroData, setHeroData] = useState({
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-children-playing-and-learning-with-clay-in-a-pottery-class-42617-large.mp4",
        title: "",
        subtitle: "",
        isMuted: true
    });
    const [isMuted, setIsMuted] = useState(true);

    const socials = [
        { icon: Facebook, bg: '#1877F2', link: '#', label: 'FB' },
        { icon: Instagram, bg: 'linear-gradient(to tr, #FFB344, #E11D48, #9333EA)', link: '#', label: 'IG' }
    ];

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const response = await api.get('/hero');
                if (response.data) {
                    setHeroData({
                        videoUrl: response.data.videoUrl || heroData.videoUrl,
                        posterUrl: response.data.imageUrl || heroData.posterUrl,
                        title: response.data.title || "",
                        subtitle: response.data.subtitle || "",
                        isMuted: response.data.isMuted ?? true
                    });
                    setIsMuted(response.data.isMuted ?? true);
                }
            } catch (error) {
                console.error('Failed to fetch hero content:', error);
            }
        };
        fetchHero();
    }, []);

    const getVideoType = (url) => {
        if (!url) return 'none';
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
        if (url.includes('vimeo.com')) return 'vimeo';
        return 'direct';
    };

    const getYouTubeEmbedUrl = (url, muted) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        const muteParam = muted ? '1' : '0';
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=${muteParam}&controls=0&loop=1&playlist=${match[2]}&background=1&enablejsapi=1` : null;
    };

    const videoType = getVideoType(heroData.videoUrl);

    useEffect(() => {
        if (videoRef.current && videoType === 'direct') {
            videoRef.current.muted = isMuted;
            videoRef.current.load();
            videoRef.current.play().catch(error => {
                console.log("Autoplay prevented:", error);
            });
        }
    }, [heroData.videoUrl, videoType, isMuted]);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <div className="relative w-full h-[65vh] md:h-[80vh] min-h-[500px] overflow-hidden bg-[#111]">
            {/* Background Media */}
            {videoType === 'youtube' ? (
                <div className="absolute inset-0 pointer-events-none scale-110">
                    <iframe
                        src={getYouTubeEmbedUrl(heroData.videoUrl, isMuted)}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    poster={heroData.posterUrl}
                    key={heroData.videoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
                >
                    <source src={heroData.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            {/* Mute/Unmute Toggle Button */}
            <button
                onClick={toggleMute}
                className="absolute bottom-10 right-10 z-30 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all active:scale-90 group shadow-2xl"
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? (
                    <VolumeX size={24} className="group-hover:scale-110 transition-transform" />
                ) : (
                    <Volume2 size={24} className="group-hover:scale-110 transition-transform" />
                )}
            </button>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>

            {/* Hero Content */}
            {/* <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tight drop-shadow-2xl max-w-5xl">
                    {heroData.title || "Experience Excellence in Education"}
                </h1>
                <p className="text-lg md:text-2xl text-white/90 font-medium max-w-3xl mb-10 drop-shadow-lg">
                    {heroData.subtitle || "Fostering academic brilliance and holistic development since 2000."}
                </p>
                <div className="flex gap-4">
                    <button className="bg-[#ff9d01] text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-[#e68d00] transition-colors shadow-xl">
                        Explore More
                    </button>
                </div>
            </div> */}

            {/* Floating Social Icons - Left */}
            <div className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-[1px] z-[2000]">
                {socials.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.link}
                        className="w-10 h-10 flex items-center justify-center text-white transition-all duration-300 rounded-r hover:w-12 shadow-lg"
                        style={{ background: item.bg }}
                        title={item.label}
                    >
                        <item.icon size={18} strokeWidth={2.5} />
                    </a>
                ))}
            </div>


        </div>
    );
};

export default Hero;
