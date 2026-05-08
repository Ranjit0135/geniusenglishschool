import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import InfoBar from '../components/common/InfoBar';
import Footer from '../components/common/Footer';
import api from '../api';
import { Star, Upload, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const SubmitTestimonial = () => {
    const [formData, setFormData] = useState({
        author_name: '',
        author_role: 'Parent',
        content: '',
        rating: 5
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleRatingChange = (newRating) => {
        setFormData({ ...formData, rating: newRating });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const data = new FormData();
        data.append('author_name', formData.author_name);
        data.append('author_role', formData.author_role);
        data.append('content', formData.content);
        data.append('rating', formData.rating);
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            await api.post('/public/testimonials/submit', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Submission failed:', err);
            setError('Failed to submit testimonial. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <InfoBar />
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-5 py-20">
                <div className="w-full max-w-2xl bg-white rounded-md shadow-2xl overflow-hidden animate-fadeIn">
                    {isSuccess ? (
                        <div className="p-12 text-center space-y-8">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                                <CheckCircle2 size={64} />
                            </div>
                            <h2 className="text-4xl font-black text-heading font-heading tracking-tight italic">
                                Thank You!
                            </h2>
                            <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                Your testimonial has been submitted successfully and will be visible on our website shortly. We appreciate your feedback!
                            </p>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-primary text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
                            >
                                Back to Home
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-[#001c3d] p-4 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h1 className="text-2xl md:text-3xl font-black font-heading tracking-tight italic mb-2">
                                        Share Your Experience
                                    </h1>
                                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                        Help us share the genius journey with other parents
                                    </p>
                                </div>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 font-bold text-sm animate-shake">
                                        <AlertCircle size={20} />
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.author_name}
                                            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-bold text-[#001c3d] transition-all"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Role</label>
                                        <input
                                            type="text"
                                            value={formData.author_role}
                                            onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-bold text-gray-600 transition-all"
                                            placeholder="e.g. Parent of Grade 5 Student"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleRatingChange(star)}
                                                className={`p-2 transition-all ${formData.rating >= star ? 'text-primary scale-110' : 'text-gray-200 hover:text-primary/40'}`}
                                            >
                                                <Star size={32} fill={formData.rating >= star ? "currentColor" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Testimonial</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl outline-none font-medium text-gray-600 text-lg leading-relaxed transition-all italic"
                                        placeholder="Tell us what you like about the school..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Upload size={14} className="text-primary" /> Profile Photo
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md relative group">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <Upload size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <label className="inline-block bg-[#001c3d] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-primary transition-colors shadow-lg shadow-blue-900/10">
                                                Select Image
                                                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-white py-3 rounded-md flex items-center justify-center gap-4 font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                Submit Testimonial
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SubmitTestimonial;
