import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import api from '../api';
import { getImageUrl } from '../utils/imageUtils';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/ui/courses/${id}`);
                setCourse(response.data);
            } catch (err) {
                console.error('Failed to fetch course details:', err);
                setError('Failed to load course details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <InfoBar />
                <Navbar />
                <div className="flex justify-center items-center py-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e24b4b]"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-white">
                <InfoBar />
                <Navbar />
                <div className="container mx-auto px-5 py-40 text-center max-w-[1180px]">
                    <h2 className="text-2xl font-bold text-heading mb-6">{error || 'Course not found'}</h2>
                    <Link to="/courses" className="text-[#3db2d5] font-bold hover:underline">
                        Back to Courses
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const curriculum = Array.isArray(course.curriculum) ? course.curriculum : [];

    return (
        <div className="course-details-page bg-white min-h-screen font-base">
            <InfoBar />
            <Navbar />

            <main className="container mx-auto px-5 py-20 max-w-[1180px]">
                {/* Course Title */}
                <h1 className="text-[2.5rem] md:text-[3rem] font-bold text-[#192f59] font-heading mb-16 leading-tight">
                    {course.title}
                </h1>

                {/* Content Section */}
                <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                    {/* Left: Image */}
                    <div className="w-full md:w-5/12">
                        <div className="rounded-sm overflow-hidden shadow-sm">
                            <img
                                src={getImageUrl(course.image_url)}
                                alt={course.title}
                                className="w-full h-auto object-cover aspect-[4/5]"
                            />
                        </div>
                    </div>

                    {/* Right: Info and Description */}
                    <div className="w-full md:w-7/12">
                        {/* Red Info Box */}
                        <div className="bg-[#e24b4b] text-white p-10 md:p-12 rounded-sm mb-12 shadow-md">
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <span className="text-[15px] font-bold w-24">Teacher</span>
                                    <span className="text-[15px] font-medium opacity-90">{course.teacher || 'TBA'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-[15px] font-bold w-24">Grade</span>
                                    <span className="text-[15px] font-medium opacity-90">{course.grade || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description Text */}
                        <div className="space-y-8">
                            {course.sub_description && (
                                <p className="text-[#e24b4b] text-[1.2rem] font-medium leading-[1.8] italic md:not-italic">
                                    {course.sub_description}
                                </p>
                            )}

                            <div className="h-[1px] bg-[#eee] w-full"></div>

                            <div className="text-[#787878] text-[15px] leading-[1.8] space-y-6">
                                <p>{course.description}</p>
                                <p>{course.detailed_text}</p>
                            </div>

                            {/* Curriculum List */}
                            {curriculum.length > 0 && (
                                <ul className="space-y-4 pt-4">
                                    {curriculum.map((item, index) => (
                                        <li key={index} className="flex items-center gap-4 text-[#787878] text-[15px] group">
                                            <div className="w-5 h-5 rounded-full border-2 border-[#eee] flex items-center justify-center group-hover:border-[#3db2d5] transition-colors duration-300">
                                                <div className="w-2 h-2 rounded-full bg-[#3db2d5] opacity-60"></div>
                                            </div>
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CourseDetails;
