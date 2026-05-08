import React, { useState, useEffect } from 'react';
import api from '../../api';
import { getImageUrl } from '../../utils/imageUtils';
import { Plus } from 'lucide-react';

const STATIC_TESTIMONIALS = [
    {
        id: 's1',
        content: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.",
        author_name: "Sarah Newman",
        author_role: "Parent of 3rd Grade Student",
        image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
        id: 's2',
        content: "The dedication of the teachers here is unmatched. My son has shown incredible progress in both academics and his personal confidence. We couldn't be happier with our choice of school.",
        author_name: "Michael Chen",
        author_role: "Parent of 5th Grade Student",
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    }
];

const TestimonialsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testimonials, setTestimonials] = useState(STATIC_TESTIMONIALS);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.get('/public/testimonials');
                // Only show published testimonials
                const published = response.data.filter(t => t.is_published);
                if (published.length > 0) {
                    setTestimonials(published);
                }
            } catch (error) {
                console.error('Failed to fetch testimonials, using fallbacks');
            }
        };
        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (testimonials.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials]);

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    if (testimonials.length === 0) return null;

    return (
        <section className="relative py-10 bg-secondary text-white text-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                    alt="Happy kids background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-secondary/90 mix-blend-multiply"></div>
            </div>

            <div className="container mx-auto px-5 relative z-10 max-w-[800px]">
                <h3 className="text-xl font-heading mb-2 uppercase opacity-80">Testimonial</h3>
                <h2 className="text-2xl md:text-4xl font-bold font-heading mb-12">What Parents Say</h2>

                <div className="testimonial-card min-h-[300px] flex flex-col justify-center">
                    <div className="animate-fadeIn transition-opacity duration-500">
                        <p className="text-lg md:text-xl italic leading-relaxed mb-8 opacity-90 mx-auto max-w-[700px]">
                            "{testimonials[currentIndex]?.content}"
                        </p>

                        <div className="flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-white shadow-lg">
                                <img
                                    src={getImageUrl(testimonials[currentIndex]?.image_url)}
                                    alt={testimonials[currentIndex]?.author_name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h4 className="font-bold text-xl font-heading">{testimonials[currentIndex]?.author_name}</h4>
                            <span className="text-sm uppercase opacity-75 tracking-wider">{testimonials[currentIndex]?.author_role}</span>
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex flex-col items-center gap-8 mt-12">
                        <div className="flex gap-3 justify-center">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/10 w-full max-w-[200px]">
                            <a
                                href="/submit-testimonial"
                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                            >
                                <span className="w-8 h-[1px] bg-white/20"></span>
                                Submit Your Own
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-1/2 left-5 md:left-20 text-4xl opacity-20 hidden md:block select-none">❝</div>
            <div className="absolute top-1/2 right-5 md:right-20 text-4xl opacity-20 hidden md:block select-none">❞</div>
        </section>
    );
};

export default TestimonialsSection;
