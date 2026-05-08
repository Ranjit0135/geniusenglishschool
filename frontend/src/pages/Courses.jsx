import React from 'react';
import { Link } from 'react-router-dom';
import InfoBar from '../components/common/InfoBar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageHero from '../components/common/PageHero';
import api from '../api';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';

const CourseCard = ({ id, title, teacher, grade, image }) => (
    <div className="course-card flex flex-col bg-white border border-[#f0f0f0] rounded-sm overflow-hidden group shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="aspect-[360/240] overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div className="p-8 pb-10 flex flex-col items-start bg-white">
            <Link to={`/course/${id}`} className="text-[1.3rem] font-bold text-[#e24b4b] font-heading mb-5 hover:text-heading transition-colors cursor-pointer leading-tight block">
                {title}
            </Link>
            <div className="space-y-1.5 mb-8">
                <p className="text-[14px] font-bold text-[#787878]">
                    Teacher : <span className="font-medium text-[#787878]/80">{teacher}</span>
                </p>
                <p className="text-[14px] font-bold text-[#787878]">
                    Grade : <span className="font-medium text-[#787878]/80">{grade}</span>
                </p>
            </div>
            <Link to={`/course/${id}`} className="text-[#3db2d5] font-bold text-[13px] flex items-center gap-2 hover:text-heading transition-colors">
                Read More <span className="text-lg">→</span>
            </Link>
        </div>
    </div>
);

const Courses = () => {
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchoolInfo = async () => {
            try {
                const response = await api.get('/public/navigation');
                if (response.data.school) {
                    setSchoolInfo(response.data.school);
                }
            } catch (error) {
                console.error('Failed to fetch school info:', error);
            }
        };

        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/ui/courses');
                setCourses(response.data || []);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchoolInfo();
        fetchCourses();
    }, []);

    return (
        <div className="courses-page font-base text-[#666] bg-white">
            <InfoBar />
            <Navbar />
            <PageHero
                title="Our Courses"
                subtitle="Best Learning Programs"
                backgroundImage={getImageUrl(schoolInfo?.courses_hero_image_url || schoolInfo?.general_hero_image_url)}
                fallbackImage="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            />
            {/* Courses Grid Area */}
            <div className="py-24 px-5">
                <div className="container mx-auto max-w-[1180px]">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                            {courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    id={course.id}
                                    title={course.title}
                                    teacher={course.teacher}
                                    grade={course.grade}
                                    image={getImageUrl(course.image_url)}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && courses.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No courses available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Courses;
