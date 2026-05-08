import React from 'react';
import { getImageUrl } from '../../utils/imageUtils';

const PageHero = ({ title, subtitle, backgroundImage, fallbackImage }) => {
    const finalImage = backgroundImage ? getImageUrl(backgroundImage) : fallbackImage || "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";

    return (
        <section className="relative h-[250px] flex items-center text-white overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 hover:scale-105"
                style={{ backgroundImage: `url('${finalImage}')` }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
            </div>
            <div className="container mx-auto px-5 relative z-10 max-w-[1180px] text-center">
                {subtitle && (
                    <span className="text-white text-sm md:text-base font-bold mb-3 block uppercase tracking-[0.2em] animate-fadeInDown">
                        {subtitle}
                    </span>
                )}
                <h1 className="text-4xl md:text-[3.5rem] font-bold font-heading leading-tight drop-shadow-2xl animate-heroText italic">
                    {title}
                </h1>
            </div>
        </section>
    );
};

export default PageHero;
