// import React from 'react';
// import InfoBar from '../components/common/InfoBar';
// import Navbar from '../components/common/Navbar';
// import Footer from '../components/common/Footer';
// import PageHero from '../components/common/PageHero';
// import api from '../api';
// import { useState, useEffect } from 'react';

// const SchoolLife = () => {
//     const [schoolInfo, setSchoolInfo] = useState(null);

//     useEffect(() => {
//         const fetchSchoolInfo = async () => {
//             try {
//                 const response = await api.get('/public/navigation');
//                 if (response.data.school) {
//                     setSchoolInfo(response.data.school);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch school info:', error);
//             }
//         };
//         fetchSchoolInfo();
//     }, []);

//     return (
//         <div className="school-life-page bg-white min-h-screen font-base">
//             <InfoBar />
//             <Navbar />

//             <PageHero
//                 title="School Life"
//                 subtitle="Life at Genius School"
//                 backgroundImage={schoolInfo?.school_life_hero_image_url || schoolInfo?.general_hero_image_url}
//                 fallbackImage="https://images.unsplash.com/photo-1526662095394-6d2cbd0a8165?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
//             />

//             {/* Welcome Intro Section */}
//             <section className="py-16 bg-[#001c3d] text-white">
//                 <div className="container mx-auto px-5 max-w-[1180px] text-center">
//                     <p className="text-[17px] leading-[1.8] opacity-90 max-w-[800px] mx-auto">
//                         Campus on a tour designed for prospective graduate and professional students. You will see how our university like, facilities, students and life in this university.
//                     </p>
//                 </div>
//             </section>

//             {/* Event and Traditions Section */}
//             <section className="py-24 px-5">
//                 <div className="container mx-auto max-w-[1180px] flex flex-col md:flex-row gap-16 items-center">
//                     {/* Left: Text Content */}
//                     <div className="w-full md:w-1/2 space-y-8">
//                         <h2 className="text-[1.8rem] md:text-[2.2rem] font-bold text-[#192f59] font-heading leading-tight">
//                             Event and Traditions
//                         </h2>
//                         <div className="space-y-6">
//                             <p className="text-[#e24b4b] text-[17px] leading-[1.8]">
//                                 Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in
//                             </p>
//                             <div className="h-[1px] bg-[#eee] w-full"></div>
//                             <p className="text-[#787878] text-[15px] leading-[1.8]">
//                                 Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Right: Image */}
//                     <div className="w-full md:w-1/2">
//                         <div className="rounded-sm overflow-hidden shadow-premium transition-transform duration-500 hover:scale-[1.02]">
//                             <img
//                                 src="https://images.unsplash.com/photo-1587652991585-6bb9e2df807e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
//                                 alt="School Bus"
//                                 className="w-full h-auto object-cover aspect-[4/3]"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Additional Content Sample */}
//             <section className="py-20 bg-[#f8f8f8] px-5">
//                 <div className="container mx-auto max-w-[1180px]">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//                         <div className="bg-white p-10 shadow-sm border-b-4 border-[#3db2d5]">
//                             <h3 className="text-xl font-bold font-heading mb-4 text-[#192f59]">Daily Activities</h3>
//                             <p className="text-[#787878] text-[15px] leading-relaxed">
//                                 Students engage in various interactive learning activities, from science experiments to creative arts, every single day.
//                             </p>
//                         </div>
//                         <div className="bg-white p-10 shadow-sm border-b-4 border-[#e24b4b]">
//                             <h3 className="text-xl font-bold font-heading mb-4 text-[#192f59]">Annual Festivals</h3>
//                             <p className="text-[#787878] text-[15px] leading-relaxed">
//                                 Our school celebrates diversity and talent through grand annual events like the Cultural Fest and Sports Day.
//                             </p>
//                         </div>
//                         <div className="bg-white p-10 shadow-sm border-b-4 border-[#fbc02d]">
//                             <h3 className="text-xl font-bold font-heading mb-4 text-[#192f59]">Student Clubs</h3>
//                             <p className="text-[#787878] text-[15px] leading-relaxed">
//                                 From Chess Club to Drama Guild, we offer a wide range of extracurricular activities for all interests.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             <Footer />
//         </div>
//     );
// };

// export default SchoolLife;
