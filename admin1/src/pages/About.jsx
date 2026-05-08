import { useState, useEffect } from 'react';
import api from '../api';
import { Save, FileText, Target, Plus, Trash2, Loader2, Sparkles, PencilLine } from 'lucide-react';

const About = () => {
    const [about, setAbout] = useState({
        title: '',
        content: '',
        mission: '',
        vision: '',
        objectives: []
    });
    const [newObjective, setNewObjective] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://localhost:5001/uploads/${path}`;
    };

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await api.get('/about');
                if (response.data) {
                    let objectivesData = response.data.objectives;
                    
                    // Handle case where objectives might be a string from the API
                    if (typeof objectivesData === 'string') {
                        try {
                            objectivesData = JSON.parse(objectivesData);
                        } catch (e) {
                            console.error('Failed to parse objectives JSON:', e);
                            objectivesData = [];
                        }
                    }
                    
                    // Final safety check to ensure it's an array
                    if (!Array.isArray(objectivesData)) {
                        objectivesData = [];
                    }

                    setAbout({
                        title: response.data.title || '',
                        content: response.data.content || '',
                        mission: response.data.mission || '',
                        vision: response.data.vision || '',
                        objectives: objectivesData
                    });
                    if (response.data.imageUrl) {
                        setImagePreview(getImageUrl(response.data.imageUrl));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch about content:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAbout();
    }, []);

    const handleChange = (e) => {
        setAbout({ ...about, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const addObjective = () => {
        if (!newObjective.trim()) return;
        setAbout({
            ...about,
            objectives: [...about.objectives, newObjective.trim()]
        });
        setNewObjective('');
    };

    const removeObjective = (index) => {
        const updatedObjectives = about.objectives.filter((_, i) => i !== index);
        setAbout({ ...about, objectives: updatedObjectives });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const formData = new FormData();
            formData.append('title', about.title || '');
            formData.append('content', about.content || '');
            formData.append('mission', about.mission || '');
            formData.append('vision', about.vision || '');
            formData.append('objectives', JSON.stringify(about.objectives || []));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await api.patch('/about', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage({ type: 'success', text: 'Institutional profile updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update about content.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Profile Data...</span>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50/30 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700 font-base">
            <div className="mb-12">
                <h1 className="text-2xl font-black text-primary tracking-tight uppercase italic underline decoration-primary/20 underline-offset-8">Institutional Profile</h1>
                <p className="text-gray-500 mt-3 font-bold text-sm tracking-wide">Define your school's vision, history, and core academic objectives.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Content */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Main Story */}
                    <div className="bg-white p-10 rounded-md shadow-premium border border-gray-100 space-y-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Hero Title</label>
                            <input
                                name="title"
                                value={about.title || ''}
                                onChange={handleChange}
                                placeholder="Our Educational Journey"
                                className="w-full px-8 py-5 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-black text-2xl text-primary outline-none transition-all italic tracking-tight"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Institutional Narrative</label>
                            <textarea
                                name="content"
                                value={about.content || ''}
                                onChange={handleChange}
                                rows="8"
                                className="w-full px-8 py-8 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-medium text-heading leading-relaxed outline-none transition-all resize-none font-base"
                                placeholder="Write your school's story here..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mission</label>
                                <textarea
                                    name="mission"
                                    value={about.mission || ''}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-6 py-6 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-medium text-heading leading-relaxed outline-none transition-all resize-none font-base"
                                    placeholder="Our mission..."
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Vision</label>
                                <textarea
                                    name="vision"
                                    value={about.vision || ''}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-6 py-6 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl font-medium text-heading leading-relaxed outline-none transition-all resize-none font-base"
                                    placeholder="Our vision..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Objectives */}
                    <div className="bg-white p-10 rounded-md shadow-premium border border-gray-100 space-y-8">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-3">
                                <Target size={16} className="text-accent" />
                                Academic Objectives
                            </h3>

                            <div className="flex flex-col md:flex-row gap-4 mb-8">
                                <input
                                    value={newObjective}
                                    onChange={(e) => setNewObjective(e.target.value)}
                                    placeholder="Add a new institutional goal..."
                                    className="flex-1 px-6 py-4 bg-[#f8f9fb] border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-xl font-bold text-gray-700 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={addObjective}
                                    className="bg-primary text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#e68d00] transition-all active:scale-95 shadow-lg shadow-orange-100"
                                >
                                    Add Goal
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(Array.isArray(about.objectives) ? about.objectives : []).map((obj, index) => (
                                    <div key={index} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:bg-white hover:border-primary/20 transition-all duration-300">
                                        <p className="text-gray-600 font-bold text-[14px] leading-relaxed mb-4">{obj}</p>
                                        <button
                                            type="button"
                                            onClick={() => removeObjective(index)}
                                            className="flex items-center gap-2 text-rose-500 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={12} /> Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Media */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Media Card */}
                    <div className="bg-white p-8 rounded-md shadow-premium border border-gray-100 space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Profile Featured Image</label>
                        <div className="relative group aspect-[4/3] bg-[#f8f9fb] rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all hover:border-primary/30 cursor-pointer">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="text-center text-gray-300">
                                    <Sparkles size={48} className="mx-auto mb-3 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Identify Visual</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-primary/80 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center gap-2">
                                <PencilLine size={14} className="text-white" />
                                <span className="text-white font-black text-[10px] uppercase tracking-widest">Change Image</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-white p-8 rounded-md shadow-premium border border-gray-100 space-y-6">
                        {message.text && (
                            <div className={`p-4 rounded-xl text-[11px] font-black uppercase tracking-widest animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {message.text}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-primary hover:bg-[#e68d00] text-white py-5 rounded-2xl flex items-center justify-center gap-4 font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSaving ? 'Syncing...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default About;
