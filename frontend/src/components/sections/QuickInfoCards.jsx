import React from 'react';
import { Link } from 'react-router-dom';

const QuickInfoCards = () => {


    return (
        <section className="relative -mt-[100px] z-20 mb-20 px-5">
            <div className="container mx-auto max-w-[1180px]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
                    {[
                        {
                            title: 'Pre Kindergarten',
                            description: 'Counting objects, inside and outside, longer and shorter, letter names, rhyming words, and more.',
                            image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972&auto=format&fit=crop',
                            btnColor: 'bg-primary',
                            borderColor: 'border-primary',
                            titleColor: 'text-primary'
                        },
                        {
                            title: 'Kindergarten',
                            description: 'Counting objects, inside and outside, longer and shorter, letter names, rhyming words, and more.',
                            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop',
                            btnColor: 'bg-secondary',
                            borderColor: 'border-secondary',
                            titleColor: 'text-secondary'
                        },
                        {
                            title: 'Elementary',
                            description: 'Counting objects, inside and outside, longer and shorter, letter names, rhyming words, and more.',
                            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop',
                            btnColor: 'bg-accent',
                            borderColor: 'border-accent',
                            titleColor: 'text-accent'
                        }
                    ].map((card, index) => (
                        <div key={index} className="bg-white group overflow-hidden flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl rounded-md">
                            {/* Card Image */}
                            <div className="w-full h-[200px] overflow-hidden">
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Card Content */}
                            <div className={`w-full p-4 pb-5 border-b-4 ${card.borderColor}`}>
                                <h3 className={`text-xl font-bold mb-2 font-heading ${card.titleColor}`}>
                                    {card.title}
                                </h3>
                                <p className="text-[0.85rem] text-gray-500 mb-4 leading-relaxed px-2">
                                    {card.description}
                                </p>
                                <Link
                                    to="/courses"
                                    className={`${card.btnColor} text-white py-1.5 px-6 rounded-md font-bold text-sm uppercase tracking-wide inline-flex items-center gap-2 hover:brightness-90 transition-all shadow-md`}
                                >
                                    Learn More <span className="text-xl">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickInfoCards;
