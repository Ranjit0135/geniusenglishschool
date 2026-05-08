import { useState, useEffect } from 'react';
import api from '../api';
import { Save, Video, Image as ImageIcon, Type, Subtitles, Loader2, Upload, Link as LinkIcon, Volume2, VolumeX, Layout, Sparkles } from 'lucide-react';

const ManageHero = () => {
    const [hero, setHero] = useState({
        videoUrl: '',
        imageUrl: '',
        title: '',
        subtitle: '',
        isMuted: true
    });
    const [files, setFiles] = useState({
        video: null,
        image: null
    });
    const [previews, setPreviews] = useState({
        video: null,
        image: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const response = await api.get('/hero');
                if (response.data) {
                    setHero(prev => ({
                        ...prev,
                        ...response.data,
                        isMuted: response.data.isMuted ?? true
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch hero:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHero();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setHero(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFiles(prev => ({ ...prev, [e.target.name]: file }));

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviews(prev => ({ ...prev, [e.target.name]: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const getVideoType = (url) => {
        if (!url) return 'none';
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
        if (url.includes('vimeo.com')) return 'vimeo';
        return 'direct';
    };

    const getYouTubeEmbedUrl = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${match[2]}` : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('title', hero.title || '');
        formData.append('subtitle', hero.subtitle || '');
        formData.append('videoUrl', hero.videoUrl || '');
        formData.append('imageUrl', hero.imageUrl || '');
        formData.append('isMuted', hero.isMuted);

        if (files.video) formData.append('video', files.video);
        if (files.image) formData.append('image', files.image);

        try {
            await api.patch('/hero', formData);
            setMessage({ type: 'success', text: 'Hero content updated successfully!' });
            setFiles({ video: null, image: null });
            setPreviews({ video: null, image: null });
            const response = await api.get('/hero');
            if (response.data) setHero(prev => ({ ...prev, ...response.data }));
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Update failed:', error);
            setMessage({ type: 'error', text: 'Failed to update hero content.' });
        } finally {
            setIsSaving(false);
        }
    };

    const videoType = getVideoType(hero.videoUrl);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Content...</span>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700 font-base">
            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-primary tracking-tight uppercase italic underline decoration-primary/20 underline-offset-8 flex items-center gap-3">
                            <Layout size={28} className="text-accent" />
                            Hero Section
                        </h1>
                        <p className="text-gray-500 mt-3 font-bold text-sm tracking-wide">Customize the first impression of your school's website.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full md:w-auto bg-primary hover:bg-[#e68d00] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-orange-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? 'Processing Changes...' : 'Synchronize Hero'}
                    </button>
                </div>

                {message.text && (
                    <div className={`p-6 rounded-2xl font-bold text-[13px] uppercase tracking-widest border-l-4 shadow-sm animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-500' : 'bg-rose-50 text-rose-700 border-rose-500'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {/* Background Media */}
                    <div className="bg-white p-10 rounded-md shadow-premium border border-gray-100 space-y-10 relative overflow-hidden flex flex-col justify-between">
                        <div className="space-y-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 flex items-center gap-4">
                                <span className="p-2 bg-primary/5 rounded-lg"><Video size={16} className="text-primary" /></span>
                                Background Media Signal
                            </h3>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Video Resource (URL)</label>
                                    <div className="space-y-4">
                                        <div className="relative group/input">
                                            <LinkIcon size={18} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                            <input
                                                name="videoUrl"
                                                value={hero.videoUrl || ''}
                                                onChange={handleChange}
                                                className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-primary placeholder:text-gray-200 transition-all outline-none"
                                                placeholder="YouTube Link or MP4 URL"
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 px-2">
                                            <div className="h-[1px] flex-1 bg-gray-100"></div>
                                            <span className="text-[9px] font-black uppercase text-gray-300 tracking-tighter italic">OR DIRECT ARCHIVE</span>
                                            <div className="h-[1px] flex-1 bg-gray-100"></div>
                                        </div>

                                        <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer hover:border-primary/30 hover:bg-gray-50 transition-all group/upload">
                                            <Upload size={18} className="text-gray-400 group-hover/upload:text-primary transition-colors" />
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover/upload:text-primary">
                                                {files.video ? files.video.name : 'Select MP4 Video File'}
                                            </span>
                                            <input type="file" name="video" accept="video/*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div className="p-8 bg-[#f8f9fb] rounded-2xl border border-gray-100 flex items-center justify-between group/audio transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-xl transition-all ${hero.isMuted ? 'bg-white text-gray-300 border border-gray-100' : 'bg-primary text-white shadow-xl shadow-orange-100 scale-105'}`}>
                                            {hero.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#001c3d]">Audio Control</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase italic">{hero.isMuted ? 'Muted Playback' : 'Sound Active'}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer scale-110">
                                        <input
                                            type="checkbox"
                                            name="isMuted"
                                            checked={hero.isMuted}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                    </label>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Fallback Visual (Poster Image)</label>
                                    <div className="space-y-4">
                                        <div className="relative group/input">
                                            <ImageIcon size={18} className="text-gray-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/input:text-primary transition-colors" />
                                            <input
                                                name="imageUrl"
                                                value={hero.imageUrl || ''}
                                                onChange={handleChange}
                                                className="w-full pl-16 pr-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-primary placeholder:text-gray-200 transition-all outline-none"
                                                placeholder="Poster Image URL"
                                            />
                                        </div>

                                        <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-100 rounded-2xl cursor-pointer hover:border-primary/30 hover:bg-gray-50 transition-all group/upload">
                                            <Upload size={18} className="text-gray-400 group-hover/upload:text-primary transition-colors" />
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover/upload:text-primary">
                                                {files.image ? files.image.name : 'Select Poster Image'}
                                            </span>
                                            <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Live Preview */}
                            <div className="mt-12 pt-10 border-t border-gray-50">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 block ml-1 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-200"></div> System Monitor
                                </label>
                                <div className="relative aspect-video rounded-md overflow-hidden bg-[#001c3d] shadow-premium">
                                    {videoType === 'youtube' && getYouTubeEmbedUrl(hero.videoUrl) ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(hero.videoUrl)}
                                            className="w-full h-full pointer-events-none scale-105"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        ></iframe>
                                    ) : (previews.video || hero.videoUrl) ? (
                                        <video
                                            key={previews.video || hero.videoUrl}
                                            autoPlay
                                            loop
                                            muted={hero.isMuted}
                                            className="w-full h-full object-cover"
                                            poster={previews.image || hero.imageUrl}
                                        >
                                            <source src={previews.video || hero.videoUrl} type="video/mp4" />
                                        </video>
                                    ) : (previews.image || hero.imageUrl) ? (
                                        <img src={previews.image || hero.imageUrl} className="w-full h-full object-cover" alt="Hero Preview" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 gap-4">
                                            <Video size={48} className="opacity-20 animate-bounce" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Ready for media</span>
                                        </div>
                                    )}
                                    <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md rounded-lg px-5 py-2 text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/10 shadow-xl">
                                        {videoType === 'youtube' ? 'YouTube Feed' : 'Direct Signal'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Overlay */}
                    <div className="bg-white p-10 rounded-md shadow-premium border border-gray-100 space-y-10 relative overflow-hidden flex flex-col">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 flex items-center gap-4">
                            <span className="p-2 bg-primary/5 rounded-lg"><Type size={16} className="text-primary" /></span>
                            Typography Overlay
                        </h3>

                        <div className="space-y-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Main Narrative Theme (Title)</label>
                                <div className="relative group/input">
                                    <Type size={18} className="text-gray-300 absolute left-6 top-6 group-focus-within/input:text-primary transition-colors" />
                                    <textarea
                                        name="title"
                                        value={hero.title || ''}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full pl-16 pr-8 py-6 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-black text-3xl text-primary placeholder:text-gray-200 outline-none transition-all resize-none leading-tight tracking-tight italic"
                                        placeholder="Experience Excellence..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Supportive Message (Subtitle)</label>
                                <div className="relative group/input">
                                    <Subtitles size={18} className="text-gray-300 absolute left-6 top-6 group-focus-within/input:text-primary transition-colors" />
                                    <textarea
                                        name="subtitle"
                                        value={hero.subtitle || ''}
                                        onChange={handleChange}
                                        rows="6"
                                        className="w-full pl-16 pr-8 py-6 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-bold text-lg text-gray-600 placeholder:text-gray-200 outline-none transition-all resize-none leading-relaxed"
                                        placeholder="Fostering academic brilliance..."
                                    />
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="mt-auto p-10 bg-primary/5 rounded-md border border-primary/10 relative overflow-hidden group/tip">
                                <div className="relative z-10">
                                    <h4 className="text-primary font-black text-[11px] uppercase tracking-widest mb-3 flex items-center gap-2 italic">
                                        <Sparkles size={16} className="text-accent animate-pulse" /> Publishing Guideline
                                    </h4>
                                    <p className="text-gray-500 text-[13px] font-bold leading-relaxed italic">
                                        "Keep titles within 8-10 words for maximum visual clarity. A short, high-impact heading paired with a descriptive subtitle creates the strongest first impression for modern academic portals."
                                    </p>
                                </div>
                                <div className="absolute -bottom-12 -right-12 text-primary opacity-[0.03] rotate-12 group-hover/tip:scale-110 transition-transform duration-1000">
                                    <Layout size={200} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ManageHero;
