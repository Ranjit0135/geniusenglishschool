import React from 'react';
import { Link } from 'react-router-dom';

const ClassesSection = () => {
    const classes = [
        {
            image: 'https://images.unsplash.com/photo-1560785477-d43d2b34e0df?w=400&h=280&fit=crop',
            title: 'Art Program for Kids',
            teacher: 'Teacher: Sarah Johnson',
            grade: 'Grade: 1-3',
            color: 'var(--secondary)',
            colorClass: 'text-secondary',
            bgClass: 'bg-secondary'
        },
        {
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=280&fit=crop',
            title: 'Languages',
            teacher: 'Teacher: Maria Garcia',
            grade: 'Grade: 1-5',
            color: 'var(--primary)',
            colorClass: 'text-primary',
            bgClass: 'bg-primary'
        },
        {
            image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=280&fit=crop',
            title: 'Music Programs',
            teacher: 'Teacher: David Miller',
            grade: 'Grade: K-5',
            color: 'var(--accent)',
            colorClass: 'text-accent',
            bgClass: 'bg-accent'
        }
    ];

    return (
        <section className="py-[100px] bg-white relative overflow-hidden">
            {/* Decorative Rainbow - Left */}
            <div className="absolute left-[5%] top-[40%] w-[150px] opacity-80 hidden md:block">
                <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 130 Q20 50 100 50 Q180 50 180 130" fill="none" stroke="var(--secondary)" strokeWidth="12" strokeLinecap="round" />
                    <path d="M35 130 Q35 65 100 65 Q165 65 165 130" fill="none" stroke="var(--accent)" strokeWidth="12" strokeLinecap="round" />
                    <path d="M50 130 Q50 80 100 80 Q150 80 150 130" fill="none" stroke="#4caf50" strokeWidth="12" strokeLinecap="round" />
                    <path d="M65 130 Q65 95 100 95 Q135 95 135 130" fill="none" stroke="var(--primary)" strokeWidth="12" strokeLinecap="round" />
                </svg>
            </div>

            {/* Decorative Sun - Right */}
            <div className="absolute right-[5%] top-[40%] w-[100px] hidden md:block animate-[spin_20s_linear_infinite]">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="25" fill="var(--accent)" />
                    <g stroke="var(--accent)" strokeWidth="4" strokeLinecap="round">
                        <line x1="50" y1="10" x2="50" y2="20" />
                        <line x1="50" y1="80" x2="50" y2="90" />
                        <line x1="10" y1="50" x2="20" y2="50" />
                        <line x1="80" y1="50" x2="90" y2="50" />
                        <line x1="22" y1="22" x2="29" y2="29" />
                        <line x1="71" y1="71" x2="78" y2="78" />
                        <line x1="78" y1="22" x2="71" y2="29" />
                        <line x1="29" y1="71" x2="22" y2="78" />
                    </g>
                </svg>
            </div>

            <div className="container mx-auto px-5 max-w-[1180px]">
                <div className="text-center mb-[60px]">
                    <span className="text-[3rem] mb-4 block text-primary">🎨</span>
                    <h2 className="text-[2.5rem] mb-[15px] font-heading font-bold text-heading">Our Classes</h2>
                    <p className="text-text-light">Explore our fun and engaging programs designed for young learners</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] mb-[50px]">
                    {classes.map((classItem, index) => (
                        <div key={index} className="bg-white shadow-md transition-transform duration-300 hover:-translate-y-2.5 rounded group overflow-hidden">
                            <div className="h-[220px] relative overflow-hidden">
                                <img src={classItem.image} alt={classItem.title} className="w-full h-full object-cover" />
                                <div className={`absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300 ${classItem.bgClass}/20`}></div>
                            </div>
                            <div className="p-[25px] text-center border-b-4 border-transparent hover:border-current" style={{ borderColor: classItem.color }}>
                                <h4 className={`text-[1.3rem] mb-2.5 font-bold font-heading ${classItem.colorClass}`}>{classItem.title}</h4>
                                <p className="text-[0.9rem] text-text-light mb-1.5">{classItem.teacher}</p>
                                <p className="text-[0.9rem] text-text-light mb-1.5">{classItem.grade}</p>
                                <Link to={`/course/${classItem.id}`} className={`inline-block mt-[15px] py-2 px-5 text-white rounded text-[0.85rem] font-bold uppercase transition-opacity hover:opacity-100 opacity-90 ${classItem.bgClass}`}>
                                    Details →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link to="/courses" className="inline-block bg-primary text-white py-[12px] px-[28px] font-bold rounded uppercase text-[0.9rem] tracking-wide hover:bg-heading hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">View All Classes</Link>
                </div>
            </div>
        </section>
    );
};

export default ClassesSection;
