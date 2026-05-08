import React, { useState, useEffect } from 'react';

const NoticePopup = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show popup after a short delay
        const timer = setTimeout(() => {
            const hasSeenNotice = sessionStorage.getItem('hasSeenNotice');
            if (!hasSeenNotice) {
                setIsOpen(true);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsOpen(false);
        sessionStorage.setItem('hasSeenNotice', 'true');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
                onClick={closePopup}
            ></div>

            {/* Popup Card */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] relative z-10 overflow-hidden animate-fadeInUp">
                {/* Header Accent */}
                <div className="h-2 bg-secondary w-full"></div>

                <div className="p-8 md:p-10">
                    {/* Close Button */}
                    <button
                        onClick={closePopup}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center rounded-full">
                            <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-heading font-heading">Latest Notice</h3>
                    </div>

                    <div className="space-y-4 mb-8">
                        <p className="text-[#555] text-lg leading-relaxed font-medium">
                            Admissions for the **Academic Session 2024-25** are now officially open for Pre-K to Grade 10!
                        </p>
                        <p className="text-[#777] leading-relaxed">
                            Join our community of learners today. Early bird discounts are available for new enrollments before March 15th.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={closePopup}
                            className="flex-1 bg-secondary text-white py-4 px-6 rounded-xl font-bold uppercase tracking-widest hover:bg-secondary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-secondary/20"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticePopup;
