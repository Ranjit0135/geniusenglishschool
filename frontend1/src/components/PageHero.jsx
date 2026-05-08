import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PageHero = ({ title, backgroundImage, breadcrumbs = [] }) => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative h-[250px] md:h-[400px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[2000ms] hover:scale-110"
                    style={{
                        backgroundImage: `url('${backgroundImage || 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1920&auto=format&fit=crop'}')`,
                        backgroundColor: '#192f59'
                    }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-[3.8rem] font-bold font-['Quicksand'] italic drop-shadow-2xl tracking-tight leading-tight transition-all duration-700">
                        {title}
                    </h1>
                </div>
            </section>

            {/* Breadcrumbs Section */}
            <div className="bg-white border-b border-gray-100 py-4 shadow-sm relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#192f59]">
                        <Link to="/" className="text-gray-400 hover:text-[#ff9d01] transition-all duration-300">Home</Link>
                        <ChevronRight size={12} className="text-gray-300" />
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                {crumb.path ? (
                                    <>
                                        <Link to={crumb.path} className="text-gray-400 hover:text-[#ff9d01] transition-all duration-300">{crumb.label}</Link>
                                        <ChevronRight size={12} className="text-gray-300" />
                                    </>
                                ) : (
                                    <span className="text-[#192f59]">{crumb.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHero;
